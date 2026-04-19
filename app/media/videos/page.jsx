"use client"

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import { Play, Calendar, Eye, Search, Filter, Clock, Video } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { videos } from '@/src/data/videos'

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ['All', ...new Set(videos.map(video => video.category))]

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <HeroBanner
          title="Videos"
          description="Educational content, documentaries, and event highlights"
          badgeText="Video Content"
          badgeIcon={Video}
        />

        {/* Search and Filter Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="text-gray-500 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Videos Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video) => (
                <Link key={video.id} href={`/media/videos/${video.slug}`} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer">
                        <Play className="w-6 h-6 text-[#0396FF] ml-1" />
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 bg-[#0396FF] text-white text-xs font-medium px-2 py-1 rounded">
                      {video.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-serif font-bold text-[#1A365D] mb-2 line-clamp-2 group-hover:text-[#0396FF] transition-colors duration-300">
                      {video.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {video.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {video.views} views
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {video.publishDate}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-500 mb-2">No videos found</h3>
                <p className="text-gray-400">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Playlist Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-4">
                {videos[0]?.featuredPlaylist?.title || "Featured Playlist"}
              </h2>
              <p className="text-gray-600">
                {videos[0]?.featuredPlaylist?.description || "Educational series on sustainable energy and environmental protection"}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={videos[0]?.featuredPlaylist?.thumbnail || "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop"}
                    alt={videos[0]?.featuredPlaylist?.title || "Energy Transitions Series"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer">
                      <Play className="w-6 h-6 text-[#0396FF] ml-1" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-4">
                    {videos[0]?.featuredPlaylist?.title || "Energy Transitions Explained"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {videos[0]?.featuredPlaylist?.description || "A comprehensive educational series breaking down complex energy concepts for policymakers, students, and the public. Learn about renewable technologies, grid integration, and sustainable development."}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span>{videos[0]?.featuredPlaylist?.videoCount || "12"} videos</span>
                    <span>•</span>
                    <span>{videos[0]?.featuredPlaylist?.totalDuration || "2.5 hours"} total</span>
                    <span>•</span>
                    <span>{videos[0]?.featuredPlaylist?.totalViews || "45K+"} views</span>
                  </div>
                  <button className="bg-[#0396FF] text-white px-6 py-3 rounded-lg hover:bg-[#0396FF]/90 transition-colors duration-300 font-medium">
                    Watch Series
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

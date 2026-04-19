"use client"

import React, { useState } from 'react'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Play, Pause, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Clock, Eye, Calendar } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { videos } from '@/src/data/videos'

export default function VideoDetailPage({ params }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  
  const video = videos.find(video => video.slug === params.slug)

  if (!video) {
    notFound()
  }

  const relatedVideos = video.relatedVideos 
    ? videos.filter(v => video.relatedVideos.includes(v.id))
    : videos.filter(v => v.id !== video.id && v.category === video.category).slice(0, 3)

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner Section */}
        <section className="relative h-[30vh] min-h-[300px] w-full">
          <div className="absolute inset-0">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
          </div>
          
          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto px-6 pt-20">
            <div className="text-center max-w-4xl">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="bg-[#0396FF] text-white text-sm font-medium px-3 py-1 rounded-full">
                  {video.category}
                </span>
                <div className="flex items-center text-white/80 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {video.date}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {video.duration}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Eye className="w-4 h-4 mr-1" />
                  {video.views.toLocaleString()} views
                </div>
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight">
                {video.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                {video.description}
              </p>
            </div>
          </div>
        </section>

        {/* Back Navigation */}
        <section className="py-6 bg-gray-50">
          <div className="container mx-auto px-6">
            <Link 
              href="/media/videos"
              className="inline-flex items-center text-[#0396FF] hover:text-[#0396FF]/80 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Videos
            </Link>
          </div>
        </section>

        {/* Video Player Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              {/* Video Player */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-8">
                {!isPlaying ? (
                  <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300">
                        <Play className="w-8 h-8 text-[#0396FF] ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={video.videoUrl}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Video Information */}
                <div className="lg:col-span-2">
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {video.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {video.duration}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      {video.views.toLocaleString()} views
                    </div>
                    <span className="bg-blue-50 text-[#0396FF] px-2 py-1 rounded text-xs font-medium">
                      {video.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#1A365D] mb-4 leading-tight">
                    {video.title}
                  </h1>

                  {/* Description */}
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {video.description}
                  </p>

                  {/* Share Buttons */}
                  <div className="flex items-center justify-between mb-8 pb-6 border-b">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">Share:</span>
                      <button className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
                        <Facebook className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-300">
                        <Twitter className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 bg-blue-800 text-white rounded-lg flex items-center justify-center hover:bg-blue-900 transition-colors duration-300">
                        <Linkedin className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[#1A365D] mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Transcript */}
                  {video.transcript && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#1A365D]">Transcript</h3>
                        <button
                          onClick={() => setShowTranscript(!showTranscript)}
                          className="text-[#0396FF] hover:text-[#0396FF]/80 transition-colors duration-300 text-sm font-medium"
                        >
                          {showTranscript ? 'Hide' : 'Show'} Transcript
                        </button>
                      </div>
                      
                      {showTranscript && (
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                            {video.transcript}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Related Videos */}
                  {relatedVideos.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-[#1A365D] mb-4">Related Videos</h3>
                      <div className="space-y-4">
                        {relatedVideos.map((relatedVideo) => (
                          <Link
                            key={relatedVideo.id}
                            href={`/media/videos/${relatedVideo.slug}`}
                            className="flex gap-3 group"
                          >
                            <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                              <Image
                                src={relatedVideo.thumbnail}
                                alt={relatedVideo.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                <Play className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-[#1A365D] group-hover:text-[#0396FF] transition-colors duration-300 line-clamp-2 mb-1">
                                {relatedVideo.title}
                              </h4>
                              <p className="text-xs text-gray-500">{relatedVideo.duration}</p>
                              <p className="text-xs text-gray-500">{relatedVideo.views.toLocaleString()} views</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      <Link
                        href="/media/videos"
                        className="block text-center mt-6 text-[#0396FF] hover:text-[#0396FF]/80 transition-colors duration-300 text-sm font-medium"
                      >
                        View All Videos
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More Videos Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-bold text-[#1A365D]">
                  More {video.category} Videos
                </h2>
                <Link
                  href="/media/videos"
                  className="text-[#0396FF] hover:text-[#0396FF]/80 transition-colors duration-300 font-medium"
                >
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos
                  .filter(v => v.id !== video.id && v.category === video.category)
                  .slice(0, 6)
                  .map((categoryVideo) => (
                    <Link
                      key={categoryVideo.id}
                      href={`/media/videos/${categoryVideo.slug}`}
                      className="group"
                    >
                      <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3">
                        <Image
                          src={categoryVideo.thumbnail}
                          alt={categoryVideo.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                            <Play className="w-5 h-5 text-[#0396FF] ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {categoryVideo.duration}
                        </div>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-[#1A365D] group-hover:text-[#0396FF] transition-colors duration-300 mb-2 line-clamp-2">
                        {categoryVideo.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {categoryVideo.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        {categoryVideo.views.toLocaleString()} views • {categoryVideo.date}
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* Subscribe CTA */}
        <section className="py-16 bg-[#0396FF]">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-white mb-4">
                Don't Miss Our Latest Videos
              </h2>
              <p className="text-blue-100 mb-8">
                Subscribe to our newsletter to be notified when we publish new educational content and documentaries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
                <button className="bg-white text-[#0396FF] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

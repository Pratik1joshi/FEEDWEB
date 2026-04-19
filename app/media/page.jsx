"use client"

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import { Calendar, ArrowRight, Play, Image as ImageIcon, FileText, Newspaper, Camera, Edit3 } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export default function MediaPage() {
  const mediaCategories = [
    {
      title: "News & Updates",
      description: "Latest news, announcements, and updates from FEED",
      icon: Newspaper,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop",
      href: "/media/news",
      count: "25+ articles"
    },
    {
      title: "Press Releases",
      description: "Official announcements and media resources",
      icon: FileText,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      href: "/media/press",
      count: "15+ releases"
    },
    {
      title: "Videos",
      description: "Educational content, documentaries, and event highlights",
      icon: Play,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
      href: "/media/videos",
      count: "50+ videos"
    },
    {
      title: "Photo Gallery",
      description: "Visual stories from our projects and events",
      icon: Camera,
      image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop",
      href: "/media/gallery",
      count: "200+ photos"
    },
    {
      title: "Blog",
      description: "Insights, stories, and perspectives on sustainable development",
      icon: Edit3,
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop",
      href: "/media/blog",
      count: "40+ articles"
    },
    {
      title: "Publications",
      description: "Research papers, reports, and policy documents",
      icon: FileText,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
      href: "/publications",
      count: "30+ publications"
    }
  ]

  const featuredContent = [
    {
      type: "News",
      title: "FEED to Host International Climate Finance Summit",
      excerpt: "Leading experts will gather to discuss innovative funding mechanisms for climate adaptation projects.",
      image: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=800&h=500&fit=crop",
      date: "June 10, 2025",
      href: "/media/news"
    },
    {
      type: "Video",
      title: "Energy Transitions Explained - New Series",
      excerpt: "Educational series breaking down complex energy concepts for policymakers and the public.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop",
      date: "April 15, 2025",
      href: "/media/videos"
    },
    {
      type: "Blog",
      title: "The Future of Community-Based Renewable Energy",
      excerpt: "Exploring how local communities can take ownership of their energy future through innovative solutions.",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=500&fit=crop",
      date: "May 15, 2025",
      href: "/media/blog"
    }
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <HeroBanner
          title="Media Center"
          description="Stay connected with our latest news, insights, and visual stories from the field"
          badgeText="Stay Connected"
          badgeIcon={Camera}
        />

        {/* Media Categories Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-[#1A365D] mb-4">
                Explore Our Media
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover our comprehensive collection of media content across different formats and topics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mediaCategories.map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-[#0396FF]" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                      {category.count}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#0396FF] transition-colors duration-300">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <div className="text-[#0396FF] font-medium inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                      Explore <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Content */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-[#1A365D] mb-4">
                Featured Content
              </h2>
              <p className="text-lg text-gray-600">
                Highlighted stories and content from across our media channels
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredContent.map((content, index) => (
                <article key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={content.image}
                      alt={content.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-[#0396FF] text-white text-xs font-medium px-3 py-1 rounded-full">
                      {content.type}
                    </div>
                    {content.type === "Video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-[#0396FF] ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {content.date}
                    </div>
                    
                    <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#0396FF] transition-colors duration-300">
                      {content.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {content.excerpt}
                    </p>
                    
                    <Link 
                      href={content.href}
                      className="text-[#0396FF] font-medium inline-flex items-center hover:text-[#0396FF]/80 transition-colors duration-300"
                    >
                      Read More <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-[#0396FF]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">200+</div>
                <div className="text-blue-100">Photos</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Videos</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">40+</div>
                <div className="text-blue-100">Blog Articles</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">25+</div>
                <div className="text-blue-100">News Articles</div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-4">
                Stay Updated
              </h2>
              <p className="text-gray-600 mb-8">
                Subscribe to our newsletter to receive the latest media updates and exclusive content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
                />
                <button className="bg-[#0396FF] text-white px-6 py-3 rounded-lg hover:bg-[#0396FF]/90 transition-colors duration-300 font-medium">
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

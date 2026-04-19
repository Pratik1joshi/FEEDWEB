"use client"

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import { Image as ImageIcon, Search } from "lucide-react"

export default function GalleryPage() {
  const [loading, setLoading] = useState(true)
  const [galleries, setGalleries] = useState([])

  useEffect(() => {
    // Placeholder for future API integration
    // const fetchGalleries = async () => { ... }
    
    // Simulating empty load
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <HeroBanner 
        title="Image Gallery"
        subtitle="Explore our visual journey through projects, events, and initiatives"
        backgroundImage="https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&q=80"
      />

      <div className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : galleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Map over galleries once API is connected */}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No galleries found</h3>
            <p className="text-gray-500">Check back later for new photos and albums.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

"use client"

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import RichContentRenderer from '@/components/RichContentRenderer'
import { publicationsApi } from '@/src/lib/api-services'
import { Download, ArrowRight, Search, Calendar, Tag, FileText, BookOpen } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export default function PublicationsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [publications, setPublications] = useState([])
  const [featuredPublication, setFeaturedPublication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [publicationTypes, setPublicationTypes] = useState(['All', 'Research Report', 'Policy Brief', 'Case Study', 'White Paper'])

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await publicationsApi.getAll({ 
          limit: 100,
          sortBy: 'created_at',
          sortOrder: 'DESC'
        })
        
        if (response.success && response.data) {
          const allPubs = response.data
          if (allPubs.length > 0) {
            setFeaturedPublication(allPubs[0])
            setPublications(allPubs)
            
            // Extract unique types from data
            const types = ['All', ...new Set(allPubs.map(pub => pub.type).filter(Boolean))]
            setPublicationTypes(types)
          }
        } else if (Array.isArray(response)) {
          const allPubs = response
          if (allPubs.length > 0) {
            setFeaturedPublication(allPubs[0])
            setPublications(allPubs)
            
            const types = ['All', ...new Set(allPubs.map(pub => pub.type).filter(Boolean))]
            setPublicationTypes(types)
          }
        } else {
          setPublications([])
        }
      } catch (err) {
        console.error('Error fetching publications:', err)
        setError(err.message)
        setPublications([])
      } finally {
        setLoading(false)
      }
    }

    fetchPublications()
  }, [])

  // Filter and search publications
  const filteredPublications = activeFilter === 'All' 
    ? publications 
    : publications.filter(pub => pub.type === activeFilter)
  
  const searchedPublications = searchQuery === ''
    ? filteredPublications
    : filteredPublications.filter(pub => 
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (pub.content && pub.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pub.abstract && pub.abstract.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pub.author && pub.author.toLowerCase().includes(searchQuery.toLowerCase()))
      )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <HeroBanner
          title="Publications"
          description="Research papers, policy briefs, and reports from our experts"
          badgeText="Knowledge & Research"
          badgeIcon={BookOpen}
        />

        {/* Search and Filter Section */}
        <section className="py-10 bg-white border-b">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="relative w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full md:w-80 pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-[#1A365D] transition duration-150 ease-in-out"
                  placeholder="Search publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="w-full md:w-auto overflow-x-auto">
                <div className="flex space-x-2 pb-3 md:pb-0 min-w-max">
                  {publicationTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveFilter(type)}
                      disabled={loading}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap disabled:opacity-50 ${
                        activeFilter === type
                          ? "bg-[#1A365D] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A365D]"></div>
                <span className="ml-3 text-gray-600">Loading publications...</span>
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && !loading && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
                <p className="font-medium">Unable to load publications</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </section>
        )}

        {/* Content - only show when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Featured Publication */}
            {featuredPublication && (
              <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
              <div className="mb-12">
                <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-8">Featured Publication</h2>
                <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md grid md:grid-cols-7 gap-0">
                  <div className="md:col-span-3 h-80 md:h-auto">
                    <img 
                      src={featuredPublication.image_url || "/placeholder.svg?height=400&width=600"} 
                      alt={featuredPublication.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-4 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-4">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">{formatDate(featuredPublication.created_at)}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <Tag className="w-4 h-4 text-[#B22234] mr-2" />
                        <span className="text-sm font-medium text-[#B22234]">{featuredPublication.type || 'Publication'}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1A365D] mb-4">{featuredPublication.title}</h3>
                      <div className="text-gray-600 mb-6">
                        <RichContentRenderer 
                          content={featuredPublication.abstract || featuredPublication.content}
                          maxHeight="120px"
                          showExpandButton={true}
                        />
                      </div>
                      {featuredPublication.author && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          <span className="inline-block bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                            {featuredPublication.author}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <FileText className="w-4 h-4 mr-2" />
                        <span>PDF{featuredPublication.file_size ? ` · ${featuredPublication.file_size}` : ''}</span>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          href={`/publications/${featuredPublication.slug || featuredPublication.id}`}
                          className="inline-flex items-center text-[#1A365D] border border-[#1A365D] px-4 py-2 rounded-md hover:bg-[#1A365D] hover:text-white transition-all duration-300"
                        >
                          Read More <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                        {featuredPublication.file_url && (
                          <a
                            href={featuredPublication.file_url}
                            download
                            className="inline-flex items-center bg-[#1A365D] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-all duration-300"
                          >
                            <Download className="mr-2 w-4 h-4" /> Download
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Publications List */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-serif font-bold text-[#1A365D]">
                {searchQuery ? 'Search Results' : 'All Publications'}
                {searchedPublications.length > 0 && <span className="text-gray-500 ml-2 text-lg">({searchedPublications.length})</span>}
              </h2>
              <div className="text-gray-500 text-sm">
                Sorted by: <span className="font-medium text-[#1A365D]">Most Recent</span>
              </div>
            </div>

            {searchedPublications.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No publications found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchedPublications.map((publication) => (
                  <div
                    key={publication.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={publication.image_url || "/placeholder.svg?height=300&width=400"}
                        alt={publication.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center mb-3">
                        <span className="text-sm text-gray-500">{formatDate(publication.created_at)}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-sm font-medium text-[#B22234]">{publication.type || 'Publication'}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3 hover:text-[#0396FF] transition-colors duration-300">
                        <Link href={`/publications/${publication.slug || publication.id}`}>
                          {publication.title}
                        </Link>
                      </h3>
                      <div className="text-gray-600 text-sm mb-4 flex-grow">
                        <RichContentRenderer 
                          content={publication.abstract || publication.content}
                          maxHeight="80px"
                        />
                      </div>
                      {publication.author && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          <span className="inline-block bg-blue-50 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                            {publication.author}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-xs text-gray-500">
                          PDF{publication.file_size ? ` · ${publication.file_size}` : ''}
                        </div>
                        <Link
                          href={`/publications/${publication.slug || publication.id}`}
                          className="text-[#1A365D] font-medium inline-flex items-center hover:text-[#B22234] transition-colors duration-300"
                        >
                          Read More <ArrowRight className="ml-2 w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-[#1A365D]">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-white mb-4">Stay Updated</h2>
              <p className="text-blue-100 mb-8">
                Subscribe to our newsletter to receive updates on new publications, research findings, and events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0396FF] flex-grow max-w-md"
                />
                <button className="bg-[#B22234] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
        </>
        )}

      </main>
      <Footer />
    </>
  )
}

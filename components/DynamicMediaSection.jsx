"use client"

import { useState, useEffect } from 'react'
import { newsApi, pagesApi } from '@/src/lib/api-services'
import RichContentRenderer from './RichContentRenderer'
import { Calendar, ArrowRight, ExternalLink, Play } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_MEDIA_SECTION_META = {
  header: {
    badgeText: 'News & Media',
    title: 'Latest News & Media',
    subtitle: 'Stay updated with our latest developments, achievements, and industry insights',
    ctaText: 'View All Media',
    ctaLink: '/media',
  },
  messages: {
    loading: 'Loading media...',
    empty: 'Check back soon for the latest news and updates.',
    error: 'Unable to load media content. Please try again later.',
  },
}

const normalizeMediaSectionMeta = (rawMeta) => {
  const meta = rawMeta && typeof rawMeta === 'object' ? rawMeta : {}
  return {
    ...DEFAULT_MEDIA_SECTION_META,
    ...meta,
    header: {
      ...DEFAULT_MEDIA_SECTION_META.header,
      ...(meta.header || {}),
    },
    messages: {
      ...DEFAULT_MEDIA_SECTION_META.messages,
      ...(meta.messages || {}),
    },
  }
}

export default function DynamicMediaSection({ 
  title = "Latest News & Media", 
  subtitle = "Stay updated with our latest developments, achievements, and industry insights",
  limit = 6,
  showType = "all" // "all", "news", "press", "media"
}) {
  const [mediaItems, setMediaItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sectionMeta, setSectionMeta] = useState(() =>
    normalizeMediaSectionMeta({
      header: {
        title,
        subtitle,
      },
    }),
  )

  useEffect(() => {
    let isMounted = true

    const fetchSectionMeta = async () => {
      try {
        const response = await pagesApi.getBySlug('media-section')
        if (!isMounted) return

        if (response.success && response.data) {
          setSectionMeta(normalizeMediaSectionMeta(response.data.meta_data))
        }
      } catch (err) {
        if (`${err?.message || ''}`.toLowerCase().includes('page not found')) {
          return
        }
        console.warn('Failed to load media-section metadata, using defaults', err)
      }
    }

    fetchSectionMeta()

    return () => {
      isMounted = false
    }
  }, [title, subtitle])

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await newsApi.getAll({ 
          limit: limit,
          sortBy: 'created_at',
          sortOrder: 'DESC'
        })
        
        if (response.success && response.data) {
          let items = response.data
          if (showType !== "all") {
            items = items.filter(item => 
              item.type && item.type.toLowerCase() === showType.toLowerCase()
            )
          }
          setMediaItems(items.slice(0, limit))
        } else if (Array.isArray(response)) {
          let items = response
          if (showType !== "all") {
            items = items.filter(item => 
              item.type && item.type.toLowerCase() === showType.toLowerCase()
            )
          }
          setMediaItems(items.slice(0, limit))
        } else {
          console.warn('Unexpected API response format:', response)
          setMediaItems([])
        }
      } catch (err) {
        console.error('Error fetching media:', err)
        setError(err.message)
        setMediaItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [limit, showType])

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif font-bold text-[#1A365D] mb-6">{sectionMeta.header.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{sectionMeta.header.subtitle}</p>
          </div>
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A365D]"></div>
            <span className="ml-4 text-gray-600 text-lg">{sectionMeta.messages.loading}</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif font-bold text-[#1A365D] mb-6">{sectionMeta.header.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{sectionMeta.header.subtitle}</p>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
            <p className="font-medium text-lg">{sectionMeta.messages.error}</p>
            <p className="text-base">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'news':
        return 'bg-blue-100 text-blue-800'
      case 'press':
        return 'bg-green-100 text-green-800'
      case 'media':
        return 'bg-purple-100 text-purple-800'
      case 'video':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block bg-[#00966a] text-white text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-4 shadow-sm">
            {sectionMeta.header.badgeText}
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-4">
            {sectionMeta.header.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            {sectionMeta.header.subtitle}
          </p>
        </div>

        {mediaItems.length === 0 ? (
          <div className="text-center py-16">
            <ExternalLink className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-3">No media content available</h3>
            <p className="text-gray-600 text-lg">{sectionMeta.messages.empty}</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {mediaItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border"
                >
                  {/* Media Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image_url || "/placeholder.svg?height=300&width=400"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${getTypeColor(item.type)}`}>
                        {item.type || 'News'}
                      </span>
                    </div>

                    {/* Video Play Button */}
                    {item.type?.toLowerCase() === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-black bg-opacity-70 rounded-full flex items-center justify-center group-hover:bg-opacity-90 transition-all">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Media Content */}
                  <div className="p-6">
                    {/* Date */}
                    <div className="flex items-center text-sm text-[#0396FF] mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">{formatDate(item.created_at)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#0396FF] transition-colors">
                      {item.title}
                    </h3>

                    {/* Excerpt/Content */}
                    <div className="text-gray-600 text-sm mb-4">
                      <RichContentRenderer 
                        content={item.content || item.excerpt}
                        maxHeight="80px"
                      />
                    </div>

                    {/* Author */}
                    {item.author && (
                      <div className="text-xs text-gray-500 mb-4">
                        By {item.author}
                      </div>
                    )}

                    {/* Tags */}
                    {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/media/news/${item.slug || item.id}`}
                        className="text-[#0396FF] font-medium inline-flex items-center hover:text-[#1A365D] transition-colors duration-300"
                      >
                        Read More <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                      
                      {item.external_url && (
                        <a
                          href={item.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-[#0396FF] transition-colors duration-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Published Status */}
                    {item.is_published === false && (
                      <div className="mt-3 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        Draft
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* View All Media Link */}
            {sectionMeta.header.ctaText && (
              <div className="text-center mt-12">
                <Link
                  href={sectionMeta.header.ctaLink || '/media'}
                  className="inline-flex items-center bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium"
                >
                  {sectionMeta.header.ctaText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

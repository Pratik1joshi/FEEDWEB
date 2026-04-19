"use client"

import { useState, useEffect } from 'react'
import { publicationsApi, pagesApi } from '@/src/lib/api-services'
import RichContentRenderer from './RichContentRenderer'
import { ArrowRight, Download, FileText, Calendar } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_PUBLICATIONS_SECTION_META = {
  header: {
    badgeText: 'Publications',
    title: 'Latest Publications',
    subtitle:
      'Explore our research papers, policy briefs, and reports that provide valuable insights on energy and environmental challenges.',
    ctaText: 'View All Publications',
    ctaLink: '/publications',
  },
  messages: {
    loading: 'Loading publications...',
    empty: 'Check back soon for our latest research and reports.',
    error: 'Unable to load publications. Please try again later.',
  },
}

const normalizePublicationsSectionMeta = (rawMeta) => {
  const meta = rawMeta && typeof rawMeta === 'object' ? rawMeta : {}
  return {
    ...DEFAULT_PUBLICATIONS_SECTION_META,
    ...meta,
    header: {
      ...DEFAULT_PUBLICATIONS_SECTION_META.header,
      ...(meta.header || {}),
    },
    messages: {
      ...DEFAULT_PUBLICATIONS_SECTION_META.messages,
      ...(meta.messages || {}),
    },
  }
}

export default function DynamicPublications({ 
  title = "Latest Publications", 
  subtitle = "Explore our research papers, policy briefs, and reports that provide valuable insights on energy and environmental challenges.",
  limit = 4,
  showFeatured = true
}) {
  const [publications, setPublications] = useState([])
  const [featuredPublication, setFeaturedPublication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sectionMeta, setSectionMeta] = useState(() =>
    normalizePublicationsSectionMeta({
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
        const response = await pagesApi.getBySlug('publications-section')
        if (!isMounted) return

        if (response.success && response.data) {
          setSectionMeta(normalizePublicationsSectionMeta(response.data.meta_data))
        }
      } catch (err) {
        if (`${err?.message || ''}`.toLowerCase().includes('page not found')) {
          return
        }
        console.warn('Failed to load publications-section metadata, using defaults', err)
      }
    }

    fetchSectionMeta()

    return () => {
      isMounted = false
    }
  }, [title, subtitle])

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await publicationsApi.getAll({ 
          limit: limit + (showFeatured ? 1 : 0),
          sortBy: 'created_at',
          sortOrder: 'DESC'
        })
        
        if (response.success && response.data) {
          const allPubs = response.data
          if (showFeatured && allPubs.length > 0) {
            setFeaturedPublication(allPubs[0])
            setPublications(allPubs.slice(1, limit + 1))
          } else {
            setPublications(allPubs.slice(0, limit))
          }
        } else if (Array.isArray(response)) {
          const allPubs = response
          if (showFeatured && allPubs.length > 0) {
            setFeaturedPublication(allPubs[0])
            setPublications(allPubs.slice(1, limit + 1))
          } else {
            setPublications(allPubs.slice(0, limit))
          }
        } else {
          console.warn('Unexpected API response format:', response)
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
  }, [limit, showFeatured])

  if (loading) {
    return (
      <section className="px-12 py-24 bg-white" id="publications">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif font-bold text-[#1A365D] mb-6">{sectionMeta.header.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{sectionMeta.header.subtitle}</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A365D]"></div>
            <span className="ml-3 text-gray-600">{sectionMeta.messages.loading}</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="px-12 py-24 bg-white" id="publications">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif font-bold text-[#1A365D] mb-6">{sectionMeta.header.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{sectionMeta.header.subtitle}</p>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
            <p className="font-medium">{sectionMeta.messages.error}</p>
            <p className="text-sm">{error}</p>
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

  return (
    <section className="px-12 py-24 bg-white" id="publications">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Featured Publication */}
          {showFeatured && featuredPublication && (
            <div className="lg:col-span-2 bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-64 overflow-hidden">
                <img
                  src={featuredPublication.image_url || "/placeholder.svg?height=400&width=600"}
                  alt={featuredPublication.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-10">
                <div className="flex items-center mb-6">
                  <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-base text-gray-500">{formatDate(featuredPublication.created_at)}</span>
                  <span className="mx-3 text-gray-300">|</span>
                  <span className="text-base font-medium text-[#B22234]">{featuredPublication.type || 'Research Report'}</span>
                </div>
                <h3 className="text-3xl font-serif font-bold text-[#1A365D] mb-4">
                  {featuredPublication.title}
                </h3>
                <div className="text-gray-600 mb-8 text-lg">
                  <RichContentRenderer 
                    content={featuredPublication.content || featuredPublication.abstract}
                    maxHeight="120px"
                  />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Link
                    href={`/publications/${featuredPublication.slug || featuredPublication.id}`}
                    className="inline-block bg-[#0396FF] text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap font-semibold text-base"
                  >
                    Read More
                  </Link>
                  {featuredPublication.file_url && (
                    <a
                      href={featuredPublication.file_url}
                      download
                      className="inline-flex items-center border border-[#1A365D] text-[#1A365D] px-6 py-3 rounded-md hover:bg-[#1A365D] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
                    >
                      <Download className="inline mr-2 w-4 h-4" /> Download
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Side Publications */}
          <div className={`${showFeatured && featuredPublication ? 'lg:col-span-3' : 'lg:col-span-5'} space-y-6`}>
            {publications.map((publication) => (
              <div
                key={publication.id}
                className="flex flex-col md:flex-row gap-6 bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden rounded-lg">
                  <img
                    src={publication.image_url || "/placeholder.svg?height=200&width=300"}
                    alt={publication.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="md:w-2/3">
                  <div className="flex items-center mb-3">
                    <span className="text-sm text-gray-500">{formatDate(publication.created_at)}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-sm font-medium text-[#B22234]">{publication.type || 'Publication'}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-2">{publication.title}</h3>
                  <div className="text-gray-600 text-sm mb-4">
                    <RichContentRenderer 
                      content={publication.content || publication.abstract}
                      maxHeight="60px"
                    />
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <Link
                      href={`/publications/${publication.slug || publication.id}`}
                      className="text-[#1A365D] font-medium inline-flex items-center hover:text-[#B22234] transition-colors duration-300 cursor-pointer"
                    >
                      Read More <ArrowRight className="ml-2 w-3 h-3" />
                    </Link>
                    {publication.file_url && (
                      <a
                        href={publication.file_url}
                        download
                        className="text-[#0396FF] font-medium inline-flex items-center hover:text-[#1A365D] transition-colors duration-300 cursor-pointer"
                      >
                        <Download className="mr-1 w-3 h-3" /> Download
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* View All Publications */}
            {sectionMeta.header.ctaText && (
              <div className="text-center pt-4">
                <Link
                  href={sectionMeta.header.ctaLink || '/publications'}
                  className="inline-block bg-[#0396FF] text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  {sectionMeta.header.ctaText}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {publications.length === 0 && !featuredPublication && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No publications available</h3>
            <p className="text-gray-600">{sectionMeta.messages.empty}</p>
          </div>
        )}
      </div>
    </section>
  )
}

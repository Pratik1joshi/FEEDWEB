"use client"

import { useState, useEffect } from 'react'
import { servicesApi, pagesApi } from '@/src/lib/api-services'
import RichContentRenderer from './RichContentRenderer'
import { ArrowRight, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_SERVICES_SECTION_META = {
  header: {
    badgeText: 'Our Expertise',
    title: 'Our Services',
    subtitle: 'Comprehensive solutions for sustainable development and environmental challenges',
    ctaText: 'View All Services',
    ctaLink: '/services',
  },
  messages: {
    loading: 'Loading services...',
    empty: 'Our services information will be available soon.',
    error: 'Unable to load services. Please try again later.',
  },
}

const normalizeServicesSectionMeta = (rawMeta) => {
  const meta = rawMeta && typeof rawMeta === 'object' ? rawMeta : {}
  return {
    ...DEFAULT_SERVICES_SECTION_META,
    ...meta,
    header: {
      ...DEFAULT_SERVICES_SECTION_META.header,
      ...(meta.header || {}),
    },
    messages: {
      ...DEFAULT_SERVICES_SECTION_META.messages,
      ...(meta.messages || {}),
    },
  }
}

export default function DynamicServicesSection({ 
  title = "Our Services", 
  subtitle = "Comprehensive solutions for sustainable development and environmental challenges",
  limit = 6,
  layout = "grid" // "grid" or "detailed"
}) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sectionMeta, setSectionMeta] = useState(() =>
    normalizeServicesSectionMeta({
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
        const response = await pagesApi.getBySlug('services-section')
        if (!isMounted) return

        if (response.success && response.data) {
          setSectionMeta(normalizeServicesSectionMeta(response.data.meta_data))
        }
      } catch (err) {
        if (`${err?.message || ''}`.toLowerCase().includes('page not found')) {
          return
        }
        console.warn('Failed to load services-section metadata, using defaults', err)
      }
    }

    fetchSectionMeta()

    return () => {
      isMounted = false
    }
  }, [title, subtitle])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await servicesApi.getAll({ 
          limit: limit,
          sortBy: 'sort_order',
          sortOrder: 'ASC'
        })
        
        if (response.success && response.data) {
          setServices(response.data.slice(0, limit))
        } else if (Array.isArray(response)) {
          setServices(response.slice(0, limit))
        } else {
          console.warn('Unexpected API response format:', response)
          setServices([])
        }
      } catch (err) {
        console.error('Error fetching services:', err)
        setError(err.message)
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [limit])

  if (loading) {
    return (
      <section className="py-24 bg-white">
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
      <section className="py-24 bg-white">
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

  const parseArrayField = (field) => {
    if (Array.isArray(field)) return field
    if (typeof field === 'string') {
      try {
        return JSON.parse(field)
      } catch {
        return []
      }
    }
    return []
  }

  const getServiceIcon = (category) => {
    const icons = {
      'consulting': '💼',
      'research': '🔬',
      'training': '📚',
      'development': '🏗️',
      'environment': '🌱',
      'technology': '💻',
      'health': '🏥',
      'education': '🎓',
      'agriculture': '🌾',
      'water': '💧',
      'energy': '⚡',
      'sustainability': '♻️',
      'policy': '📋',
      'community': '👥',
      'monitoring': '📊',
      'assessment': '📈',
      'capacity building': '🎯',
      'project management': '📊',
      default: '🔧'
    }
    
    if (!category) return icons.default
    
    const categoryLower = category.toLowerCase()
    return icons[categoryLower] || icons.default
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
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

        {services.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services available</h3>
            <p className="text-gray-600">{sectionMeta.messages.empty}</p>
          </div>
        ) : (
          <>
            {layout === "detailed" ? (
              <div className="space-y-12">
                {services.map((service, index) => (
                  <div 
                    key={service.id} 
                    className={`flex flex-col lg:flex-row gap-8 items-center ${
                      index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Service Image */}
                    <div className="lg:w-1/2">
                      <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={service.image || "/placeholder.svg?height=400&width=600"}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Service Content */}
                    <div className="lg:w-1/2">
                      <div className="mb-4">
                        {service.category && (
                          <span className="px-3 py-1 bg-[#0396FF]/10 text-[#0396FF] text-sm font-medium rounded-full">
                            {service.category}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-3xl font-serif font-bold text-[#1A365D] mb-4">
                        {service.title}
                      </h3>
                      
                      <div className="text-gray-600 mb-6">
                        <RichContentRenderer 
                          content={service.description}
                          maxHeight="200px"
                          showExpandButton={true}
                        />
                      </div>

                      {/* Key Features */}
                      {service.features && parseArrayField(service.features).length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-[#1A365D] mb-3">Key Features</h4>
                          <ul className="space-y-2">
                            {parseArrayField(service.features).slice(0, 4).map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <Link
                          href={`/services/${service.slug || service.id}`}
                          className="inline-flex items-center bg-[#0396FF] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300"
                        >
                          Learn More <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                        
                        {service.contact_info && (
                          <button className="inline-flex items-center border border-[#0396FF] text-[#0396FF] px-6 py-3 rounded-md hover:bg-[#0396FF] hover:text-white transition-all duration-300">
                            Get Quote
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                  <Link 
                    key={service.id}
                    href={`/services/${service.slug || service.id}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={service.image || "/placeholder.svg?height=400&width=600"}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>

                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        {/* Category Badge */}
                        {service.category && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 text-[#0396FF] text-xs font-bold rounded-full">
                              {service.category}
                            </span>
                          </div>
                        )}

                        {/* Service Icon */}
                        <div className="mb-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-2xl">{getServiceIcon(service.category)}</span>
                          </div>
                        </div>

                        {/* Service Title */}
                        <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                          {service.title}
                        </h3>

                        {/* Truncated Description */}
                        <div className="text-white/90 text-sm leading-relaxed">
                          {service.description ? (
                            <p className="line-clamp-3">
                              {service.description.replace(/<[^>]*>/g, '').length > 120 
                                ? `${service.description.replace(/<[^>]*>/g, '').substring(0, 120)}...`
                                : service.description.replace(/<[^>]*>/g, '')
                              }
                            </p>
                          ) : (
                            <p className="line-clamp-3">Learn more about our comprehensive service offerings and solutions.</p>
                          )}
                        </div>

                        {/* Read More Indicator */}
                        <div className="flex items-center mt-4 text-white/80 group-hover:text-white transition-colors">
                          <span className="text-sm font-medium">Learn More</span>
                          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* View All Services Link */}
            {sectionMeta.header.ctaText && (
              <div className="text-center mt-12">
                <Link
                  href={sectionMeta.header.ctaLink || '/services'}
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

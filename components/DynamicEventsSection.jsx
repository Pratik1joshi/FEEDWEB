"use client"

import { useState, useEffect, useRef } from 'react'
import { eventsApi, pagesApi } from '@/src/lib/api-services'
import RichContentRenderer from './RichContentRenderer'
import { Calendar, MapPin, Clock, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_EVENTS_SECTION_META = {
  header: {
    badgeText: 'Events & Workshops',
    title: 'Explore Recent and Upcoming Events',
    subtitle: 'Join us for conferences, workshops, and community engagement sessions',
    ctaText: 'View All Events',
    ctaLink: '/events',
  },
  messages: {
    loading: 'Loading events...',
    empty: 'Check back soon for exciting events and workshops.',
    error: 'Unable to load events. Please try again later.',
    fallbackSubtitle: 'There are no upcoming events at the moment. Explore our past events below.',
  },
}

const normalizeEventsSectionMeta = (rawMeta) => {
  const meta = rawMeta && typeof rawMeta === 'object' ? rawMeta : {}
  return {
    ...DEFAULT_EVENTS_SECTION_META,
    ...meta,
    header: {
      ...DEFAULT_EVENTS_SECTION_META.header,
      ...(meta.header || {}),
    },
    messages: {
      ...DEFAULT_EVENTS_SECTION_META.messages,
      ...(meta.messages || {}),
    },
  }
}

export default function DynamicEventsSection({ 
  title = "Upcoming Events", 
  subtitle = "Join us for conferences, workshops, and community engagement sessions",
  limit = 6,
  showPast = false
}) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isShowingFallback, setIsShowingFallback] = useState(false)
  const carouselRef = useRef(null)
  const [sectionMeta, setSectionMeta] = useState(() =>
    normalizeEventsSectionMeta({
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
        const response = await pagesApi.getBySlug('events-section')
        if (!isMounted) return

        if (response.success && response.data) {
          setSectionMeta(normalizeEventsSectionMeta(response.data.meta_data))
        }
      } catch (err) {
        if (`${err?.message || ''}`.toLowerCase().includes('page not found')) {
          return
        }
        console.warn('Failed to load events-section metadata, using defaults', err)
      }
    }

    fetchSectionMeta()

    return () => {
      isMounted = false
    }
  }, [title, subtitle])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        setIsShowingFallback(false)
        
        const response = await eventsApi.getAll({ 
          limit: limit,
          sortBy: 'event_date',
          sortOrder: 'ASC'
        })
        
        if (response.success && response.data) {
          const eventsList = response.data
          const now = new Date()
          
          if (!showPast) {
            const upcomingEvents = eventsList.filter(event => 
              new Date(event.event_date) >= now
            )
            
            if (upcomingEvents.length > 0) {
              setEvents(upcomingEvents.slice(0, limit))
            } else {
              // Fallback to recent past events in the same layout
              setIsShowingFallback(true)
              const past = eventsList.filter(event => 
                new Date(event.event_date) < now
              ).sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
              
              setEvents(past.slice(0, limit))
            }
          } else {
            setEvents(eventsList.slice(0, limit))
          }
        } else if (Array.isArray(response)) {
          const eventsList = response
          const now = new Date()
          
          if (!showPast) {
            const upcomingEvents = eventsList.filter(event => 
              new Date(event.event_date) >= now
            )
            
            if (upcomingEvents.length > 0) {
              setEvents(upcomingEvents.slice(0, limit))
            } else {
              setIsShowingFallback(true)
              const past = eventsList.filter(event => 
                new Date(event.event_date) < now
              ).sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
              
              setEvents(past.slice(0, limit))
            }
          } else {
            setEvents(eventsList.slice(0, limit))
          }
        } else {
          console.warn('Unexpected API response format:', response)
          setEvents([])
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        setError(err.message)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [limit, showPast])

  if (loading) {
    return (
      <section className="py-24 bg-gray-50">
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
      <section className="py-24 bg-gray-50">
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

  const formatTime = (timeString) => {
    if (!timeString) return ''
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const isUpcoming = (eventDate) => {
    return new Date(eventDate) >= new Date()
  }

  const scrollCarousel = (direction = 1) => {
    if (!carouselRef.current) return
    const scrollAmount = Math.round(carouselRef.current.clientWidth * 0.7)
    carouselRef.current.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block bg-[#00966a] text-white text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-4 shadow-sm">
            {sectionMeta.header.badgeText}
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-4">
            {sectionMeta.header.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            {isShowingFallback 
              ? sectionMeta.messages.fallbackSubtitle
              : sectionMeta.header.subtitle}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-3">No events found</h3>
            <p className="text-gray-600 text-lg">{sectionMeta.messages.empty}</p>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  type="button"
                  onClick={() => scrollCarousel(-1)}
                  className="shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 text-[#1A365D] hover:bg-[#0396FF] hover:text-white transition-colors flex items-center justify-center shadow-md"
                  aria-label="Scroll events left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div
                  ref={carouselRef}
                  className="events-carousel flex-1 flex gap-2 overflow-x-auto pb-3 snap-x snap-mandatory px-1 md:px-2"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
              {events.slice(0, limit).map((event) => (
                <div
                  key={event.id}
                  className="snap-start shrink-0 w-[285px] md:w-[305px] lg:w-[325px] bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
                >
                  {/* Event Image */}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={event.image_url || "/placeholder.svg?height=200&width=300"}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                        isUpcoming(event.event_date) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isUpcoming(event.event_date) ? 'Upcoming' : 'Past Event'}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-5">
                    {/* Event Date & Time */}
                    <div className="flex items-center text-sm text-[#0396FF] mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">{formatDate(event.event_date)}</span>
                      {event.start_time && (
                        <>
                          <Clock className="w-4 h-4 ml-3 mr-2" />
                          <span className="text-sm">{formatTime(event.start_time)}</span>
                        </>
                      )}
                    </div>

                    {/* Event Title */}
                    <h3 className="text-lg font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#0396FF] transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Event Description */}
                    <div className="text-gray-600 text-sm mb-4 line-clamp-2">
                      <RichContentRenderer 
                        content={event.description}
                        maxHeight="40px"
                      />
                    </div>

                    {/* Event Location */}
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}

                    {/* Event Capacity */}
                    {event.capacity && (
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <Users className="w-3.5 h-3.5 mr-2" />
                        <span>Capacity: {event.capacity} attendees</span>
                      </div>
                    )}

                    {/* Event Type */}
                    {event.type && (
                      <div className="mb-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-medium rounded uppercase tracking-wide">
                          {event.type}
                        </span>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex justify-between items-center mt-auto pt-2">
                      <Link
                        href={`/events/${event.slug || event.id}`}
                        className="text-[#0396FF] font-medium text-sm inline-flex items-center hover:text-[#1A365D] transition-colors duration-300"
                      >
                        Learn More <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                      </Link>
                      
                      {isUpcoming(event.event_date) && event.registration_url && (
                        <a
                          href={event.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#0396FF] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-opacity-90 transition-all duration-300"
                        >
                          Register
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

                </div>

                <button
                  type="button"
                  onClick={() => scrollCarousel(1)}
                  className="shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 text-[#1A365D] hover:bg-[#0396FF] hover:text-white transition-colors flex items-center justify-center shadow-md"
                  aria-label="Scroll events right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-1">Scroll horizontally to explore more events.</p>

            {/* View All Events Link */}
            {sectionMeta.header.ctaText && (
              <div className="text-center mt-12">
                <Link
                  href={sectionMeta.header.ctaLink || '/events'}
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
      <style jsx>{`
        .events-carousel::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

"use client"

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import RichContentRenderer from '@/components/RichContentRenderer'
import Link from 'next/link'
import { Calendar, MapPin, Users, Clock, Search, Filter, ArrowRight, User, Loader } from 'lucide-react'
import { eventsApi } from '@/lib/api-services'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const categories = ['all']
  const statuses = ['all', 'upcoming', 'ongoing', 'completed']

  // Load events from API
  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const response = await eventsApi.getAll()
      console.log('Events API response:', response)
      
      let eventsData = []
      if (response?.data) {
        eventsData = response.data
      } else if (Array.isArray(response)) {
        eventsData = response
      }
      
      setEvents(eventsData)
      
      // Update categories based on loaded events
      const uniqueCategories = ['all', ...new Set(eventsData.map(event => event.category).filter(Boolean))]
      if (uniqueCategories.length > 1) {
        categories.splice(0, categories.length, ...uniqueCategories)
      }
      
    } catch (err) {
      console.error('Error loading events:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = events

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(event.tags) && event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    // Filter by dynamic status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(event => getDynamicStatus(event) === selectedStatus)
    }

    setFilteredEvents(filtered)
  }, [events, searchQuery, selectedCategory, selectedStatus])

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: "bg-blue-100 text-blue-800",
      ongoing: "bg-green-100 text-green-800", 
      completed: "bg-gray-100 text-gray-800"
    }
    return badges[status] || badges.upcoming
  }

  const getDynamicStatus = (event) => {
    const now = new Date()
    const eventDate = new Date(event.event_date || event.date)
    const eventEndDate = event.end_date ? new Date(event.end_date) : eventDate
    
    // If event has a specific time, parse it
    if (event.event_time || event.time) {
      const timeStr = event.event_time || event.time
      const [timeStr1] = timeStr.split(' - ')
      
      // Handle AM/PM format
      let hours, minutes
      if (timeStr1.includes('AM') || timeStr1.includes('PM')) {
        const isPM = timeStr1.includes('PM')
        const cleanTime = timeStr1.replace(/(AM|PM)/g, '').trim()
        const [h, m] = cleanTime.split(':').map(Number)
        hours = isPM && h !== 12 ? h + 12 : (h === 12 && !isPM ? 0 : h)
        minutes = m || 0
      } else {
        // 24-hour format
        const [h, m] = timeStr1.split(':').map(Number)
        hours = h
        minutes = m || 0
      }
      
      eventDate.setHours(hours, minutes, 0, 0)
      
      if ((event.end_date || event.endDate) && timeStr.includes(' - ')) {
        const [, endTimeStr] = timeStr.split(' - ')
        
        // Handle AM/PM format for end time
        let endHours, endMinutes
        if (endTimeStr.includes('AM') || endTimeStr.includes('PM')) {
          const isEndPM = endTimeStr.includes('PM')
          const cleanEndTime = endTimeStr.replace(/(AM|PM)/g, '').trim()
          const [eh, em] = cleanEndTime.split(':').map(Number)
          endHours = isEndPM && eh !== 12 ? eh + 12 : (eh === 12 && !isEndPM ? 0 : eh)
          endMinutes = em || 0
        } else {
          // 24-hour format
          const [eh, em] = endTimeStr.split(':').map(Number)
          endHours = eh
          endMinutes = em || 0
        }
        
        eventEndDate.setHours(endHours, endMinutes, 0, 0)
      } else {
        // If no end time specified, assume event is 2 hours long
        eventEndDate.setTime(eventDate.getTime() + (2 * 60 * 60 * 1000))
      }
    }
    
    if (now < eventDate) {
      return 'upcoming'
    } else if (now >= eventDate && now <= eventEndDate) {
      return 'ongoing'
    } else {
      return 'completed'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-16">
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Events</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedStatus('all')
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <HeroBanner
          title="Events & Training Programs"
          description="Join our community of experts, practitioners, and changemakers in building a more sustainable future. Discover workshops, summits, and training programs designed to enhance knowledge and foster collaboration."
          badgeText="Join Our Community"
          badgeIcon={Calendar}
        />

        {/* Search & Filter Section */}
        <section className="py-8 bg-gray-50 border-b">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-4 items-end">
                {/* Search */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Events</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by title, description, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categories from dynamic data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
                  >
                    {['all', ...new Set(events.map(event => event.category).filter(Boolean))].map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Summary */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredEvents.length} of {events.length} events
                  {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
                    <button
                      onClick={clearFilters}
                      className="ml-2 text-[#0396FF] hover:text-[#0396FF]/80 text-sm font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No events found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
                <button
                  onClick={clearFilters}
                  className="text-[#0396FF] hover:text-[#0396FF]/80 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100">
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={Array.isArray(event.images) && event.images.length > 0 ? event.images[0] : '/placeholder-event.jpg'}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = '/placeholder-event.jpg'
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(getDynamicStatus(event))}`}>
                          {getDynamicStatus(event).charAt(0).toUpperCase() + getDynamicStatus(event).slice(1)}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                        {event.category || 'Event'}
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-2 group-hover:text-[#0396FF] transition-colors duration-300 line-clamp-2">
                        {event.title}
                      </h3>
                      {event.subtitle && (
                        <p className="text-[#0396FF] font-medium text-sm mb-3">{event.subtitle}</p>
                      )}
                      <div className="text-gray-600 text-sm mb-4 line-clamp-3">
                        <RichContentRenderer 
                          content={event.description}
                          maxHeight="72px"
                        />
                      </div>

                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-500 text-xs">
                          <Calendar className="w-3 h-3 mr-2" />
                          <span>
                            {formatDate(event.event_date || event.date)}
                            {(event.end_date || event.endDate) && ` - ${formatDate(event.end_date || event.endDate)}`}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <MapPin className="w-3 h-3 mr-2" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        {(event.event_time || event.time) && (
                          <div className="flex items-center text-gray-500 text-xs">
                            <Clock className="w-3 h-3 mr-2" />
                            <span>{event.event_time || event.time}</span>
                          </div>
                        )}
                      </div>

                      {/* Speakers Preview */}
                      {event.speakers && Array.isArray(event.speakers) && event.speakers.length > 0 && (
                        <div className="flex items-center mb-4">
                          <div className="flex -space-x-2">
                            {event.speakers.slice(0, 3).map((speaker, index) => (
                              <img
                                key={index}
                                src={speaker.image || '/default-avatar.jpg'}
                                alt={speaker.name}
                                className="w-6 h-6 rounded-full border-2 border-white object-cover"
                                onError={(e) => {
                                  e.target.src = '/default-avatar.jpg'
                                }}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            {event.speakers.length} speaker{event.speakers.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      {event.tags && Array.isArray(event.tags) && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {event.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{event.tags.length - 3} more</span>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      <Link 
                        href={`/events/${event.slug || event.id}`}
                        className="w-full bg-gradient-to-r from-[#0396FF] to-blue-600 text-white px-4 py-2 rounded-lg hover:from-[#1A365D] hover:to-blue-800 transition-all duration-300 font-medium inline-flex items-center justify-center group text-sm"
                      >
                        View Details
                        <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-6">
                Don't Miss Our Upcoming Events
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Stay updated with our latest events, workshops, and training programs. 
                Join our newsletter for early access to registrations and exclusive content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="bg-gradient-to-r from-[#0396FF] to-blue-600 text-white px-8 py-3 rounded-full hover:from-[#1A365D] hover:to-blue-800 transition-all duration-300 font-medium inline-flex items-center justify-center"
                >
                  Contact Us for Custom Training
                </Link>
                <Link 
                  href="#newsletter"
                  className="border-2 border-[#0396FF] text-[#0396FF] px-8 py-3 rounded-full hover:bg-[#0396FF] hover:text-white transition-all duration-300 font-medium inline-flex items-center justify-center"
                >
                  Subscribe to Newsletter
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

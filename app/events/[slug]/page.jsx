"use client"

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RichContentRenderer from '@/components/RichContentRenderer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, Users, Clock, ChevronLeft, ChevronRight, User, Mail, Tag, CheckCircle, ArrowRight, Share2, Download, Loader } from 'lucide-react'
import { eventsApi } from '@/lib/api-services'

export default function EventDetailPage({ params }) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadEvent()
  }, [params.slug])

  const loadEvent = async () => {
    try {
      setLoading(true)
      console.log('Loading event with slug:', params.slug)
      const response = await eventsApi.getById(params.slug)
      console.log('Event API response:', response)
      
      let eventData = null
      if (response?.data) {
        eventData = response.data
      } else if (response?.id) {
        eventData = response
      }
      
      if (!eventData) {
        throw new Error('Event not found')
      }
      
      setEvent(eventData)
    } catch (err) {
      console.error('Error loading event:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
  if (error || !event) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
              <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
              <Link
                href="/events"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const nextImage = () => {
    if (event.images && Array.isArray(event.images) && event.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % event.images.length)
    }
  }

  const prevImage = () => {
    if (event.images && Array.isArray(event.images) && event.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: event.subtitle,
      url: window.location.href,
    }

    try {
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback: Copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert('Event link copied to clipboard!')
      }
    } catch (error) {
      // If clipboard API fails, fallback to manual copy
      try {
        const textArea = document.createElement('textarea')
        textArea.value = window.location.href
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('Event link copied to clipboard!')
      } catch (fallbackError) {
        console.error('Error sharing:', fallbackError)
        alert('Unable to share. Please copy the URL manually.')
      }
    }
  }

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

  const dynamicStatus = getDynamicStatus(event)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  // For now, we'll use an empty array for related events since we need to implement this properly
  const relatedEvents = []

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'speakers', label: 'Speakers' },
    // { id: 'registration', label: 'Registration' }
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="relative h-[50vh] min-h-[400px] w-full">
          <div className="absolute inset-0">
            <img
              src={event.images[0]}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
          </div>
          
          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto px-6 pt-16">
            <div className="mb-4">
              <span className={`text-sm font-medium px-4 py-2 rounded-full ${getStatusBadge(dynamicStatus)}`}>
                {dynamicStatus.charAt(0).toUpperCase() + dynamicStatus.slice(1)} • {event.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 text-center max-w-4xl">
              {event.title}
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl opacity-90 mb-6">
              {event.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{event.location}</span>
              </div>
              {/* <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>{event.registeredAttendees}/{event.capacity} registered</span>
              </div> */}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            {/* Navigation Controls */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/events"
                  className="bg-white border border-gray-300 text-gray-700 p-3 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 hover:scale-110 flex items-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <span className="text-sm text-gray-500">Back to Events</span>
              </div>
            </div>

            {/* Hero Section with Image and Details Side by Side */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Image Section */}
              <div className="space-y-4">
                <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg group">
                  <img
                    src={event.images[currentImageIndex]}
                    alt={`${event.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between px-6">
                    <button
                      onClick={prevImage}
                      className="bg-white/90 backdrop-blur-sm text-gray-800 p-4 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="bg-white/90 backdrop-blur-sm text-gray-800 p-4 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {event.images.length}
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {event.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'ring-3 ring-[#0396FF] ring-offset-2 opacity-100' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Details Section */}
              <div className="space-y-4">
                <div>
                  <div className="mb-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(dynamicStatus)}`}>
                      {dynamicStatus.charAt(0).toUpperCase() + dynamicStatus.slice(1)} • {event.category}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3 text-[#1A365D]">
                    {event.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {event.subtitle}
                  </p>
                </div>

                {/* Event Info Cards */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                    <div className="flex items-center text-[#0396FF] mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-sm">Date & Time</span>
                    </div>
                    <p className="text-gray-700 font-medium text-sm">
                      {formatDate(event.date)}
                      {event.endDate && ` - ${formatDate(event.endDate)}`}
                    </p>
                    <p className="text-gray-600 text-xs">{event.time}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                    <div className="flex items-center text-green-600 mb-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-sm">Location</span>
                    </div>
                    <p className="text-gray-700 font-medium text-sm">{event.location}</p>
                    <p className="text-gray-600 text-xs">{event.venue}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                    <div className="flex items-center text-purple-600 mb-1">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-sm">
                        {dynamicStatus === 'upcoming' ? 'Registration' : 
                         dynamicStatus === 'ongoing' ? 'Event Status' : 'Event Completed'}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium text-sm">
                      {dynamicStatus === 'upcoming' ? 'Registration Available' :
                       dynamicStatus === 'ongoing' ? 'Event Currently Live' : 'Event Concluded'}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {dynamicStatus === 'upcoming' ? 'Limited spots available' :
                       dynamicStatus === 'ongoing' ? 'Join us now!' : 'Thank you for your interest'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg border border-orange-100">
                    <div className="flex items-center text-orange-600 mb-1">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-sm">Contact</span>
                    </div>
                    <p className="text-gray-700 font-medium text-sm">{event.contactEmail}</p>
                    <p className="text-gray-600 text-xs">Organized by {event.organizer}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-3">
                  {dynamicStatus === 'upcoming' && (
                    <button className="w-full bg-gradient-to-r from-[#0396FF] to-blue-600 text-white px-4 py-3 rounded-lg hover:from-[#1A365D] hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                      Register Now
                    </button>
                  )}
                  
                  {dynamicStatus === 'ongoing' && (
                    <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                      Join Live Event
                    </button>
                  )}
                  
                  {dynamicStatus === 'completed' && (
                    <div className="space-y-2">
                      <button className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                        View Event Summary
                      </button>
                      <button className="w-full border-2 border-gray-400 text-gray-600 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium flex items-center justify-center">
                        <Download className="w-3 h-3 mr-1" />
                        Download Resources
                      </button>
                    </div>
                  )}
                  
                  {dynamicStatus !== 'completed' && (
                    <div className="space-y-2 pt-3">
                      <button 
                        onClick={handleShare}
                        className="w-full border-2 border-[#0396FF] text-[#0396FF] px-3 py-2 rounded-lg hover:bg-[#0396FF] hover:text-white transition-all duration-300 font-medium flex items-center justify-center text-sm"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </button>
                    </div>
                  )}
                  
                  {dynamicStatus === 'completed' && (
                    <button 
                      onClick={handleShare}
                      className="w-full border-2 border-[#0396FF] text-[#0396FF] px-3 py-2 rounded-lg hover:bg-[#0396FF] hover:text-white transition-all duration-300 font-medium flex items-center justify-center text-sm"
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Share Event
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tab Navigation and Content Section */}
            <div className="space-y-8">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                        activeTab === tab.id
                          ? 'border-[#0396FF] text-[#0396FF]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-6">About This Event</h2>
                    <div className="prose prose-lg max-w-none text-gray-600">
                      <RichContentRenderer 
                        content={event.fullDescription}
                        showExpandButton={true}
                        maxHeight="400px"
                      />
                    </div>
                  </div>

                  {/* Sponsors Section */}
                  {event.sponsors && event.sponsors.length > 0 && (
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-6">Event Sponsors</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
                        {event.sponsors.map((sponsor, index) => (
                          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                            <div className="flex flex-col items-center text-center">
                              <div className="w-16 h-16 mb-3 flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-300">
                                {sponsor.logo ? (
                                  <img
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-[#0396FF]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#0396FF] font-bold text-sm">
                                      {sponsor.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <h4 className="font-medium text-[#1A365D] text-sm mb-1">{sponsor.name}</h4>
                              <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                                {sponsor.type || 'Sponsor'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                          Thank you to our sponsors for making this event possible
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Default Sponsors if none provided */}
                  {(!event.sponsors || event.sponsors.length === 0) && (
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-6">Event Partners</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
                        {[
                          { name: 'UNDP', logo: '/clients/UNDP.jpg', type: 'Development Partner' },
                          { name: 'IUCN', logo: '/clients/IUCN.png', type: 'Conservation Partner' },
                          { name: 'Helvetas', logo: '/clients/Helvetas.png', type: 'Implementation Partner' },
                          { name: 'UN Environment', logo: '/clients/UNEnvironment.png', type: 'Environmental Partner' },
                          { name: 'AEPC', logo: '/clients/AEPC.png', type: 'Government Partner' },
                          { name: 'Practical Action', logo: '/clients/PracticalAction.jpg', type: 'Technical Partner' }
                        ].map((partner, index) => (
                          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                            <div className="flex flex-col items-center text-center">
                              <div className="w-16 h-16 mb-3 flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-300">
                                <img
                                  src={partner.logo}
                                  alt={partner.name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              <h4 className="font-medium text-[#1A365D] text-sm mb-1">{partner.name}</h4>
                              <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                                {partner.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                          In partnership with leading organizations in sustainable development
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-4">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="bg-[#0396FF]/10 text-[#0396FF] px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'agenda' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-6">Event Agenda</h2>
                  {event.agenda.map((day, dayIndex) => (
                    <div key={dayIndex} className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-4">{day.day}</h3>
                      <div className="space-y-4">
                        {day.sessions.map((session, sessionIndex) => (
                          <div key={sessionIndex} className="bg-white p-4 rounded-xl shadow-sm flex items-start space-x-4">
                            <div className="flex-shrink-0 bg-[#0396FF] text-white px-3 py-1 rounded-lg text-sm font-medium">
                              {session.time}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-[#1A365D] mb-1">{session.title}</h4>
                              {session.speaker && (
                                <p className="text-sm text-gray-600">{session.speaker}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'speakers' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-6">Featured Speakers</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div className="flex items-start space-x-4">
                          <img
                            src={speaker.image}
                            alt={speaker.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#1A365D] mb-1">{speaker.name}</h3>
                            <p className="text-[#0396FF] font-medium text-sm mb-2">{speaker.title}</p>
                            <p className="text-gray-600 text-sm">{speaker.bio}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* {activeTab === 'registration' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-6">Registration Information</h2>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-[#1A365D] mb-4">Registration Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">Price: {event.ticketPrice}</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">Capacity: {event.capacity} participants</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">Currently registered: {event.registeredAttendees}</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">Available spots: {event.capacity - event.registeredAttendees}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold text-[#1A365D] mb-4">What's Included</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-700">All session materials</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-700">Coffee breaks & lunch</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-700">Certificate of participation</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-700">Networking opportunities</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-700">Digital resources</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-blue-200">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 bg-gradient-to-r from-[#0396FF] to-blue-600 text-white px-6 py-3 rounded-xl hover:from-[#1A365D] hover:to-blue-800 transition-all duration-300 font-medium">
                          Register Now
                        </button>
                        <button className="flex-1 border-2 border-[#0396FF] text-[#0396FF] px-6 py-3 rounded-xl hover:bg-[#0396FF] hover:text-white transition-all duration-300 font-medium flex items-center justify-center">
                          <Download className="w-4 h-4 mr-2" />
                          Download Brochure
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                    <h4 className="font-medium text-yellow-800 mb-2">Registration Deadline</h4>
                    <p className="text-yellow-700 text-sm">
                      Registration closes 3 days before the event date. Early registration is recommended as spaces are limited.
                    </p>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </section>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-12 text-center">Related Events</h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {relatedEvents.map((relatedEvent) => (
                  <div key={relatedEvent.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={relatedEvent.images[0]}
                        alt={relatedEvent.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(getDynamicStatus(relatedEvent))}`}>
                          {getDynamicStatus(relatedEvent)}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3 line-clamp-2">{relatedEvent.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{relatedEvent.description}</p>
                      <div className="flex items-center text-gray-500 text-xs mb-4">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(relatedEvent.date)}</span>
                      </div>
                      <Link 
                        href={`/events/${relatedEvent.slug}`}
                        className="inline-flex items-center text-[#0396FF] font-medium hover:text-[#0396FF]/80 transition-colors duration-300 text-sm"
                      >
                        View Event <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

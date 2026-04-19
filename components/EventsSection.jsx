'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, MapPin, Clock, Tag, ArrowRight, ExternalLink, ChevronDown } from 'lucide-react';
import { useEvents } from '../lib/useApi';

const EventsSection = () => {
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch events from API
  const { data: eventsResponse, loading, error } = useEvents({ limit: 50 });
  const events = eventsResponse?.data || [];

  // Get unique categories from events
  const categories = ['All', ...new Set(events.map(event => event.category))];
  const statuses = ['all', 'upcoming', 'ongoing', 'completed'];

  useEffect(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(event.tags) && event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => 
        event.category === selectedCategory
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(event => {
        const eventStatus = getEventStatus(event.event_date || event.date, event.end_date || event.endDate);
        return eventStatus.status === selectedStatus;
      });
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory, selectedStatus]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const getEventStatus = (dateString, endDate) => {
    const eventDate = new Date(dateString);
    const eventEndDate = endDate ? new Date(endDate) : eventDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    eventEndDate.setHours(23, 59, 59, 999);

    if (today >= eventDate && today <= eventEndDate) {
      return { status: 'ongoing', text: 'Ongoing', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    } else if (today > eventEndDate) {
      return { status: 'completed', text: 'Completed', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    } else {
      return { status: 'upcoming', text: 'Upcoming', color: 'bg-green-100 text-green-800 border-green-200' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    if (!endDate || endDate === startDate) {
      return start;
    }
    const end = formatDate(endDate);
    return `${start} - ${end}`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('all');
  };

  const activeFiltersCount = [searchTerm, selectedCategory !== 'All', selectedStatus !== 'all'].filter(Boolean).length;

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Events & Training Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Loading our events and training programs...
            </p>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0396FF] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Events & Training Programs
            </h2>
            <p className="text-red-600 max-w-3xl mx-auto">
              Failed to load events. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Events & Training Programs
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join us in building resilient communities through capacity building, knowledge sharing, and collaborative action.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Custom Status Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-6 py-3 rounded-full bg-white text-gray-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300 min-w-[140px] cursor-pointer flex items-center justify-between"
              >
                <span>{selectedStatus === 'all' ? 'All Status' : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                  {statuses.map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-6 py-2 text-left hover:bg-gray-50 transition-colors duration-200 ${
                        selectedStatus === status ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'
                      }`}
                    >
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    category === selectedCategory 
                      ? "bg-indigo-600 text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or filters.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const eventStatus = getEventStatus(event.event_date || event.date, event.end_date || event.endDate);
              
              return (
                <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Event Image */}
                  <div className="relative h-48">
                    <Image
                      src={Array.isArray(event.images) && event.images.length > 0 ? event.images[0] : '/placeholder-event.jpg'}
                      alt={event.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-event.jpg';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${eventStatus.color}`}>
                        {eventStatus.text}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-800">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {event.subtitle}
                    </p>
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{formatDateRange(event.event_date || event.date, event.end_date || event.endDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{event.event_time || event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {Array.isArray(event.tags) && event.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {Array.isArray(event.tags) && event.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                          +{event.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        href={`/events/${event.slug}`}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      >
                        Learn More
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                      {eventStatus.status === 'upcoming' && event.registration_link && (
                        <a
                          href={event.registration_link}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          Register
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Events Button */}
        <div className="text-center mt-12">
          <Link
            href="/events"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-indigo-600 text-lg font-medium rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            View All Events & Training Programs
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;

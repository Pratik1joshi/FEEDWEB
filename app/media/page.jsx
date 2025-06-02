"use client"

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Play, ArrowRight, Search, Calendar, Tag } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export default function MediaPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const mediaItems = [
    {
      image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20climate%20conference%20with%20speakers%20on%20stage%20and%20an%20engaged%20audience%20in%20a%20modern%20conference%20hall.%20The%20scene%20should%20show%20formal%20presentation%20with%20projection%20screens%2C%20professional%20lighting%2C%20and%20diverse%20attendees%20in%20business%20attire&width=600&height=400&seq=media-image-001&orientation=landscape",
      type: "Event",
      date: "June 10, 2025",
      title: "FEED to Host International Climate Finance Summit",
      excerpt: "Leading experts will gather to discuss innovative funding mechanisms for climate adaptation projects.",
      location: "Kathmandu, Nepal",
      featured: true
    },
    {
      image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20TV%20news%20interview%20with%20an%20environmental%20expert%20speaking%20to%20a%20journalist%20in%20a%20studio%20setting%20with%20monitors%20showing%20energy%20data%20in%20the%20background.%20The%20scene%20should%20depict%20professional%20media%20communication%20with%20clean%20studio%20lighting%20and%20broadcast%20equipment&width=600&height=400&seq=media-image-002&orientation=landscape",
      type: "News",
      date: "May 22, 2025",
      title: "FEED Research Featured in Global Climate Report",
      excerpt: "Our groundbreaking study on carbon sequestration techniques has been highlighted in the UN's annual climate assessment.",
      source: "United Nations Environment Programme"
    },
    {
      image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20modern%20podcast%20recording%20studio%20with%20hosts%20and%20a%20guest%20discussing%20environmental%20topics%2C%20featuring%20professional%20microphones%2C%20headphones%2C%20and%20recording%20equipment.%20The%20scene%20should%20show%20engaged%20conversation%20in%20a%20professional%20media%20production%20environment&width=600&height=400&seq=media-image-003&orientation=landscape",
      type: "Video",
      date: "April 15, 2025",
      title: "New Video Series: Energy Transitions Explained",
      excerpt: "Our educational series breaks down complex energy concepts for policymakers and the public.",
      duration: "5-part series",
      featured: true
    },
    {
      image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20formal%20partnership%20signing%20ceremony%20between%20government%20officials%20and%20energy%20company%20executives%20with%20handshakes%20and%20document%20signing.%20The%20scene%20should%20depict%20a%20significant%20business%20agreement%20with%20professional%20atmosphere%2C%20flags%2C%20and%20formal%20business%20attire&width=600&height=400&seq=media-image-004&orientation=landscape",
      type: "Press Release",
      date: "March 30, 2025",
      title: "FEED Announces Partnership with Global Energy Alliance",
      excerpt: "Strategic collaboration aims to accelerate clean energy deployment in developing regions.",
      source: "FEED Press Office"
    },
    {
      image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20researchers%20conducting%20field%20work%20in%20a%20forest%20ecosystem%2C%20measuring%20carbon%20sequestration%20with%20scientific%20equipment%20and%20taking%20samples.%20The%20scene%20should%20show%20environmental%20science%20in%20action%20with%20researchers%20in%20appropriate%20field%20gear%20working%20methodically%20in%20nature&width=600&height=400&seq=media-image-005&orientation=landscape",
      type: "News",
      date: "February 18, 2025",
      title: "New Research Grant to Study Forest Carbon Sinks",
      excerpt: "FEED researchers secure $2.5M grant to investigate enhanced natural carbon capture methods.",
      source: "Science Foundation"
    },
    {
      image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20community%20workshop%20on%20energy%20efficiency%20with%20diverse%20participants%20examining%20solar%20equipment%20and%20energy-saving%20devices.%20The%20scene%20should%20show%20educational%20outreach%20with%20interactive%20demonstrations%20and%20engaged%20community%20members%20in%20a%20bright%2C%20welcoming%20space&width=600&height=400&seq=media-image-006&orientation=landscape",
      type: "Event",
      date: "January 25, 2025",
      title: "Community Energy Workshop Series Launches",
      excerpt: "Monthly workshops will help communities develop local renewable energy projects.",
      location: "Multiple locations across Nepal"
    },
    {
      image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20an%20environmental%20expert%20being%20interviewed%20by%20a%20journalist%20outdoors%20near%20a%20renewable%20energy%20project%20with%20camera%20crew%20and%20recording%20equipment.%20The%20scene%20should%20show%20a%20professional%20media%20interview%20in%20progress%20with%20relevant%20environmental%20backdrop&width=600&height=400&seq=media-image-007&orientation=landscape",
      type: "Video",
      date: "December 12, 2024",
      title: "Interview: The Future of Climate Finance",
      excerpt: "FEED's Executive Director discusses innovative funding mechanisms for climate adaptation projects.",
      duration: "28 minutes"
    },
    {
      image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20scientific%20conference%20poster%20session%20with%20researchers%20discussing%20findings%20displayed%20on%20professional%20posters%20and%20displays.%20The%20scene%20should%20show%20academic%20exchange%20in%20a%20conference%20setting%20with%20engaged%20professionals&width=600&height=400&seq=media-image-008&orientation=landscape",
      type: "Event",
      date: "November 5, 2024",
      title: "FEED Researchers Present at International Climate Science Conference",
      excerpt: "Team members share findings on climate adaptation strategies at the annual Climate Science Summit.",
      location: "Geneva, Switzerland"
    },
    {
      image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20an%20award%20ceremony%20with%20presenters%20handing%20an%20environmental%20achievement%20award%20to%20recipients%20on%20stage%20with%20formal%20attire%20and%20professional%20stage%20setting.%20The%20scene%20should%20depict%20a%20moment%20of%20recognition%20for%20excellence%20in%20sustainability&width=600&height=400&seq=media-image-009&orientation=landscape",
      type: "Press Release",
      date: "October 20, 2024",
      title: "FEED Wins International Award for Climate Innovation",
      excerpt: "Our carbon sequestration project recognized for excellence in climate change mitigation technology.",
      source: "Global Climate Awards"
    },
    {
      image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20webinar%20in%20progress%20with%20presenters%20on%20video%20conference%20screens%20and%20presentation%20slides%20showing%20environmental%20data.%20The%20scene%20should%20show%20a%20professional%20virtual%20event%20with%20multiple%20participants%20and%20information%20sharing&width=600&height=400&seq=media-image-010&orientation=landscape",
      type: "Video",
      date: "September 15, 2024",
      title: "Webinar: Urban Climate Resilience Strategies",
      excerpt: "Expert panel discusses approaches to building climate resilience in rapidly growing urban areas.",
      duration: "1 hour 15 minutes"
    },
    {
      image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20newspaper%20front%20page%20with%20headlines%20about%20climate%20policy%20and%20a%20photo%20of%20environmental%20leaders%20at%20a%20press%20conference.%20The%20scene%20should%20show%20news%20media%20coverage%20of%20environmental%20issues%20in%20a%20traditional%20print%20format&width=600&height=400&seq=media-image-011&orientation=landscape",
      type: "News",
      date: "August 28, 2024",
      title: "FEED Policy Recommendations Adopted by Government",
      excerpt: "Our research on renewable energy incentives shapes new national climate policy framework.",
      source: "National News Agency"
    },
    {
      image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20groundbreaking%20ceremony%20for%20a%20renewable%20energy%20project%20with%20officials%20using%20ceremonial%20shovels%20and%20construction%20equipment%20in%20the%20background.%20The%20scene%20should%20show%20the%20beginning%20of%20a%20major%20infrastructure%20project%20with%20formal%20participants&width=600&height=400&seq=media-image-012&orientation=landscape",
      type: "Press Release",
      date: "July 10, 2024",
      title: "FEED to Lead Major Solar Project in Rural Communities",
      excerpt: "New initiative will bring clean energy access to 50,000 people in off-grid areas.",
      source: "FEED Press Office"
    }
  ];

  const filters = ["All", "News", "Events", "Videos", "Press Releases"];

  const filteredMedia = activeFilter === 'All' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === activeFilter.slice(0, -1));
  
  const searchedMedia = searchQuery === ''
    ? filteredMedia
    : filteredMedia.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const featuredItems = mediaItems.filter(item => item.featured);

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[30vh] min-h-[300px] w-full">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/photo-1617280137702-32e761be8b26.jpg"
              alt="FEED Media"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
          </div>
          
          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto px-6 pt-20">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-center">
              Media & News
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl opacity-90">
              Stay updated with our latest news, events, and media coverage
            </p>
          </div>
        </section>

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
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="w-full md:w-auto overflow-x-auto">
                <div className="flex space-x-2 pb-3 md:pb-0">
                  {filters.map((filter, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                        activeFilter === filter
                          ? "bg-[#1A365D] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Media Section */}
        {featuredItems.length > 0 && searchQuery === '' && activeFilter === 'All' && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-10">Featured</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-[#B22234] text-white text-xs font-medium px-3 py-1 rounded-full">
                        {item.type}
                      </div>
                      {item.type === "Video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center cursor-pointer group-hover:bg-[#B22234] transition-colors duration-300">
                            <Play className="w-6 h-6 text-[#1A365D] group-hover:text-white transition-colors duration-300" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#B22234] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{item.excerpt}</p>
                      {item.location && (
                        <div className="text-sm text-gray-600 mb-4">
                          <strong>Location:</strong> {item.location}
                        </div>
                      )}
                      {item.duration && (
                        <div className="text-sm text-gray-600 mb-4">
                          <strong>Duration:</strong> {item.duration}
                        </div>
                      )}
                      {item.source && (
                        <div className="text-sm text-gray-600 mb-4">
                          <strong>Source:</strong> {item.source}
                        </div>
                      )}
                      <Link
                        href={`/media/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-[#1A365D] font-medium inline-flex items-center group-hover:text-[#B22234] transition-colors duration-300"
                      >
                        Read More <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Media Items */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-serif font-bold text-[#1A365D]">
                {searchQuery ? 'Search Results' : 
                  activeFilter !== 'All' ? activeFilter : 'Latest Updates'}
                {searchedMedia.length > 0 && <span className="text-gray-500 ml-2 text-lg">({searchedMedia.length})</span>}
              </h2>
              <div className="text-gray-500 text-sm">
                Sorted by: <span className="font-medium text-[#1A365D]">Date</span>
              </div>
            </div>

            {searchedMedia.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No media items found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchedMedia.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-[#B22234] text-white text-xs font-medium px-3 py-1 rounded-full">
                        {item.type}
                      </div>
                      {item.type === "Video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center cursor-pointer group-hover:bg-[#B22234] transition-colors duration-300">
                            <Play className="w-6 h-6 text-[#1A365D] group-hover:text-white transition-colors duration-300" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-gray-500 mb-2">{item.date}</div>
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#B22234] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{item.excerpt}</p>
                      {(item.location || item.duration || item.source) && (
                        <div className="text-xs text-gray-500 mb-4">
                          {item.location && <div><strong>Location:</strong> {item.location}</div>}
                          {item.duration && <div><strong>Duration:</strong> {item.duration}</div>}
                          {item.source && <div><strong>Source:</strong> {item.source}</div>}
                        </div>
                      )}
                      <Link
                        href={`/media/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-[#1A365D] font-medium inline-flex items-center group-hover:text-[#B22234] transition-colors duration-300"
                      >
                        Read More <ArrowRight className="ml-2 w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {searchedMedia.length > 9 && (
              <div className="text-center mt-12">
                <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition-all duration-300">
                  Load More
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Media Contacts Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-6 text-center">Media Contacts</h2>
              <p className="text-gray-600 text-center mb-8">
                For media inquiries, interview requests, or additional information about our work, please contact:
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="font-bold text-lg text-[#1A365D] mb-2">Press and Media Relations</h3>
                  <p className="text-gray-600 mb-1">media@feedorganization.org</p>
                  <p className="text-gray-600">+977 1-4234567</p>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-[#1A365D] mb-2">Communications Director</h3>
                  <p className="text-gray-600 mb-1">John Smith</p>
                  <p className="text-gray-600 mb-1">john.smith@feedorganization.org</p>
                  <p className="text-gray-600">+977 1-4234568</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

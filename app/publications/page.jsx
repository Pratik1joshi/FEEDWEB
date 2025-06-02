"use client"

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Download, ArrowRight, Search, Calendar, Tag, FileText } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export default function PublicationsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const publicationTypes = ['All', 'Research Reports', 'Policy Briefs', 'White Papers', 'Case Studies', 'Technical Notes'];

  const featuredPublication = {
    image: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20researchers%20in%20a%20modern%20laboratory%20analyzing%20environmental%20data%20with%20advanced%20equipment%20and%20computer%20displays%20showing%20graphs%20and%20charts.%20The%20scene%20should%20depict%20scientific%20research%20in%20progress%20with%20a%20clean%2C%20high-tech%20aesthetic%20and%20focused%20professionals&width=800&height=500&seq=publication-image-001&orientation=landscape",
    date: "May 15, 2025",
    type: "Research Report",
    title: "The Future of Renewable Energy Integration: Challenges and Opportunities",
    excerpt: "This comprehensive report examines the technical, economic, and policy challenges of integrating high levels of renewable energy into existing power systems, with case studies from around the world.",
    fileType: "PDF",
    fileSize: "4.2 MB",
    authors: ["Dr. Sarah Johnson", "Prof. Michael Chen", "Dr. Emily Rodriguez"]
  }
  
  const publications = [
    {
      thumbnail: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20wind%20turbines%20on%20an%20offshore%20wind%20farm%20with%20a%20dramatic%20sunset%20and%20ocean%20backdrop.%20The%20scene%20should%20show%20modern%20renewable%20energy%20technology%20with%20a%20beautiful%20natural%20setting%2C%20highlighting%20the%20scale%20and%20elegance%20of%20wind%20energy%20infrastructure&width=300&height=200&seq=publication-thumb-001&orientation=landscape",
      date: "April 27, 2025",
      type: "Policy Brief",
      title: "Offshore Wind Development: Policy Frameworks for Sustainable Expansion",
      excerpt: "An analysis of regulatory approaches that can accelerate offshore wind deployment while addressing environmental and stakeholder concerns.",
      fileType: "PDF",
      fileSize: "1.8 MB",
      authors: ["James Wilson", "Dr. Aisha Patel"]
    },
    {
      thumbnail: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20electric%20vehicles%20charging%20at%20a%20modern%20charging%20station%20with%20solar%20panels%20overhead.%20The%20scene%20should%20show%20advanced%20transportation%20technology%20with%20clean%20design%20elements%2C%20highlighting%20the%20connection%20between%20renewable%20energy%20and%20sustainable%20transportation&width=300&height=200&seq=publication-thumb-002&orientation=landscape",
      date: "March 18, 2025",
      type: "White Paper",
      title: "Electric Vehicle Infrastructure: Planning for Mass Adoption",
      excerpt: "This paper outlines strategies for developing charging networks that can support the rapid growth of electric vehicles in urban and rural areas.",
      fileType: "PDF",
      fileSize: "2.5 MB",
      authors: ["David Nakamura", "Maria Gonzalez"]
    },
    {
      thumbnail: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20diverse%20group%20of%20people%20in%20a%20conference%20room%20discussing%20environmental%20policy%2C%20with%20presentation%20screens%20showing%20climate%20data%20and%20graphs.%20The%20scene%20should%20depict%20serious%20professional%20collaboration%20with%20modern%20office%20aesthetics%20and%20engaged%20participants&width=300&height=200&seq=publication-thumb-003&orientation=landscape",
      date: "February 5, 2025",
      type: "Case Study",
      title: "Community-Led Energy Transitions: Lessons from Five Global Regions",
      excerpt: "Examining successful community energy projects and extracting replicable models for local energy sovereignty and climate resilience.",
      fileType: "PDF",
      fileSize: "3.7 MB",
      authors: ["Dr. Emily Rodriguez", "Robert Kim"]
    },
    {
      thumbnail: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20modern%20urban%20cityscape%20with%20green%20rooftops%2C%20solar%20panels%2C%20and%20sustainable%20architecture%20features.%20The%20scene%20should%20show%20a%20forward-thinking%20city%20design%20with%20environmental%20considerations%20integrated%20into%20the%20built%20environment&width=300&height=200&seq=publication-thumb-004&orientation=landscape",
      date: "January 15, 2025",
      type: "Research Report",
      title: "Urban Sustainability Metrics: Benchmarking City Performance",
      excerpt: "A comprehensive framework for measuring and comparing urban sustainability efforts across multiple dimensions, with data from 50 global cities.",
      fileType: "PDF",
      fileSize: "5.1 MB",
      authors: ["Prof. Michael Chen", "Dr. Sarah Johnson"]
    },
    {
      thumbnail: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20scientists%20taking%20samples%20and%20measurements%20in%20a%20carbon%20capture%20facility%20with%20industrial%20equipment%20and%20monitoring%20systems.%20The%20scene%20should%20show%20advanced%20environmental%20technology%20in%20action%20with%20professional%20scientific%20work&width=300&height=200&seq=publication-thumb-005&orientation=landscape",
      date: "December 10, 2024",
      type: "Technical Note",
      title: "Carbon Capture Technologies: Comparative Analysis of Emerging Approaches",
      excerpt: "An in-depth technical comparison of next-generation carbon capture methods, including efficiency metrics, cost projections, and scalability factors.",
      fileType: "PDF",
      fileSize: "2.9 MB",
      authors: ["Robert Kim", "David Nakamura"]
    },
    {
      thumbnail: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20farmers%20using%20advanced%20irrigation%20systems%20in%20agricultural%20fields%2C%20with%20water-saving%20technology%20and%20monitoring%20equipment.%20The%20scene%20should%20show%20sustainable%20farming%20practices%20with%20a%20focus%20on%20water%20conservation&width=300&height=200&seq=publication-thumb-006&orientation=landscape",
      date: "November 22, 2024",
      type: "Case Study",
      title: "Agricultural Water Management: Innovative Approaches from Arid Regions",
      excerpt: "Case studies of successful water conservation strategies in agriculture from water-stressed regions, with implementation guidelines and results analysis.",
      fileType: "PDF",
      fileSize: "3.2 MB",
      authors: ["Dr. Aisha Patel", "Maria Gonzalez"]
    },
    {
      thumbnail: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20international%20delegates%20at%20a%20climate%20negotiation%20conference%20with%20country%20name%20placards%2C%20formal%20seating%20arrangements%2C%20and%20projection%20screens%20with%20climate%20data.%20The%20scene%20should%20depict%20serious%20international%20diplomacy%20around%20environmental%20issues&width=300&height=200&seq=publication-thumb-007&orientation=landscape",
      date: "October 8, 2024",
      type: "Policy Brief",
      title: "Beyond NDCs: Strengthening National Climate Commitments",
      excerpt: "Analysis of current Nationally Determined Contributions under the Paris Agreement and policy recommendations for increasing ambition and implementation.",
      fileType: "PDF",
      fileSize: "2.1 MB",
      authors: ["James Wilson", "Dr. Emily Rodriguez"]
    },
    {
      thumbnail: "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20drought-affected%20landscape%20with%20climate%20monitoring%20equipment%20and%20researchers%20collecting%20data.%20The%20scene%20should%20show%20the%20impacts%20of%20climate%20change%20alongside%20scientific%20monitoring%20efforts&width=300&height=200&seq=publication-thumb-008&orientation=landscape",
      date: "September 15, 2024",
      type: "Research Report",
      title: "Climate Change Impacts on Water Security: Regional Vulnerabilities",
      excerpt: "A detailed assessment of how climate change is affecting water availability and quality across different regions, with projections and adaptation recommendations.",
      fileType: "PDF",
      fileSize: "4.5 MB",
      authors: ["Dr. Sarah Johnson", "Dr. Aisha Patel"]
    }
  ];

  const filteredPublications = activeFilter === 'All' 
    ? publications 
    : publications.filter(pub => pub.type === activeFilter.slice(0, -1));
  
  const searchedPublications = searchQuery === ''
    ? filteredPublications
    : filteredPublications.filter(pub => 
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        pub.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[40vh] min-h-[300px] w-full">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/photo-1617280137702-32e761be8b26.jpg"
              alt="FEED Publications"
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
              Publications
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl opacity-90">
              Research papers, policy briefs, and reports from our experts
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
                  placeholder="Search publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="w-full md:w-auto overflow-x-auto">
                <div className="flex space-x-2 pb-3 md:pb-0 min-w-max">
                  {publicationTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveFilter(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
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

        {/* Featured Publication */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-8">Featured Publication</h2>
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md grid md:grid-cols-7 gap-0">
                <div className="md:col-span-3 h-80 md:h-auto">
                  <img 
                    src={featuredPublication.image} 
                    alt={featuredPublication.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-4 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">{featuredPublication.date}</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <Tag className="w-4 h-4 text-[#B22234] mr-2" />
                      <span className="text-sm font-medium text-[#B22234]">{featuredPublication.type}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1A365D] mb-4">{featuredPublication.title}</h3>
                    <p className="text-gray-600 mb-6">{featuredPublication.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPublication.authors.map((author, index) => (
                        <span key={index} className="inline-block bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                          {author}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>{featuredPublication.fileType} · {featuredPublication.fileSize}</span>
                    </div>
                    <a
                      href="#"
                      className="inline-flex items-center bg-[#1A365D] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap"
                    >
                      <Download className="mr-2 w-4 h-4" /> Download Full Report
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                {searchedPublications.map((publication, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={publication.thumbnail}
                        alt={publication.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center mb-3">
                        <span className="text-sm text-gray-500">{publication.date}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-sm font-medium text-[#B22234]">{publication.type}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3 hover:text-[#0396FF] transition-colors duration-300">
                        <Link href={`/publications/${publication.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          {publication.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 flex-grow">{publication.excerpt}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {publication.authors.map((author, idx) => (
                          <span key={idx} className="inline-block bg-blue-50 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                            {author}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-xs text-gray-500">
                          {publication.fileType} · {publication.fileSize}
                        </div>
                        <Link
                          href={`/publications/${publication.title.toLowerCase().replace(/\s+/g, '-')}`}
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
      </main>
      <Footer />
    </>
  )
}

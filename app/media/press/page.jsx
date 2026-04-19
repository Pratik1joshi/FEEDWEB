"use client"

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import { Calendar, ArrowRight, Search, Download, FileText, Mail, Phone } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { pressReleases } from '@/src/data/press'

export default function PressPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPressReleases = pressReleases.filter(release =>
    release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    release.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <HeroBanner
          title="Press Releases"
          description="Official announcements and media resources from FEED"
          badgeText="Media Resources"
          badgeIcon={FileText}
        />

        {/* Search Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search press releases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Press Releases Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPressReleases.map((release) => (
                <article key={release.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="relative h-48 md:h-full overflow-hidden">
                        <Image
                          src={release.image}
                          alt={release.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        {release.date}
                      </div>
                      
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#0396FF] transition-colors duration-300">
                        {release.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {release.excerpt}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link 
                          href={`/media/press/${release.slug}`}
                          className="text-[#0396FF] font-medium inline-flex items-center hover:text-[#0396FF]/80 transition-colors duration-300"
                        >
                          Read Full Release <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                        
                        <a
                          href={release.downloadUrl}
                          download
                          className="text-[#1A365D] font-medium inline-flex items-center hover:text-[#1A365D]/80 transition-colors duration-300"
                        >
                          <Download className="mr-2 w-4 h-4" />
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredPressReleases.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-500 mb-2">No press releases found</h3>
                <p className="text-gray-400">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </section>

        {/* Media Contact Section */}
        <section className="py-16 bg-[#0396FF]/10">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-4">
                Media Contact
              </h2>
              <p className="text-gray-600 mb-8">
                For media inquiries, interviews, or additional information about our press releases, please contact our media relations team.
              </p>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-[#1A365D] mb-2">Media Relations</h3>
                    <p className="text-gray-600">media@feed.org.np</p>
                    <p className="text-gray-600">+977-1-5555-xxxx</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1A365D] mb-2">Press Inquiries</h3>
                    <p className="text-gray-600">press@feed.org.np</p>
                    <p className="text-gray-600">+977-1-5555-yyyy</p>
                  </div>
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

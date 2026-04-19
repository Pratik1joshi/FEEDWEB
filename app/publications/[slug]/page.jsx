"use client"

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RichContentRenderer from '@/components/RichContentRenderer'
import { Download, ArrowRight, Calendar, Tag, FileText, User, Eye, Quote, Share2, BookOpen, Clock } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { getPublicationBySlug, getRecentPublications } from '@/src/data/publications'

export default function PublicationDetailPage({ params }) {
  const [publication, setPublication] = useState(null)
  const [relatedPublications, setRelatedPublications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const pub = getPublicationBySlug(params.slug)
        if (!pub) {
          notFound()
        }
        setPublication(pub)
        
        // Get related publications (recent ones excluding current)
        const recent = getRecentPublications(4).filter(p => p.id !== pub.id)
        setRelatedPublications(recent)
      } catch (error) {
        console.error('Error fetching publication:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchPublication()
  }, [params.slug])

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1A365D]"></div>
        </div>
        <Footer />
      </>
    )
  }

  if (!publication) {
    notFound()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: publication.title,
        text: publication.abstract,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] w-full pt-24 pb-6">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={publication.image}
              alt={publication.title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
          </div>
          
          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto px-2 py-24">
            <div className="max-w-4xl text-center">
              <div className="flex items-center justify-center mb-4">
                <Tag className="w-5 h-5 text-[#B22234] mr-2" />
                <span className="bg-[#B22234] text-white text-sm font-medium px-3 py-1 rounded-full">
                  {publication.type}
                </span>
                <span className="mx-4 text-gray-300">|</span>
                <Calendar className="w-5 h-5 text-gray-300 mr-2" />
                <span className="text-gray-300">{formatDate(publication.date)}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                {publication.title}
              </h1>
              {publication.subtitle && (
                <p className="text-xl md:text-2xl text-gray-200 mb-6 max-w-3xl mx-auto">
                  {publication.subtitle}
                </p>
              )}
              <div className="flex flex-wrap gap-3 justify-center">
                {publication.authors.map((author, index) => (
                  <span key={index} className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                    <User className="w-4 h-4 inline mr-1" />
                    {author}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Publication Info & Download */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  <span>{publication.pages} pages</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  <span>{publication.language}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  <span>{publication.downloads.toLocaleString()} downloads</span>
                </div>
                {publication.doi && (
                  <div className="flex items-center">
                    <span className="text-sm">DOI: {publication.doi}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleShare}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-300"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <a
                  href={publication.downloadUrl}
                  download
                  className="inline-flex items-center bg-[#1A365D] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-all duration-300"
                >
                  <Download className="mr-2 w-4 h-4" />
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Abstract */}
                <div className="mb-12">
                  <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-6">Abstract</h2>
                  <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#1A365D]">
                    <Quote className="w-8 h-8 text-[#1A365D] mb-4" />
                    <div className="text-gray-700 text-lg leading-relaxed italic">
                      <RichContentRenderer content={publication.abstract} />
                    </div>
                  </div>
                </div>

                {/* Overview */}
                <div className="mb-12">
                  <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-6">Overview</h2>
                  <div className="text-gray-700 text-lg leading-relaxed mb-6">
                    <RichContentRenderer content={publication.description} />
                  </div>
                </div>

                {/* Full Content */}
                <div className="mb-12">
                  <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-6">Key Findings & Analysis</h2>
                  <RichContentRenderer 
                    content={publication.fullContent}
                    showExpandButton={true}
                    maxHeight="600px"
                  />
                </div>

                {/* Tags */}
                <div className="mb-12">
                  <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {publication.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-50 text-blue-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-100 transition-colors duration-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Publication Details */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-4">Publication Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Category:</span>
                      <p className="text-gray-800">{publication.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Published:</span>
                      <p className="text-gray-800">{formatDate(publication.date)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Authors:</span>
                      <div className="space-y-1 mt-1">
                        {publication.authors.map((author, index) => (
                          <p key={index} className="text-gray-800 text-sm">{author}</p>
                        ))}
                      </div>
                    </div>
                    {publication.citations > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Citations:</span>
                        <p className="text-gray-800">{publication.citations}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Box */}
                <div className="bg-[#1A365D] text-white p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-bold mb-4">Download Publication</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Access the complete report with detailed analysis, methodology, and recommendations.
                  </p>
                  <a
                    href={publication.downloadUrl}
                    download
                    className="inline-flex items-center w-full justify-center bg-[#B22234] text-white px-4 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300"
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Download Full Report
                  </a>
                  <div className="flex justify-between text-xs text-blue-200 mt-3">
                    <span>PDF Format</span>
                    <span>{publication.pages} pages</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Publications */}
        {relatedPublications.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-8 text-center">
                Related Publications
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPublications.map((pub) => (
                  <div
                    key={pub.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="h-48 overflow-hidden">
                      <Image
                        src={pub.image}
                        alt={pub.title}
                        width={400}
                        height={240}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="text-sm text-gray-500">{formatDate(pub.date)}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-sm font-medium text-[#B22234]">{pub.type}</span>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-[#1A365D] mb-3 hover:text-[#0396FF] transition-colors duration-300">
                        <Link href={`/publications/${pub.slug}`}>
                          {pub.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{pub.abstract}</p>
                      <Link
                        href={`/publications/${pub.slug}`}
                        className="text-[#1A365D] font-medium inline-flex items-center hover:text-[#B22234] transition-colors duration-300"
                      >
                        Read More <ArrowRight className="ml-2 w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="py-16 bg-[#1A365D]">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Stay Updated with Our Research
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive updates on new publications, research findings, and upcoming events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0396FF] flex-grow"
              />
              <button className="bg-[#B22234] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

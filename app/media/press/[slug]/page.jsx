"use client"

import React from 'react'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Calendar, Download, ArrowLeft, Share2, Facebook, Twitter, Linkedin, FileText, Mail, Phone } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { pressReleases } from '@/src/data/press'

export default function PressDetailPage({ params }) {
  const pressRelease = pressReleases.find(press => press.slug === params.slug)

  if (!pressRelease) {
    notFound()
  }

  const relatedReleases = pressReleases
    .filter(p => p.id !== pressRelease.id && p.type === pressRelease.type)
    .slice(0, 3)

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner Section */}
        <section className="relative h-[30vh] min-h-[300px] w-full">
          <div className="absolute inset-0">
            <Image
              src={pressRelease.image}
              alt={pressRelease.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
          </div>
          
          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto px-6 pt-20">
            <div className="text-center max-w-4xl">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="bg-[#0396FF] text-white text-sm font-medium px-3 py-1 rounded-full">
                  Press Release
                </span>
                <div className="flex items-center text-white/80 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {pressRelease.date}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <FileText className="w-4 h-4 mr-1" />
                  {pressRelease.type}
                </div>
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight">
                {pressRelease.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                {pressRelease.excerpt}
              </p>
            </div>
          </div>
        </section>

        {/* Back Navigation */}
        <section className="py-6 bg-gray-50">
          <div className="container mx-auto px-6">
            <Link 
              href="/media/press"
              className="inline-flex items-center text-[#0396FF] hover:text-[#0396FF]/80 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Press Releases
            </Link>
          </div>
        </section>

        {/* Press Release Header */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b">
                <a
                  href={pressRelease.downloadUrl}
                  className="inline-flex items-center bg-[#0396FF] text-white px-6 py-3 rounded-lg hover:bg-[#0396FF]/90 transition-colors duration-300 font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Press Release
                </a>

                {/* Share Buttons */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Share:</span>
                  <button className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-300">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-blue-800 text-white rounded-lg flex items-center justify-center hover:bg-blue-900 transition-colors duration-300">
                    <Linkedin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="mb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
                <Image
                  src={pressRelease.image}
                  alt={pressRelease.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Press Release Content */}
        <section className="pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-[#1A365D] prose-headings:font-serif prose-a:text-[#0396FF] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-[#0396FF] prose-blockquote:bg-blue-50 prose-blockquote:p-6 prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: pressRelease.content }}
              />

              {/* Attachments */}
              {pressRelease.attachments && pressRelease.attachments.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <h3 className="text-lg font-semibold text-[#1A365D] mb-4">Additional Resources</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pressRelease.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
                      >
                        <FileText className="w-5 h-5 text-[#0396FF] mr-3 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-[#1A365D] font-medium group-hover:text-[#0396FF] transition-colors duration-300">
                          {attachment.name}
                        </span>
                        <Download className="w-4 h-4 text-gray-400 ml-auto group-hover:text-[#0396FF] transition-colors duration-300" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Contact */}
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-lg font-semibold text-[#1A365D] mb-4">Media Contact</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-[#1A365D] mb-2">{pressRelease.contact.name}</h4>
                  <p className="text-gray-600 mb-3">{pressRelease.contact.title}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${pressRelease.contact.email}`} className="hover:text-[#0396FF] transition-colors duration-300">
                        {pressRelease.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <a href={`tel:${pressRelease.contact.phone}`} className="hover:text-[#0396FF] transition-colors duration-300">
                        {pressRelease.contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Press Releases */}
        {relatedReleases.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-12 text-center">
                  Related Press Releases
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedReleases.map((relatedRelease) => (
                    <Link
                      key={relatedRelease.id}
                      href={`/media/press/${relatedRelease.slug}`}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedRelease.image}
                          alt={relatedRelease.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-gray-500 mb-2">{relatedRelease.date}</div>
                        <div className="text-xs text-[#0396FF] font-medium mb-2">{relatedRelease.type}</div>
                        <h3 className="text-lg font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#0396FF] transition-colors duration-300">
                          {relatedRelease.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {relatedRelease.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Media Contact CTA */}
        <section className="py-16 bg-[#1A365D]">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-white mb-4">
                Media Inquiries
              </h2>
              <p className="text-blue-100 mb-8">
                For additional information, interview requests, or high-resolution images, please contact our media team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:media@feedorganization.org"
                  className="bg-[#0396FF] text-white px-6 py-3 rounded-lg hover:bg-[#0396FF]/90 transition-colors duration-300 font-medium"
                >
                  Contact Media Team
                </a>
                <a
                  href="/media"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#1A365D] transition-colors duration-300 font-medium"
                >
                  Media Center
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

"use client"

import React from 'react'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RichContentRenderer from '@/components/RichContentRenderer'
import { Calendar, User, Clock, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { newsArticles } from '@/src/data/news'

export default function NewsDetailPage({ params }) {
  const article = newsArticles.find(article => article.slug === params.slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = newsArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3)

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner Section */}
        <section className="relative h-[30vh] min-h-[300px] w-full">
          <div className="absolute inset-0">
            <Image
              src={article.image}
              alt={article.title}
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
                  {article.category}
                </span>
                <div className="flex items-center text-white/80 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {article.date}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readTime}
                </div>
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          </div>
        </section>

        {/* Back Navigation */}
        <section className="py-6 bg-gray-50">
          <div className="container mx-auto px-6">
            <Link 
              href="/media/news"
              className="inline-flex items-center text-[#0396FF] hover:text-[#0396FF]/80 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
          </div>
        </section>

        {/* Article Header */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Author Info */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b">
                <div className="flex items-center">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <div className="font-medium text-[#1A365D]">{article.author.name}</div>
                    <div className="text-sm text-gray-600">{article.author.title}</div>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Share:</span>
                  <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors duration-300">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-blue-800 text-white rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors duration-300">
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
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <RichContentRenderer 
                content={article.content}
                className="prose prose-lg max-w-none prose-headings:text-[#1A365D] prose-headings:font-serif prose-a:text-[#0396FF] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-[#0396FF] prose-blockquote:bg-blue-50 prose-blockquote:p-6 prose-blockquote:rounded-r-lg"
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-lg font-semibold text-[#1A365D] mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-blue-50 text-[#0396FF] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-12 text-center">
                  Related Articles
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      href={`/media/news/${relatedArticle.slug}`}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-gray-500 mb-2">{relatedArticle.date}</div>
                        <h3 className="text-lg font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#0396FF] transition-colors duration-300">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {relatedArticle.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Subscription */}
        <section className="py-16 bg-[#0396FF]">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-blue-100 mb-8">
                Subscribe to our newsletter to receive the latest news and updates from FEED.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
                <button className="bg-white text-[#0396FF] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-medium">
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

"use client"

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import RichContentRenderer from '@/components/RichContentRenderer'
import { Calendar, ArrowRight, Search, Filter, User, Clock, Newspaper } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { newsArticles } from '@/src/data/news'

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ['All', ...new Set(newsArticles.map(article => article.category))]

  const filteredNews = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <HeroBanner
          title="News & Updates"
          description="Stay informed about our latest developments, research findings, and impact stories"
          badgeText="Latest News"
          badgeIcon={Newspaper}
        />

        {/* Search and Filter Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="text-gray-500 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* News Articles Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article) => (
                <article key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-[#0396FF] text-white text-xs font-medium px-3 py-1 rounded-full">
                      {article.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {article.date}
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#0396FF] transition-colors duration-300">
                      {article.title}
                    </h3>
                    
                    <div className="text-gray-600 mb-4 line-clamp-3">
                      <RichContentRenderer 
                        content={article.excerpt}
                        maxHeight="72px"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image
                          src={article.author.avatar}
                          alt={article.author.name}
                          width={24}
                          height={24}
                          className="rounded-full mr-2"
                        />
                        <span className="text-xs text-gray-600">{article.author.name}</span>
                      </div>
                      <Link 
                        href={`/media/news/${article.slug}`}
                        className="text-[#0396FF] font-medium inline-flex items-center hover:text-[#0396FF]/80 transition-colors duration-300"
                      >
                        Read More <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-500 mb-2">No articles found</h3>
                <p className="text-gray-400">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-[#0396FF]/10">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-4">
                Stay Updated
              </h2>
              <p className="text-gray-600 mb-8">
                Subscribe to our newsletter to receive the latest news and updates directly in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
                />
                <button className="bg-[#0396FF] text-white px-6 py-3 rounded-lg hover:bg-[#0396FF]/90 transition-colors duration-300 font-medium">
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

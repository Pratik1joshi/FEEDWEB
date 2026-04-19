"use client"

import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import { Calendar, ArrowRight, Search, Filter, User, Clock, Tag, Edit3 } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { blogApi } from '@/src/lib/api-services'

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const stripHtml = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  const normalizePost = (post) => ({
    ...post,
    excerpt: post.excerpt || '',
    content: post.content || '',
    tags: Array.isArray(post.tags)
      ? post.tags
      : typeof post.tags === 'string'
        ? post.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [],
    author: post.author || {
      name: post.author_name || '',
      title: post.author_title || '',
      avatar: post.author_avatar || ''
    },
    publishDate: post.publish_date || post.publishDate,
    readTime: post.read_time || post.readTime
  })

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await blogApi.getAll({ status: 'published' })

        if (data.success) {
          setPosts(data.data.map(normalizePost))
        } else {
          setError(data.message || 'Unable to load blog posts')
        }
      } catch (loadError) {
        console.error('Error loading blog posts:', loadError)
        setError('Unable to load blog posts')
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const categories = ['All', ...new Set(posts.map(post => post.category).filter(Boolean))]

  const filteredPosts = posts.filter(post => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = stripHtml(post.title || '').toLowerCase().includes(searchLower) ||
                         stripHtml(post.excerpt || '').toLowerCase().includes(searchLower) ||
                         (post.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPost = posts.find(post => post.featured) || posts[0]

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <HeroBanner
          title="FEED Blog"
          description="Insights, stories, and perspectives on sustainable development"
          badgeText="Insights & Stories"
          badgeIcon={Edit3}
        />

        {/* Featured Post */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-8">Featured Article</h2>
              {loading ? (
                <div className="grid lg:grid-cols-2 gap-8 items-center bg-gray-50 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-80 bg-gray-200" />
                  <div className="p-8 space-y-4">
                    <div className="h-5 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-3/4 bg-gray-200 rounded" />
                    <div className="h-5 w-full bg-gray-200 rounded" />
                    <div className="h-5 w-5/6 bg-gray-200 rounded" />
                  </div>
                </div>
              ) : featuredPost ? (
                <div className="grid lg:grid-cols-2 gap-8 items-center bg-gray-50 rounded-lg overflow-hidden">
                  <div className="relative h-80 lg:h-full min-h-[20rem]">
                    <Image
                      src={featuredPost.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=500&fit=crop'}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      <span className="bg-[#0396FF] text-white text-xs font-medium px-3 py-1 rounded-full">
                        {featuredPost.category || 'Blog'}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {featuredPost.publishDate ? new Date(featuredPost.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently published'}
                      </div>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-4">
                      {featuredPost.title}
                    </h3>

                    <p className="text-gray-600 mb-6 break-words overflow-hidden">
                      {stripHtml(featuredPost.excerpt || featuredPost.content || '')}
                    </p>

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center">
                        <Image
                          src={featuredPost.author?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'}
                          alt={featuredPost.author?.name || 'Author'}
                          width={40}
                          height={40}
                          className="rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium text-[#1A365D]">{featuredPost.author?.name || 'FEED Team'}</p>
                          <p className="text-sm text-gray-500">{featuredPost.readTime || 'Read article'}</p>
                        </div>
                      </div>

                      <Link 
                        href={`/media/blog/${featuredPost.slug}`}
                        className="text-[#0396FF] font-medium inline-flex items-center hover:text-[#0396FF]/80 transition-colors duration-300"
                      >
                        Read More <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
                  No published blog posts yet.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-6xl mx-auto">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
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

        {/* Blog Posts Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-8">All Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={post.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=500&fit=crop'}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-[#0396FF] text-white text-xs font-medium px-3 py-1 rounded-full">
                        {post.category || 'Blog'}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.publishDate ? new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently published'}
                        <span className="mx-2">•</span>
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime || 'Read article'}
                      </div>
                      
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#0396FF] transition-colors duration-300">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3 break-words overflow-hidden">
                        {stripHtml(post.excerpt || post.content || '')}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(post.tags || []).slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            <Tag className="w-3 h-3 inline mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Image
                            src={post.author?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'}
                            alt={post.author?.name || 'Author'}
                            width={32}
                            height={32}
                            className="rounded-full mr-2"
                          />
                          <span className="text-sm font-medium text-[#1A365D]">{post.author?.name || 'FEED Team'}</span>
                        </div>
                        
                        <Link 
                          href={`/media/blog/${post.slug}`}
                          className="text-[#0396FF] font-medium inline-flex items-center hover:text-[#0396FF]/80 transition-colors duration-300"
                        >
                          Read <ArrowRight className="ml-1 w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {!loading && filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-500 mb-2">No articles found</h3>
                  <p className="text-gray-400">Try adjusting your search terms or filters</p>
                </div>
              )}
              {error && (
                <div className="mt-8 text-center text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-[#0396FF]/10">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-4">
                Subscribe to Our Blog
              </h2>
              <p className="text-gray-600 mb-8">
                Get the latest articles and insights delivered directly to your inbox.
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

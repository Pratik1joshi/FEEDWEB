"use client"

import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { blogApi } from '@/src/lib/api-services'
import { Calendar, User, Clock, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function BlogDetailPage({ params }) {
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const stripHtml = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  const normalizePost = (item) => ({
    ...item,
    excerpt: item.excerpt || '',
    content: item.content || '',
    tags: Array.isArray(item.tags)
      ? item.tags
      : typeof item.tags === 'string'
        ? item.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
    author: item.author || {
      name: item.author_name || '',
      title: item.author_title || '',
      avatar: item.author_avatar || ''
    },
    publishDate: item.publish_date || item.publishDate,
    readTime: item.read_time || item.readTime
  })

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await blogApi.getBySlug(params.slug)

        if (!data.success) {
          setError(data.message || 'Blog post not found')
          return
        }

        const currentPost = normalizePost(data.data)
        setPost(currentPost)

        const relatedData = await blogApi.getAll({ status: 'published', category: currentPost.category || 'all' })
        if (relatedData.success) {
          setRelatedPosts(
            relatedData.data
              .map(normalizePost)
              .filter((item) => item.slug !== currentPost.slug)
              .slice(0, 3)
          )
        }
      } catch (loadError) {
        console.error('Error loading blog post:', loadError)
        setError('Blog post not found')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      loadPost()
    }
  }, [params.slug])

  const dateLabel = post?.publishDate
    ? new Date(post.publishDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : ''

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white">
          <div className="container mx-auto px-6 py-24">
            <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
              <div className="h-72 bg-gray-200 rounded-2xl" />
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-12 w-3/4 bg-gray-200 rounded" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white">
          <div className="container mx-auto px-6 py-24">
            <div className="max-w-2xl mx-auto text-center border border-dashed border-gray-300 rounded-2xl p-12">
              <h1 className="text-3xl font-semibold text-[#1A365D] mb-4">Blog post not found</h1>
              <p className="text-gray-600 mb-8">{error || 'The article you are looking for is unavailable.'}</p>
              <Link href="/media/blog" className="inline-flex items-center text-[#0396FF] font-medium hover:text-[#0396FF]/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main>
        <section className="relative h-[30vh] min-h-[300px] w-full">
          <div className="absolute inset-0">
            <Image
              src={post.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=500&fit=crop'}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
          </div>

          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto px-6 pt-20">
            <div className="text-center max-w-4xl">
              <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
                <span className="bg-[#0396FF] text-white text-sm font-medium px-3 py-1 rounded-full">
                  {post.category || 'Blog'}
                </span>
                <div className="flex items-center text-white/80 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {dateLabel}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime || 'Read article'}
                </div>
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed break-words overflow-hidden">
                {stripHtml(post.excerpt || post.content || '')}
              </p>
            </div>
          </div>
        </section>

        <section className="py-6 bg-gray-50">
          <div className="container mx-auto px-6">
            <Link 
              href="/media/blog"
              className="inline-flex items-center text-[#0396FF] hover:text-[#0396FF]/80 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8 pb-8 border-b">
                <div className="flex items-center">
                  <Image
                    src={post.author?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'}
                    alt={post.author?.name || 'Author'}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <div className="font-medium text-[#1A365D] text-lg">{post.author?.name || 'FEED Team'}</div>
                    <div className="text-sm text-gray-600 mb-1">{post.author?.title || 'FEED Contributor'}</div>
                    {post.author?.bio && <div className="text-xs text-gray-500">{post.author.bio}</div>}
                  </div>
                </div>

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

        <section className="mb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
                <Image
                  src={post.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=500&fit=crop'}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-[#1A365D] prose-headings:font-serif prose-a:text-[#0396FF] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-[#0396FF] prose-blockquote:bg-blue-50 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:font-medium"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <h3 className="text-lg font-semibold text-[#1A365D] mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-blue-50 text-[#0396FF] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(post.author?.bio || post.author?.title) && (
                <div className="mt-12 pt-8 border-t">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#1A365D] mb-4">About the Author</h3>
                    <div className="flex items-start space-x-4">
                      <Image
                        src={post.author?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'}
                        alt={post.author?.name || 'Author'}
                        width={80}
                        height={80}
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#1A365D] text-lg mb-1">{post.author?.name || 'FEED Team'}</h4>
                        <p className="text-[#0396FF] text-sm mb-3">{post.author?.title || 'FEED Contributor'}</p>
                        {post.author?.bio && <p className="text-gray-600 text-sm mb-4">{post.author.bio}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-12 text-center">
                  Related Articles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/media/blog/${relatedPost.slug}`}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedPost.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=500&fit=crop'}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-[#0396FF] text-white text-xs font-medium px-2 py-1 rounded-full">
                            {relatedPost.category || 'Blog'}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-[#1A365D] mb-2 group-hover:text-[#0396FF] transition-colors duration-300">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm break-words overflow-hidden">
                          {stripHtml(relatedPost.excerpt || relatedPost.content || '').slice(0, 120)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

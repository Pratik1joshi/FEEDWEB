"use client"

import React, { useState, useMemo } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import RichContentRenderer from '@/components/RichContentRenderer'
import { MapPin, Calendar, Users, ArrowRight, Search, Loader, FolderOpen } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { useProjects } from '@/src/hooks/useApi'

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch projects from API - only detailed projects
  const { data: projectsResponse, loading, error, refetch } = useProjects({ type: 'detailed' });
  const projects = projectsResponse?.data || [];

  // Get unique categories from projects
  const projectCategories = useMemo(() => {
    const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];
    return categories;
  }, [projects]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800"
      case "ongoing": return "bg-blue-100 text-blue-800"
      case "in progress": return "bg-blue-100 text-blue-800"
      case "research phase": return "bg-purple-100 text-purple-800"
      case "planning": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Filter projects based on active filter and search query
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Filter by category
    if (activeFilter !== 'All') {
      filtered = filtered.filter(project => project.category === activeFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.excerpt?.toLowerCase().includes(query) ||
        project.location?.toLowerCase().includes(query) ||
        project.category?.toLowerCase().includes(query) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    return filtered;
  }, [projects, activeFilter, searchQuery]);

  // Get project stats
  const completedProjects = projects.filter(p => p.status?.toLowerCase() === 'completed').length;
  const uniqueProvinces = new Set(projects.map(p => p.province).filter(Boolean)).size;
  const uniqueDistricts = new Set(projects.map(p => p.district).filter(Boolean)).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading projects: {error}</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Banner */}
      <HeroBanner
        title="Our Projects"
        description="Transforming communities through innovative solutions in climate resilience, sustainable development, and infrastructure excellence"
        badgeText="Project Portfolio"
        badgeIcon={FolderOpen}
      />

      {/* Project Stats */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600">{projects.length}+</div>
              <div className="text-sm text-gray-600 font-medium">Total Projects</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600">{completedProjects}+</div>
              <div className="text-sm text-gray-600 font-medium">Completed</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-purple-600">{uniqueProvinces || 5}</div>
              <div className="text-sm text-gray-600 font-medium">Provinces</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-orange-600">{uniqueDistricts || 8}+</div>
              <div className="text-sm text-gray-600 font-medium">Districts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {projectCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category} ({category === 'All' ? projects.length : projects.filter(p => p.category === category).length})
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
              {activeFilter !== 'All' && ` in ${activeFilter}`}
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No projects found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setActiveFilter('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.images && project.images.length > 0 ? project.images[0] : '/work1.png'}
                      alt={project.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {project.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {project.title}
                    </h3>
                    
                    <div className="text-gray-600 mb-4 line-clamp-3">
                      <div className="text-sm leading-relaxed">
                        {project.description || project.excerpt || 'No description available'}
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {project.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {project.duration}
                      </div>
                      {project.team_size && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          {project.team_size}
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags && project.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {!project.tags && project.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                          {project.category}
                        </span>
                      )}
                      {project.tags && project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Read More Link */}
                    <Link 
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl mb-8">
            Partner with us to create sustainable solutions for your community's challenges.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
          >
            Get in Touch
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

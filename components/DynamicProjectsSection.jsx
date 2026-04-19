"use client"

import { useState, useEffect } from 'react'
import { projectsApi } from '@/src/lib/api-services'
import RichContentRenderer from './RichContentRenderer'
import { Calendar, MapPin, DollarSign, ArrowRight, Building, Users } from 'lucide-react'
import Link from 'next/link'

export default function DynamicProjectsSection({ 
  title = "Our Projects", 
  subtitle = "Discover our impactful initiatives in sustainable development and environmental conservation",
  limit = 6,
  showStatus = "all", // "all", "ongoing", "completed", "planned"
  layout = "grid" // "grid" or "featured"
}) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await projectsApi.getAll({ 
          limit: limit,
          sortBy: 'created_at',
          sortOrder: 'DESC'
        })
        
        if (response.success && response.data) {
          let projects = response.data
          if (showStatus !== "all") {
            projects = projects.filter(project => 
              project.status && project.status.toLowerCase() === showStatus.toLowerCase()
            )
          }
          setProjects(projects.slice(0, limit))
        } else if (Array.isArray(response)) {
          let projects = response
          if (showStatus !== "all") {
            projects = projects.filter(project => 
              project.status && project.status.toLowerCase() === showStatus.toLowerCase()
            )
          }
          setProjects(projects.slice(0, limit))
        } else {
          console.warn('Unexpected API response format:', response)
          setProjects([])
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError(err.message)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [limit, showStatus])

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-[#1A365D] mb-4">{title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A365D]"></div>
            <span className="ml-3 text-gray-600">Loading projects...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-[#1A365D] mb-4">{title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
            <p className="font-medium">Unable to load projects</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'planned':
        return 'bg-yellow-100 text-yellow-800'
      case 'paused':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const parseArrayField = (field) => {
    if (Array.isArray(field)) return field
    if (typeof field === 'string') {
      try {
        return JSON.parse(field)
      } catch {
        return []
      }
    }
    return []
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-[#1A365D] mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects available</h3>
            <p className="text-gray-600">Check back soon for updates on our latest initiatives.</p>
          </div>
        ) : (
          <>
            {layout === "featured" && projects.length > 0 ? (
              <div className="mb-16">
                {/* Featured Project */}
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="md:flex">
                    <div className="md:w-1/2 h-64 md:h-auto">
                      <img
                        src={projects[0].image_url || "/placeholder.svg?height=400&width=600"}
                        alt={projects[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-8">
                      <div className="mb-4">
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(projects[0].status)}`}>
                          {projects[0].status || 'Active'}
                        </span>
                      </div>
                      <h3 className="text-3xl font-serif font-bold text-[#1A365D] mb-4">
                        {projects[0].title}
                      </h3>
                      <div className="text-gray-600 mb-6">
                        <RichContentRenderer 
                          content={projects[0].description}
                          maxHeight="120px"
                          showExpandButton={true}
                        />
                      </div>
                      
                      {/* Project Details */}
                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        {projects[0].location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{projects[0].location}</span>
                          </div>
                        )}
                        {projects[0].budget && (
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span>{formatCurrency(projects[0].budget)}</span>
                          </div>
                        )}
                        {projects[0].start_date && (
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(projects[0].start_date)} - {formatDate(projects[0].end_date)}</span>
                          </div>
                        )}
                        {projects[0].beneficiaries && (
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{projects[0].beneficiaries} beneficiaries</span>
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/projects/${projects[0].slug || projects[0].id}`}
                        className="inline-flex items-center bg-[#0396FF] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300"
                      >
                        Learn More <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Other Projects Grid */}
                {projects.length > 1 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {projects.slice(1).map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            {/* View All Projects Link */}
            <div className="text-center mt-12">
              <Link
                href="/projects"
                className="inline-flex items-center bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium"
              >
                View All Projects
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

// Project Card Component
function ProjectCard({ project }) {
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'planned':
        return 'bg-yellow-100 text-yellow-800'
      case 'paused':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const parseArrayField = (field) => {
    if (Array.isArray(field)) return field
    if (typeof field === 'string') {
      try {
        return JSON.parse(field)
      } catch {
        return []
      }
    }
    return []
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image_url || "/placeholder.svg?height=300&width=400"}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(project.status)}`}>
            {project.status || 'Active'}
          </span>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#0396FF] transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <div className="text-gray-600 text-sm mb-4">
          <RichContentRenderer 
            content={project.description}
            maxHeight="80px"
          />
        </div>

        {/* Project Details */}
        <div className="space-y-2 mb-4 text-sm">
          {project.location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{project.location}</span>
            </div>
          )}
          {project.budget && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>{formatCurrency(project.budget)}</span>
            </div>
          )}
          {project.start_date && (
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
            </div>
          )}
        </div>

        {/* Technologies/Categories */}
        {project.technologies && parseArrayField(project.technologies).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {parseArrayField(project.technologies).slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
              >
                {tech}
              </span>
            ))}
            {parseArrayField(project.technologies).length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                +{parseArrayField(project.technologies).length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-between items-center">
          <Link
            href={`/projects/${project.slug || project.id}`}
            className="text-[#0396FF] font-medium inline-flex items-center hover:text-[#1A365D] transition-colors duration-300"
          >
            Learn More <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          
          {project.external_url && (
            <a
              href={project.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#0396FF] transition-colors duration-300"
            >
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, Users, Layers, Eye, ExternalLink, DollarSign, Clock, Star, Tag, Target, CheckCircle } from 'lucide-react'
import { detailedProjects } from '@/src/data/detailedProjects'
import { mapProjects } from '@/src/data/mapProjects'
import RichTextDisplay from '@/src/components/RichTextDisplay'

export default function ViewProject() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [project, setProject] = useState(null)
  const [projectType, setProjectType] = useState(null)
  const router = useRouter()
  const params = useParams()
  const { slug } = params

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      
      // Find project in both detailed and map projects
      let foundProject = detailedProjects.find(p => p.slug === slug)
      if (foundProject) {
        setProject(foundProject)
        setProjectType('detailed')
      } else {
        foundProject = mapProjects.find(p => p.slug === slug)
        if (foundProject) {
          setProject(foundProject)
          setProjectType('map')
        }
      }
    }
  }, [router, slug])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1A365D]"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#1A365D] text-white flex flex-col">
          <div className="p-6 border-b border-blue-800">
            <Link href="/admin/dashboard" className="text-xl font-bold hover:text-blue-200">
              FEED Admin
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-4">The requested project could not be found.</p>
            <Link
              href="/admin/projects"
              className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Ongoing': return 'bg-blue-100 text-blue-800'
      case 'Planning': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#1A365D] text-white flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <Link href="/admin/dashboard" className="text-xl font-bold hover:text-blue-200">
            FEED Admin
          </Link>
          <p className="text-blue-200 text-sm">View Project</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center px-4 py-3 hover:bg-blue-700 rounded-lg transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/projects" className="flex items-center px-4 py-3 bg-blue-700 rounded-lg">
            Projects
          </Link>
          <Link href="/admin/team" className="flex items-center px-4 py-3 hover:bg-blue-700 rounded-lg transition-colors">
            Team
          </Link>
          <Link href="/admin/publications" className="flex items-center px-4 py-3 hover:bg-blue-700 rounded-lg transition-colors">
            Publications
          </Link>
          <Link href="/admin/awards" className="flex items-center px-4 py-3 hover:bg-blue-700 rounded-lg transition-colors">
            Awards
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/projects"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">{project.title}</h1>
                  {projectType === 'detailed' && (
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      Detailed Project
                    </span>
                  )}
                  {projectType === 'map' && (
                    <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                      Map Project
                    </span>
                  )}
                </div>
                <p className="text-gray-600">Project Details & Information</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/projects/${slug}/edit`}
                className="bg-[#1A365D] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Project
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Hero Section */}
            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
              {/* Hero Image */}
              {((project.images && project.images[0]) || project.image) && (
                <div className="relative h-80 bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden">
                  <img
                    src={(project.images && project.images[0]) || project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="flex items-end justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {projectType === 'detailed' && (
                            <span className="px-3 py-1 bg-blue-600/80 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                              Detailed Project
                            </span>
                          )}
                          {projectType === 'map' && (
                            <span className="px-3 py-1 bg-green-600/80 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                              Map Project
                            </span>
                          )}
                          <span className={`px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm ${getStatusColor(project.status)} bg-opacity-90`}>
                            {project.status}
                          </span>
                        </div>
                        <h1 className="text-4xl font-bold mb-3">{project.title}</h1>
                        <p className="text-lg opacity-90 max-w-3xl">{project.description}</p>
                      </div>
                      {project.featured && (
                        <div className="flex items-center gap-2 text-yellow-300 bg-yellow-600/20 backdrop-blur-sm px-3 py-2 rounded-full">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="text-sm font-medium">Featured Project</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* If no image, show gradient header */}
              {!((project.images && project.images[0]) || project.image) && (
                <div className="relative h-60 bg-gradient-to-br from-[#1A365D] to-blue-600 p-8 flex items-end text-white">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {projectType === 'detailed' && (
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                          Detailed Project
                        </span>
                      )}
                      {projectType === 'map' && (
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                          Map Project
                        </span>
                      )}
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                        {project.status}
                      </span>
                    </div>
                    <h1 className="text-4xl font-bold mb-3">{project.title}</h1>
                    <p className="text-lg opacity-90">{project.description}</p>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="p-8 bg-gradient-to-r from-gray-50 to-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {project.location && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Location</p>
                        <p className="text-lg font-semibold text-gray-900">{project.location}</p>
                      </div>
                    </div>
                  )}

                  {project.duration && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Duration</p>
                        <p className="text-lg font-semibold text-gray-900">{project.duration}</p>
                      </div>
                    </div>
                  )}

                  {project.budget && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Budget</p>
                        <p className="text-lg font-semibold text-gray-900">{project.budget}</p>
                      </div>
                    </div>
                  )}

                  {project.teamSize && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Team Size</p>
                        <p className="text-lg font-semibold text-gray-900">{project.teamSize}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Categories and Tags */}
                <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
                  {project.category && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Layers className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-xl">
                        {project.category}
                      </span>
                    </div>
                  )}
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Tag className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Project Type Specific Content */}
            {projectType === 'detailed' && (
              <>
                {/* Full Description */}
                {project.fullDescription && (
                  <div className="bg-white rounded-2xl shadow-lg border p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Project Overview</h2>
                    </div>
                    <div className="prose prose-lg max-w-none">
                      <RichTextDisplay 
                        content={project.fullDescription} 
                        className="text-gray-700 leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* Goals and Outcomes */}
                {((project.goals && project.goals.length > 0) || (project.outcomes && project.outcomes.length > 0)) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {project.goals && project.goals.length > 0 && (
                      <div className="bg-white rounded-2xl shadow-lg border p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <Target className="w-5 h-5 text-green-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">Project Goals</h3>
                        </div>
                        <ul className="space-y-4">
                          {project.goals.map((goal, index) => (
                            <li key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm font-bold">{index + 1}</span>
                              </div>
                              <span className="text-gray-800 leading-relaxed">{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.outcomes && project.outcomes.length > 0 && (
                      <div className="bg-white rounded-2xl shadow-lg border p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-purple-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">Project Outcomes</h3>
                        </div>
                        <ul className="space-y-4">
                          {project.outcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-gray-800 leading-relaxed">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Key Metrics */}
                {project.keyMetrics && project.keyMetrics.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg border p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Key Achievements</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {project.keyMetrics.map((metric, index) => (
                        <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                          <p className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</p>
                          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {project.timeline && project.timeline.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg border p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Project Timeline</h3>
                    </div>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-blue-300 to-green-300"></div>
                      
                      <div className="space-y-8">
                        {project.timeline.map((item, index) => (
                          <div key={index} className="relative flex items-start gap-6">
                            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                              item.status === 'completed' ? 'bg-green-500' :
                              item.status === 'ongoing' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}>
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                <p className="font-bold text-lg text-gray-900">{item.title}</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-gray-500">{item.date}</span>
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    item.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {item.status}
                                  </span>
                                </div>
                              </div>
                              {item.description && (
                                <p className="text-gray-700 leading-relaxed">{item.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Map Project Specific - Coordinates */}
            {projectType === 'map' && project.coordinates && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Map Coordinates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600">Latitude</p>
                    <p className="text-lg font-semibold text-gray-800">{project.coordinates.lat}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600">Longitude</p>
                    <p className="text-lg font-semibold text-gray-800">{project.coordinates.lng}</p>
                  </div>
                </div>
                <a 
                  href={`https://www.google.com/maps?q=${project.coordinates.lat},${project.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Google Maps
                </a>
              </div>
            )}

            {/* Additional Images */}
            {project.images && project.images.length > 1 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {project.images.slice(1).map((image, index) => (
                    <div key={index} className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${project.title} - Image ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  )
}

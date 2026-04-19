"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, DollarSign, Users, Zap, Leaf } from 'lucide-react'
import { projects } from '@/src/data/projects'

export default function ViewProject() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      loadProject()
    }
  }, [router, params.slug])

  const loadProject = () => {
    const foundProject = projects.find(p => p.slug === params.slug)
    if (foundProject) {
      setProject(foundProject)
      setLoading(false)
    } else {
      alert('Project not found')
      router.push('/admin/projects')
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1A365D]"></div>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      // In a real app, this would delete from database
      console.log('Deleting project:', project.slug)
      alert('Project deleted successfully!')
      router.push('/admin/projects')
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'ongoing':
        return 'bg-blue-100 text-blue-800'
      case 'planning':
        return 'bg-yellow-100 text-yellow-800'
      case 'on hold':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <h1 className="text-2xl font-bold text-gray-800">View Project</h1>
              <p className="text-gray-600">{project?.title}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <Link
              href={`/admin/projects/${params.slug}/edit`}
              className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Project
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {project.image && (
              <div className="h-64 bg-gray-200">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-project.png'
                  }}
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
                  <p className="text-gray-600 text-lg">{project.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{project.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-medium">{project.budget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">
                      {project.startDate || 'TBD'} - {project.endDate || 'Ongoing'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sector</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {project.sector}
                  </span>
                </div>
              </div>
            </div>

            {/* Impact Metrics */}
            {project.impact && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Impact Metrics</h2>
                <div className="space-y-4">
                  {project.impact.beneficiaries > 0 && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Beneficiaries</p>
                        <p className="font-medium text-lg">{project.impact.beneficiaries.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {project.impact.energyGenerated && (
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-sm text-gray-500">Energy Generated</p>
                        <p className="font-medium text-lg">{project.impact.energyGenerated}</p>
                      </div>
                    </div>
                  )}
                  {project.impact.co2Reduction && (
                    <div className="flex items-center gap-3">
                      <Leaf className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">CO2 Reduction</p>
                        <p className="font-medium text-lg">{project.impact.co2Reduction}</p>
                      </div>
                    </div>
                  )}
                  {project.impact.communitiesServed > 0 && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Communities Served</p>
                        <p className="font-medium text-lg">{project.impact.communitiesServed}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Full Description */}
          {project.fullDescription && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-wrap">{project.fullDescription}</p>
              </div>
            </div>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Partners */}
          {project.partners && project.partners.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Partners</h2>
              <div className="flex flex-wrap gap-2">
                {project.partners.map((partner, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Challenges and Solutions */}
          {(project.challenges || project.solutions) && (
            <div className="grid md:grid-cols-2 gap-6">
              {project.challenges && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Challenges</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{project.challenges}</p>
                </div>
              )}
              {project.solutions && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Solutions</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{project.solutions}</p>
                </div>
              )}
            </div>
          )}

          {/* Key Features */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Features</h2>
              <ul className="space-y-2">
                {project.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-[#1A365D] rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Outcomes */}
          {project.outcomes && project.outcomes.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Outcomes</h2>
              <ul className="space-y-2">
                {project.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-600">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

      {/* Form */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter project title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL-friendly)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                    placeholder="project-slug"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Brief project description for cards and previews"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description
                </label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                  placeholder="Detailed project description, methodology, goals, etc."
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Project preview"
                      className="w-32 h-24 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Project Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sector *
                  </label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent ${
                      errors.sector ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Sector</option>
                    {sectorOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.sector && <p className="text-red-500 text-sm mt-1">{errors.sector}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Project location"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget *
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent ${
                      errors.budget ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="$1.5M USD"
                  />
                  {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-[#1A365D] focus:ring-[#1A365D]"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Featured Project</span>
                </label>
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Technologies</h2>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add technology"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addToArray('technologies', newTechnology, setNewTechnology)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addToArray('technologies', newTechnology, setNewTechnology)}
                  className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeFromArray('technologies', index)}
                      className="ml-2 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Impact Metrics</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficiaries
                  </label>
                  <input
                    type="number"
                    name="impact.beneficiaries"
                    value={formData.impact.beneficiaries}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                    placeholder="Number of beneficiaries"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CO2 Reduction
                  </label>
                  <input
                    type="text"
                    name="impact.co2Reduction"
                    value={formData.impact.co2Reduction}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                    placeholder="500 tons CO2/year"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Energy Generated
                  </label>
                  <input
                    type="text"
                    name="impact.energyGenerated"
                    value={formData.impact.energyGenerated}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                    placeholder="1.2 MW"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Communities Served
                  </label>
                  <input
                    type="number"
                    name="impact.communitiesServed"
                    value={formData.impact.communitiesServed}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                    placeholder="Number of communities"
                  />
                </div>
              </div>
            </div>

            {/* Additional Content */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Additional Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenges
                  </label>
                  <textarea
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                    placeholder="Key challenges faced during the project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Solutions
                  </label>
                  <textarea
                    name="solutions"
                    value={formData.solutions}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                    placeholder="Solutions implemented to address challenges"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    // </div>
//   )
// }

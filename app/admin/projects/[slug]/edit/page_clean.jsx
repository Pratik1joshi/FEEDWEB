"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Plus, X, Trash2, Upload, Calendar, Layers } from 'lucide-react'
import BasicRichTextEditor from '@/components/rich-text-editor/BasicRichTextEditor'
import AdminLayout from '@/components/AdminLayout'
import { projectsApi } from '@/lib/api-services'
import {
  PROJECT_FORM_INITIAL_STATE,
  PROJECT_ARRAY_STATE,
  SECTOR_OPTIONS,
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  PROVINCE_OPTIONS,
  arrayHelpers,
  generateSlug,
  validateProjectForm
} from '@/lib/project-form-config'

export default function EditProject() {
  const [project, setProject] = useState(null)
  const [projectType, setProjectType] = useState(null) // 'detailed' or 'map'
  const [formData, setFormData] = useState(PROJECT_FORM_INITIAL_STATE)

  // Array state management using shared configuration
  const [newTechnology, setNewTechnology] = useState('')
  const [newPartner, setNewPartner] = useState('')
  const [newOutcome, setNewOutcome] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newGoal, setNewGoal] = useState('')
  const [newActivity, setNewActivity] = useState('')
  const [newInnovation, setNewInnovation] = useState('')
  const [newReference, setNewReference] = useState('')
  const [newChallenge, setNewChallenge] = useState('')
  const [newKeyMetric, setNewKeyMetric] = useState({ label: '', value: '' })
  const [newTimelineItem, setNewTimelineItem] = useState({
    date: '',
    title: '',
    description: '',
    status: 'completed'
  })
  const [newTag, setNewTag] = useState('')
  const [newRelatedProject, setNewRelatedProject] = useState('')
  const [newPartnership, setNewPartnership] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const router = useRouter()
  const params = useParams()

  // Memoized onChange handler for rich text editor to prevent re-renders
  const handleRichTextChange = useCallback((content) => {
    setFormData(prev => ({ ...prev, fullDescription: content }))
  }, [])

  useEffect(() => {
    if (params.slug) {
      fetchProject()
    }
  }, [params.slug])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await projectsApi.getBySlug(params.slug)

      if (response.success && response.data) {
        setProject(response.data)
        setProjectType(response.data.type || 'detailed')

        // Set form data using the shared configuration
        setFormData({
          ...PROJECT_FORM_INITIAL_STATE,
          ...response.data,
          // Ensure arrays are properly initialized
          tags: response.data.tags || [],
          goals: response.data.goals || [],
          outcomes: response.data.outcomes || [],
          challenges: response.data.challenges || [],
          keyMetrics: response.data.keyMetrics || [],
          timeline: response.data.timeline || [],
          relatedProjects: response.data.relatedProjects || [],
          technologies: response.data.technologies || [],
          partners: response.data.partners || [],
          partnerships: response.data.partnerships || [],
          innovations: response.data.innovations || [],
          references: response.data.references || [],
          images: response.data.images || [],
          impactMetrics: response.data.impactMetrics || {},
          coordinates: response.data.coordinates || { lat: '', lng: '' }
        })

        // Set image previews if images exist
        if (response.data.images && response.data.images.length > 0) {
          setImagePreviews(response.data.images)
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      setErrors({ general: 'Failed to load project' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }

    // Auto-generate slug from title if title is being changed
    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }
  }

  // Helper functions for array management
  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()]
      }))
      setNewGoal('')
    }
  }

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setFormData(prev => ({
        ...prev,
        outcomes: [...prev.outcomes, newOutcome.trim()]
      }))
      setNewOutcome('')
    }
  }

  const addChallenge = () => {
    if (newChallenge.trim()) {
      setFormData(prev => ({
        ...prev,
        challenges: [...prev.challenges, newChallenge.trim()]
      }))
      setNewChallenge('')
    }
  }

  const addKeyMetric = () => {
    if (newKeyMetric.label.trim() && newKeyMetric.value.trim()) {
      setFormData(prev => ({
        ...prev,
        keyMetrics: [...prev.keyMetrics, { ...newKeyMetric }]
      }))
      setNewKeyMetric({ label: '', value: '' })
    }
  }

  const addTimelineItem = () => {
    if (newTimelineItem.date && newTimelineItem.title.trim()) {
      setFormData(prev => ({
        ...prev,
        timeline: [...prev.timeline, { ...newTimelineItem }]
      }))
      setNewTimelineItem({ date: '', title: '', description: '', status: 'completed' })
    }
  }

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }))
      setNewTechnology('')
    }
  }

  const addInnovation = () => {
    if (newInnovation.trim()) {
      setFormData(prev => ({
        ...prev,
        innovations: [...prev.innovations, newInnovation.trim()]
      }))
      setNewInnovation('')
    }
  }

  const addPartnership = () => {
    if (newPartnership.trim()) {
      setFormData(prev => ({
        ...prev,
        partnerships: [...prev.partnerships, newPartnership.trim()]
      }))
      setNewPartnership('')
    }
  }

  const addReference = () => {
    if (newReference.trim()) {
      setFormData(prev => ({
        ...prev,
        references: [...prev.references, newReference.trim()]
      }))
      setNewReference('')
    }
  }

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Process each file
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Please select valid image files only')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Please select images under 5MB`)
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreviews(prev => [...prev, event.target.result])
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, event.target.result]
        }))
      }
      reader.readAsDataURL(file)
    })

    // Clear the input
    e.target.value = ''
  }

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('=== PROJECT UPDATE SUBMIT DEBUG ===')
    console.log('Form data before processing:', formData)
    console.log('Project slug:', params.slug)
    
    // Normalize dates and prepare payload
    const normalizeDates = (data) => {
      const copy = { ...data }
      const toIso = (val) => {
        if (!val) return null
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
        const d = new Date(val)
        if (isNaN(d.getTime())) return null
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
      }
      try {
        copy.startDate = toIso(copy.startDate)
        copy.completionDate = toIso(copy.completionDate)
      } catch (err) {
        copy.startDate = null
        copy.completionDate = null
      }
      return copy
    }

    const payload = normalizeDates(formData)
    console.log('Payload after date normalization:', payload)

    const validation = validateProjectForm(payload)
    console.log('Validation result:', validation)
    
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors)
      setErrors(validation.errors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      console.log('Calling API update with slug:', params.slug)
      console.log('Final payload:', payload)
      
      const response = await projectsApi.update(params.slug, payload)
      console.log('API Response:', response)

      if (response.success) {
        console.log('Update successful!')
        alert('Project updated successfully!')
        router.push('/admin/projects')
      } else {
        console.log('Update failed:', response.error)
        setErrors({ general: response.error || 'Failed to update project' })
      }
    } catch (error) {
      console.error('Error updating project:', error)
      setErrors({ general: 'Failed to update project. Please try again.' })
    } finally {
      setIsLoading(false)
      console.log('=== END PROJECT UPDATE DEBUG ===')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-lg text-gray-600">Loading project...</div>
        </div>
      </AdminLayout>
    )
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-lg text-red-600">Project not found</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Project">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b p-6">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/projects"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Edit {projectType === 'detailed' ? 'Detailed' : 'Map'} Project
                </h1>
                <p className="text-gray-600">Update project information and details</p>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                <Link
                  href={`/projects/${params.slug}`}
                  target="_blank"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Link>
              </div>
            </div>
          </header>

          {/* Error Alert */}
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Enter comprehensive project title"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent resize-none"
                        placeholder="Brief summary for project listings - make it compelling and concise!"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">This will be shown in project listings and previews</p>
                    </div>

                    <div className="md:col-span-2">
                      <BasicRichTextEditor
                        label="🚀 Full Project Description *"
                        value={formData.fullDescription}
                        onChange={handleRichTextChange}
                        placeholder="Write a comprehensive project description with formatting, images, and detailed information... Make it awesome!"
                        height="500px"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        required
                      >
                        <option value="">Select category</option>
                        {CATEGORY_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sector
                      </label>
                      <select
                        name="sector"
                        value={formData.sector}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                      >
                        <option value="">Select sector</option>
                        {SECTOR_OPTIONS.map(option => (
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Detailed project location"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Province
                      </label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                      >
                        <option value="">Select province</option>
                        <option value="Koshi Province">Koshi Province</option>
                        <option value="Madhesh Province">Madhesh Province</option>
                        <option value="Bagmati Province">Bagmati Province</option>
                        <option value="Gandaki Province">Gandaki Province</option>
                        <option value="Lumbini Province">Lumbini Province</option>
                        <option value="Karnali Province">Karnali Province</option>
                        <option value="Sudurpashchim Province">Sudurpashchim Province</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="District name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-6">Geographic Coordinates</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Latitude</label>
                          <input
                            type="number"
                            step="any"
                            name="coordinates.lat"
                            value={formData.coordinates?.lat || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                            placeholder="27.7172"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Longitude</label>
                          <input
                            type="number"
                            step="any"
                            name="coordinates.lng"
                            value={formData.coordinates?.lng || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                            placeholder="85.3240"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="e.g., 18 months"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Size
                      </label>
                      <input
                        type="text"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="e.g., 15 researchers"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget
                      </label>
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="e.g., USD 850,000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Funding Agency
                      </label>
                      <input
                        type="text"
                        name="fundingAgency"
                        value={formData.fundingAgency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="World Bank, Asian Development Bank, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Type
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                      >
                        <option value="">Select type</option>
                        <option value="Research">Research</option>
                        <option value="Feasibility Study">Feasibility Study</option>
                        <option value="Implementation">Implementation</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Assessment">Assessment</option>
                        <option value="Planning">Planning</option>
                        <option value="Monitoring">Monitoring</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#1A365D] border-gray-300 rounded focus:ring-[#1A365D]"
                        />
                        Featured Project
                        <span className="text-gray-500 font-normal">(Display prominently on website)</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="text"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="e.g., March 2022"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Completion Date
                      </label>
                      <input
                        type="text"
                        name="completionDate"
                        value={formData.completionDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="e.g., February 2024"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Partners
                      </label>
                      <input
                        type="text"
                        name="clientPartners"
                        value={formData.clientPartners}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Comma-separated list of client organizations"
                      />
                    </div>
                  </div>
                </div>

                {/* Technologies & Tools */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Technologies & Tools</h2>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Add technology or tool (e.g., GIS Mapping, Remote Sensing)"
                      />
                      <button
                        type="button"
                        onClick={addTechnology}
                        className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>

                    {formData.technologies && formData.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.technologies.map((tech, index) => (
                          <div key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            <span>{tech}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, technologies: prev.technologies.filter((_, i) => i !== index) }))}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Project Tags</h2>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Add project tag for easier searching..."
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>

                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <div key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }))}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Images */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Project Images</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Multiple Images
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                      />
                      <p className="text-sm text-gray-500 mt-1">Select multiple images (max 5MB each)</p>
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Link
                    href="/admin/projects"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update Project
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </AdminLayout>
  )
}

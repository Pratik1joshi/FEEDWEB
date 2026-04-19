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
  const [newGoal, setNewGoal] = useState('')
  const [newOutcome, setNewOutcome] = useState('')
  const [newChallenge, setNewChallenge] = useState('')
  const [newKeyMetric, setNewKeyMetric] = useState({ label: '', value: '' })
  const [newTimelineItem, setNewTimelineItem] = useState({
    date: '',
    title: '',
    description: '',
    status: 'completed'
  })
  const [newTechnology, setNewTechnology] = useState('')
  const [newInnovation, setNewInnovation] = useState('')
  const [newPartnership, setNewPartnership] = useState('')
  const [newReference, setNewReference] = useState('')
  const [newTag, setNewTag] = useState('')
  
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

    setImageFiles(prev => [...prev, ...files])
  }

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
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

  const removeGoal = (index) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }))
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

  const removeOutcome = (index) => {
    setFormData(prev => ({
      ...prev,
      outcomes: prev.outcomes.filter((_, i) => i !== index)
    }))
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

  const removeChallenge = (index) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges.filter((_, i) => i !== index)
    }))
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

  const removeKeyMetric = (index) => {
    setFormData(prev => ({
      ...prev,
      keyMetrics: prev.keyMetrics.filter((_, i) => i !== index)
    }))
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

  const removeTimelineItem = (index) => {
    setFormData(prev => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index)
    }))
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

  const removeTechnology = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }))
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

  const removeInnovation = (index) => {
    setFormData(prev => ({
      ...prev,
      innovations: prev.innovations.filter((_, i) => i !== index)
    }))
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

  const removePartnership = (index) => {
    setFormData(prev => ({
      ...prev,
      partnerships: prev.partnerships.filter((_, i) => i !== index)
    }))
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

  const removeReference = (index) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }))
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

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const buildMapProjectPayload = (data) => {
    const lat = parseFloat(data?.coordinates?.lat)
    const lng = parseFloat(data?.coordinates?.lng)

    return {
      title: data.title?.trim() || '',
      slug: data.slug?.trim() || generateSlug(data.title || ''),
      description: data.description?.trim() || '',
      location: data.location?.trim() || '',
      category: data.category?.trim() || '',
      status: data.status || 'Planning',
      province: data.province?.trim() || '',
      district: data.district?.trim() || '',
      coordinates: {
        lat: Number.isFinite(lat) ? lat : '',
        lng: Number.isFinite(lng) ? lng : '',
      },
      featured: Boolean(data.featured),
      type: 'map',
    }
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

    const normalizedPayload = normalizeDates(formData)
    const payload = projectType === 'map'
      ? buildMapProjectPayload(normalizedPayload)
      : normalizedPayload

    console.log('Payload after normalization:', payload)

    const validation = validateProjectForm(payload, projectType)
    console.log('Validation result:', validation)
    
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors)
      setErrors(validation.errors)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

    setIsLoading(true)

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

  const handleCreateAndConvert = async () => {
    setIsLoading(true)

    try {
      const slug = generateSlug(formData.title)
      
      // Create detailed project
      const detailedProjectData = {
        slug,
        ...formData,
        createdAt: new Date().toISOString(),
        type: 'detailed'
      }

      // Convert to map project with essential fields only
      const mapProjectData = {
        id: Date.now(),
        slug: slug + '-map',
        title: formData.title,
        description: formData.description,
        location: formData.location,
        coordinates: {
          lat: parseFloat(formData.coordinates.lat) || 27.7172,
          lng: parseFloat(formData.coordinates.lng) || 85.3240
        },
        status: formData.status,
        budget: formData.budget,
        duration: formData.duration,
        category: formData.category,
        province: formData.province,
        district: formData.district,
        image: formData.images && formData.images[0] || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop',
        impact: {
          beneficiaries: formData.impactMetrics.beneficiaries || 'N/A',
          areaKm2: formData.impactMetrics.areaKm2 || 'N/A',
          co2Reduction: formData.impactMetrics.co2Reduction || 'N/A'
        },
        clientPartners: formData.clientPartners,
        teamSize: formData.teamSize,
        tags: formData.tags,
        featured: formData.featured,
        type: 'map',
        createdAt: new Date().toISOString()
      }

      console.log('Creating detailed project:', detailedProjectData)
      console.log('Creating map project:', mapProjectData)
      
      // Create both projects via API
      const detailedResponse = await projectsApi.create(detailedProjectData)
      const mapResponse = await projectsApi.create(mapProjectData)
      
      console.log('Detailed project response:', detailedResponse)
      console.log('Map project response:', mapResponse)
      
      alert('Detailed project updated and added to map projects successfully!')
      router.push('/admin/projects')
      
    } catch (error) {
      console.error('Error creating and converting project:', error)
      alert('Error creating project: ' + (error.message || 'Please try again.'))
    } finally {
      setIsLoading(false)
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

  if (projectType === 'map') {
    return (
      <AdminLayout title="Edit Map Project">
        <div className="min-h-screen bg-gray-50 flex">
          <div className="flex-1 flex flex-col">
            <header className="bg-white shadow-sm border-b p-6">
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/projects"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Edit Map Project</h1>
                  <p className="text-gray-600">Only map-essential fields are shown here</p>
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

            {Object.keys(errors).length > 0 && (
              <div className="my-6 mx-auto max-w-4xl bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-lg font-bold">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  Please fix the following validation errors:
                </div>
                <ul className="list-disc list-inside pl-2 space-y-2">
                  {Object.entries(errors).map(([key, msg]) => (
                    <li key={key}>
                      <span className="font-semibold px-2 py-1 bg-red-100 rounded capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>: {msg}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <main className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Map Essentials</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                          placeholder="Map project title"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brief Description *</label>
                        <textarea
                          name="description"
                          value={formData.description || ''}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                          placeholder="Short text for map and listings"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                          placeholder="District, Province"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                          name="category"
                          value={formData.category || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                          required
                        >
                          <option value="">Select category</option>
                          {CATEGORY_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                        <select
                          name="province"
                          value={formData.province || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        >
                          <option value="">Select province</option>
                          {PROVINCE_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                        <input
                          type="text"
                          name="district"
                          value={formData.district || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                          placeholder="District name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          name="status"
                          value={formData.status || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                        <input
                          type="number"
                          step="any"
                          name="coordinates.lat"
                          value={formData.coordinates?.lat ?? formData.coordinates?.y ?? ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                          placeholder="27.7172"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                        <input
                          type="number"
                          step="any"
                          name="coordinates.lng"
                          value={formData.coordinates?.lng ?? formData.coordinates?.x ?? ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                          placeholder="85.3240"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <input
                            type="checkbox"
                            name="featured"
                            checked={Boolean(formData.featured)}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#1A365D] border-gray-300 rounded focus:ring-[#1A365D]"
                          />
                          Featured project
                        </label>
                      </div>
                    </div>
                  </div>

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
                      className="px-6 py-3 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Update Map Project
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

          {/* Validation Errors Alert */}
          {Object.keys(errors).length > 0 && (
            <div className="my-6 mx-auto max-w-6xl bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-lg font-bold">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                Please fix the following validation errors:
              </div>
              <ul className="list-disc list-inside pl-2 space-y-2">
                {Object.entries(errors).map(([key, msg]) => (
                  <li key={key}>
                    <span className="font-semibold px-2 py-1 bg-red-100 rounded capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>: {msg}
                  </li>
                ))}
              </ul>
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
                        value={formData.title || ''}
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
                        value={formData.description || ''}
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
                        value={formData.fullDescription || ''}
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
                        value={formData.category || ''}
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
                        value={formData.sector || ''}
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
                        value={formData.location || ''}
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
                        value={formData.province || ''}
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
                        value={formData.district || ''}
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
                            value={formData.coordinates?.lat || formData.y || formData.coordinates.y|| ''}
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
                            value={formData.coordinates?.lng || formData.x || formData.coordinates.x || ''}
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
                        value={formData.duration || ''}
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
                        value={formData.teamSize || ''}
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
                        value={formData.status || ''}
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
                        value={formData.budget || ''}
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
                        value={formData.fundingAgency || ''}
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
                        value={formData.projectType || ''}
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
                        value={formData.priority || ''}
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
                          checked={formData.featured || false}
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
                        value={formData.startDate || ''}
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
                        value={formData.completionDate || ''}
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
                        value={formData.clientPartners || ''}
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
                              onClick={() => removeTechnology(index)}
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
                              onClick={() => removeTag(index)}
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

                {/* Project Goals */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Project Goals</h2>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Add a project goal..."
                      />
                      <button
                        type="button"
                        onClick={addGoal}
                        className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>

                    {formData.goals && formData.goals.length > 0 && (
                      <div className="space-y-2">
                        {formData.goals.map((goal, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="flex-1">{goal}</span>
                            <button
                              type="button"
                              onClick={() => removeGoal(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Outcomes */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Project Outcomes</h2>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newOutcome}
                        onChange={(e) => setNewOutcome(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Add a project outcome..."
                      />
                      <button
                        type="button"
                        onClick={addOutcome}
                        className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>

                    {formData.outcomes && formData.outcomes.length > 0 && (
                      <div className="space-y-2">
                        {formData.outcomes.map((outcome, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="flex-1">{outcome}</span>
                            <button
                              type="button"
                              onClick={() => removeOutcome(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Challenges */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Project Challenges</h2>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newChallenge}
                        onChange={(e) => setNewChallenge(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Add a project challenge..."
                      />
                      <button
                        type="button"
                        onClick={addChallenge}
                        className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>

                    {formData.challenges && formData.challenges.length > 0 && (
                      <div className="space-y-2">
                        {formData.challenges.map((challenge, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="flex-1">{challenge}</span>
                            <button
                              type="button"
                              onClick={() => removeChallenge(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Key Metrics</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newKeyMetric.label}
                        onChange={(e) => setNewKeyMetric(prev => ({ ...prev, label: e.target.value }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Metric label (e.g., Area Mapped)"
                      />
                      <input
                        type="text"
                        value={newKeyMetric.value}
                        onChange={(e) => setNewKeyMetric(prev => ({ ...prev, value: e.target.value }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Metric value (e.g., 150 km²)"
                      />
                      <button
                        type="button"
                        onClick={addKeyMetric}
                        className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Metric
                      </button>
                    </div>

                    {formData.keyMetrics && formData.keyMetrics.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.keyMetrics.map((metric, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-medium">{metric.label}: </span>
                              <span>{metric.value}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeKeyMetric(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Comprehensive Impact Metrics */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Impact Metrics</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Beneficiaries</label>
                      <input
                        type="number"
                        name="impactMetrics.beneficiaries"
                        value={formData.impactMetrics?.beneficiaries || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="15000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Direct Beneficiaries</label>
                      <input
                        type="number"
                        name="impactMetrics.directBeneficiaries"
                        value={formData.impactMetrics?.directBeneficiaries || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="5000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Indirect Beneficiaries</label>
                      <input
                        type="number"
                        name="impactMetrics.indirectBeneficiaries"
                        value={formData.impactMetrics?.indirectBeneficiaries || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="10000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Area Covered (km²)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="impactMetrics.areaKm2"
                        value={formData.impactMetrics?.areaKm2 || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="150.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CO2 Reduction (tons/year)</label>
                      <input
                        type="number"
                        name="impactMetrics.co2Reduction"
                        value={formData.impactMetrics?.co2Reduction || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="140000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Energy Generated (GWh/year)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="impactMetrics.energyGenerated"
                        value={formData.impactMetrics?.energyGenerated || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="280"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Communities Served</label>
                      <input
                        type="number"
                        name="impactMetrics.communitiesServed"
                        value={formData.impactMetrics?.communitiesServed || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="45"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jobs Created</label>
                      <input
                        type="number"
                        name="impactMetrics.jobsCreated"
                        value={formData.impactMetrics?.jobsCreated || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">People Trained/Capacity Built</label>
                      <input
                        type="number"
                        name="impactMetrics.capacityBuilt"
                        value={formData.impactMetrics?.capacityBuilt || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="200"
                      />
                    </div>
                  </div>
                </div>

                {/* Sustainability & Innovation */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Sustainability & Innovation</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sustainability Strategy
                      </label>
                      <textarea
                        name="sustainability"
                        value={formData.sustainability || ''}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Describe long-term sustainability plans and strategies..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">Key Innovations</label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newInnovation}
                            onChange={(e) => setNewInnovation(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                            placeholder="Add an innovation or breakthrough..."
                          />
                          <button
                            type="button"
                            onClick={addInnovation}
                            className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </button>
                        </div>

                        {formData.innovations && formData.innovations.length > 0 && (
                          <div className="space-y-2">
                            {formData.innovations.map((innovation, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <span className="flex-1">{innovation}</span>
                                <button
                                  type="button"
                                  onClick={() => removeInnovation(index)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partnerships & References */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Partnerships & References</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">Key Partnerships</label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newPartnership}
                            onChange={(e) => setNewPartnership(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                            placeholder="Add partnership organization or collaboration..."
                          />
                          <button
                            type="button"
                            onClick={addPartnership}
                            className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </button>
                        </div>

                        {formData.partnerships && formData.partnerships.length > 0 && (
                          <div className="space-y-2">
                            {formData.partnerships.map((partnership, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <span className="flex-1">{partnership}</span>
                                <button
                                  type="button"
                                  onClick={() => removePartnership(index)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">References & Documentation</label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newReference}
                            onChange={(e) => setNewReference(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                            placeholder="Add reference document, publication, or link..."
                          />
                          <button
                            type="button"
                            onClick={addReference}
                            className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </button>
                        </div>

                        {formData.references && formData.references.length > 0 && (
                          <div className="space-y-2">
                            {formData.references.map((reference, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <span className="flex-1">{reference}</span>
                                <button
                                  type="button"
                                  onClick={() => removeReference(index)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk & Impact Assessment */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Risk & Impact Assessment</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Risk Assessment
                      </label>
                      <textarea
                        name="riskAssessment"
                        value={formData.riskAssessment || ''}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Identify potential risks and mitigation strategies..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Environmental Impact
                      </label>
                      <textarea
                        name="environmentalImpact"
                        value={formData.environmentalImpact || ''}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Describe environmental benefits, impacts, and considerations..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Social Impact
                      </label>
                      <textarea
                        name="socialImpact"
                        value={formData.socialImpact || ''}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Describe social benefits, community impact, and engagement..."
                      />
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Project Timeline</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                      <input
                        type="text"
                        value={newTimelineItem.date}
                        onChange={(e) => setNewTimelineItem(prev => ({ ...prev, date: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Date (e.g., March 2023)"
                      />
                      <input
                        type="text"
                        value={newTimelineItem.title}
                        onChange={(e) => setNewTimelineItem(prev => ({ ...prev, title: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Milestone title"
                      />
                      <input
                        type="text"
                        value={newTimelineItem.description}
                        onChange={(e) => setNewTimelineItem(prev => ({ ...prev, description: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                        placeholder="Description"
                      />
                      <select
                        value={newTimelineItem.status}
                        onChange={(e) => setNewTimelineItem(prev => ({ ...prev, status: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                      >
                        <option value="completed">Completed</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="planned">Planned</option>
                      </select>
                      <button
                        type="button"
                        onClick={addTimelineItem}
                        className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>

                    {formData.timeline && formData.timeline.length > 0 && (
                      <div className="space-y-3">
                        {formData.timeline.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <span className="font-medium text-[#1A365D]">{item.date}</span>
                                <span className="font-semibold">{item.title}</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  item.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.status}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-gray-600 text-sm">{item.description}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTimelineItem(index)}
                              className="text-red-600 hover:text-red-800 p-1 ml-4"
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
                  {projectType === 'detailed' && (
                    <button
                      type="button"
                      onClick={handleCreateAndConvert}
                      disabled={isLoading}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Layers className="w-4 h-4" />
                          Update + Add to Map
                        </>
                      )}
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
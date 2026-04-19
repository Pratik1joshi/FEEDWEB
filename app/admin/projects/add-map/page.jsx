"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import { projectsApi } from '@/lib/api-services'
import { validateProjectForm } from '@/lib/project-form-config'

export default function AddMapProject() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    province: '',
    district: '',
    coordinates: {
      lat: '',
      lng: ''
    },
    status: 'Planning',
    category: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...formData,
      coordinates: {
        lat: formData.coordinates.lat,
        lng: formData.coordinates.lng,
      },
    }

    const validation = validateProjectForm(payload, 'map')
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    setErrors({})
    setIsSubmitting(true)

    try {
      const slug = generateSlug(payload.title)

      const projectData = {
        title: payload.title,
        slug,
        description: payload.description,
        location: payload.location,
        province: payload.province,
        district: payload.district,
        category: payload.category,
        status: payload.status,
        coordinates: {
          lat: parseFloat(payload.coordinates.lat),
          lng: parseFloat(payload.coordinates.lng),
        },
        type: 'map',
      }

      await projectsApi.create(projectData)
      
      alert('Map project created successfully!')
      router.push('/admin/projects')
      
    } catch (error) {
      console.error('Error creating project:', error)
      const errMsgs = error.response?.data?.errors?.join(', ') || error.message || 'Failed to create'
      setErrors({ general: 'Server Error: ' + errMsgs })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <AdminLayout title="Add Map Project">
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
              <h1 className="text-2xl font-bold text-gray-800">Add Map Project</h1>
              <p className="text-gray-600">Create a new map project with essential information</p>
            </div>
          </div>
        </header>

        {/* Form */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Map Project</p>
                  <p className="text-sm text-blue-600">This form creates lightweight projects for map visualization. For comprehensive project details, use the "Add Detailed Project" form.</p>
                </div>
              </div>
            </div>

            
          {/* Validation Errors Alert */}
          {Object.keys(errors || {}).length > 0 && (
            <div className="my-6 mx-auto max-w-4xl bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-lg font-bold">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                Please fix the following validation errors:
              </div>
              <ul className="list-disc list-inside pl-2 space-y-2">
                {Object.entries(errors || {}).map(([key, msg]) => (
                  <li key={key}>
                    <span className="font-semibold px-2 py-1 bg-red-100 rounded capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>: {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
              {/* Essential Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Map Project - Minimal Info</h2>
                
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
                      placeholder="Enter project title"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brief Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                      placeholder="One line description for map popup"
                      required
                    />
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
                      placeholder="District, Province"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      <option value="DRR/Environment">DRR/Environment</option>
                      <option value="Climate Action">Climate Action</option>
                      <option value="Renewable Energy">Renewable Energy</option>
                      <option value="Water Management">Water Management</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Research">Research</option>
                    </select>
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
                      <option value="Planning">Planning</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Coordinates - Required for Map */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Map Coordinates *
                  <span className="text-sm font-normal text-gray-600 block">Required to show on map</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="coordinates.lat"
                      value={formData.coordinates.lat}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                      placeholder="27.7172"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="coordinates.lng"
                      value={formData.coordinates.lng}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                      placeholder="85.3240"
                      required
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Use <a href="https://www.latlong.net/" target="_blank" className="text-blue-600 hover:underline">LatLong.net</a> to find coordinates
                </p>
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
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Add to Map
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

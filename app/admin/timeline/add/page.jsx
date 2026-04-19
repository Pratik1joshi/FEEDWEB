'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../../../components/AdminLayout'
import { timelineApi } from '../../../../lib/api-services'
import { TIMELINE_FORM_INITIAL_STATE, TIMELINE_CATEGORIES, validateTimelineForm, cleanTimelineData } from '../../../../lib/timeline-form-config'
import { timelineIcons } from '../../../../src/data/timeline'
import { Flag, Award, Heart, FileText, Building, Globe, Users, Target, MapPin, TrendingUp, Star, Lightbulb, Zap, Leaf, BookOpen, ArrowLeft, Save, AlertCircle } from 'lucide-react'

const iconComponents = {
  Flag, Award, Heart, FileText, Building, Globe, Users, Target, MapPin, TrendingUp, Star, Lightbulb, Zap, Leaf, BookOpen
}

export default function AddTimeline() {
  const router = useRouter()
  
  const [formData, setFormData] = useState(TIMELINE_FORM_INITIAL_STATE)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateTimelineForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const finalData = cleanTimelineData(formData)
      const result = await timelineApi.create(finalData)
      
      if (result.success) {
        // Show success message and redirect
        router.push('/admin/timeline')
        router.refresh()
      } else {
        throw new Error(result.message || 'Failed to create timeline item')
      }
    } catch (error) {
      console.error('Timeline creation error:', error)
      setErrors({ submit: error.message || 'Failed to create timeline item. Please try again.' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/timeline')
  }

  const SelectedIcon = iconComponents[formData.icon]

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Timeline
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Timeline Item</h1>
          <p className="text-gray-600 mt-2">Create a new milestone for the organization's journey</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          {/* General Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.year ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 2024"
                />
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {TIMELINE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter timeline item title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe this milestone in detail..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Icon Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {timelineIcons.map((iconOption) => {
                    const IconComp = iconComponents[iconOption.name]
                    return (
                      <button
                        key={iconOption.name}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon: iconOption.name }))}
                        className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                          formData.icon === iconOption.name
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComp className="w-6 h-6 mb-1" />
                        <span className="text-xs text-center">{iconOption.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Mark as featured item
                  </span>
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="bg-white p-4 rounded-lg border-t-3 border-blue-600 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-blue-600 font-bold text-lg">{formData.year || 'Year'}</span>
                  <div className="flex items-center space-x-1">
                    <SelectedIcon className="w-4 h-4 text-gray-600" />
                    {formData.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  </div>
                </div>
                <h4 className="text-base font-serif font-bold text-gray-800 mb-2">
                  {formData.title || 'Timeline Title'}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                  {formData.description || 'Timeline description will appear here...'}
                </p>
                <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {formData.category}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Creating...' : 'Add Timeline Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}





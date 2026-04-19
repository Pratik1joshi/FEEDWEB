'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '../../../../../components/AdminLayout'
import { timelineData, timelineIcons, timelineCategories } from '../../../../../src/data/timeline'
import { Flag, Award, Heart, FileText, Building, Globe, Users, Target, MapPin, TrendingUp, Star, Lightbulb, Zap, Leaf, BookOpen, ArrowLeft, Save } from 'lucide-react'

const iconComponents = {
  Flag, Award, Heart, FileText, Building, Globe, Users, Target, MapPin, TrendingUp, Star, Lightbulb, Zap, Leaf, BookOpen
}

export default function EditTimeline() {
  const router = useRouter()
  const params = useParams()
  const timelineId = parseInt(params.id)
  
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    icon: 'Flag',
    category: 'Milestone',
    featured: false
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load timeline data
    const item = timelineData.find(t => t.id === timelineId)
    if (item) {
      setFormData({
        year: item.year,
        title: item.title,
        description: item.description,
        icon: item.icon || 'Flag',
        category: item.category || 'Milestone',
        featured: item.featured || false
      })
    }
    setLoading(false)
  }, [timelineId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.year) newErrors.year = 'Year is required'
    if (!formData.title) newErrors.title = 'Title is required'
    if (!formData.description) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would update in your backend/database
      console.log('Updated timeline item:', formData)
      router.push('/admin/timeline')
    }
  }

  const handleCancel = () => {
    router.push('/admin/timeline')
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="space-y-6">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const SelectedIcon = iconComponents[formData.icon]

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Timeline Item</h1>
          <p className="text-gray-600 mt-2">Update the timeline milestone</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
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
                  {timelineCategories.map((category) => (
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
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
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
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Update Timeline Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

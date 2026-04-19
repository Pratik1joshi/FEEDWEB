'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '../../../../components/AdminLayout'
import { timelineData } from '../../../../src/data/timeline'
import { Flag, Award, Heart, FileText, Building, Globe, Users, Target, MapPin, TrendingUp, Star, Lightbulb, Zap, Leaf, BookOpen, ArrowLeft, Edit, Trash2 } from 'lucide-react'

const iconComponents = {
  Flag, Award, Heart, FileText, Building, Globe, Users, Target, MapPin, TrendingUp, Star, Lightbulb, Zap, Leaf, BookOpen
}

export default function TimelineDetail() {
  const router = useRouter()
  const params = useParams()
  const timelineId = parseInt(params.id)
  
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load timeline data
    const timelineItem = timelineData.find(t => t.id === timelineId)
    if (timelineItem) {
      setItem(timelineItem)
    }
    setLoading(false)
  }, [timelineId])

  const handleEdit = () => {
    router.push(`/admin/timeline/edit/${timelineId}`)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this timeline item?')) {
      // Here you would delete from your backend/database
      console.log('Delete timeline item:', timelineId)
      router.push('/admin/timeline')
    }
  }

  const handleBack = () => {
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
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!item) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Timeline Item Not Found</h2>
            <p className="text-gray-600 mb-8">The timeline item you're looking for doesn't exist.</p>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Timeline
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const IconComponent = iconComponents[item.icon] || BookOpen

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Timeline
            </button>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
              <p className="text-gray-600 mt-2">Timeline item from {item.year}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-200 mb-8">
              <div className={`p-4 rounded-xl ${item.featured ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                <IconComponent className={`w-8 h-8 ${item.featured ? 'text-yellow-600' : 'text-blue-600'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-2xl font-bold ${item.featured ? 'text-yellow-600' : 'text-blue-600'}`}>
                    {item.year}
                  </span>
                  {item.featured && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  )}
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    {item.category}
                  </span>
                </div>
                <h2 className="text-xl font-serif font-bold text-gray-900">{item.title}</h2>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-base">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Timeline Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Preview</h3>
              <div className="max-w-sm">
                <div className="bg-gray-50 p-4 rounded-lg border-t-3 border-blue-600">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-600 font-bold text-lg">{item.year}</span>
                    <div className="flex items-center space-x-1">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      {item.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    </div>
                  </div>
                  <h4 className="text-base font-serif font-bold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

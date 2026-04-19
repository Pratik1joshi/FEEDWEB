'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../../components/AdminLayout'
import { timelineData, timelineCategories } from '../../../src/data/timeline'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Calendar,
  Flag, 
  Award, 
  Heart, 
  FileText, 
  Building, 
  Globe, 
  Users, 
  Target, 
  MapPin, 
  TrendingUp, 
  Lightbulb, 
  Zap, 
  Leaf, 
  BookOpen 
} from 'lucide-react'

const iconComponents = {
  Flag, Award, Heart, FileText, Building, Globe, Users, Target, MapPin, TrendingUp, Star, Lightbulb, Zap, Leaf, BookOpen
}

export default function TimelinePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')

  // Get unique years from timeline data
  const uniqueYears = ['All', ...new Set(timelineData.map(item => item.year))].sort((a, b) => {
    if (a === 'All') return -1
    if (b === 'All') return 1
    return b.localeCompare(a)
  })

  // Filter timeline data
  const filteredItems = timelineData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesYear = selectedYear === 'All' || item.year === selectedYear
    
    return matchesSearch && matchesCategory && matchesYear
  })

  const handleEdit = (id) => {
    router.push(`/admin/timeline/edit/${id}`)
  }

  const handleView = (id) => {
    router.push(`/admin/timeline/${id}`)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this timeline item?')) {
      // Here you would delete from your backend/database
      console.log('Delete timeline item:', id)
    }
  }

  const handleAddNew = () => {
    router.push('/admin/timeline/add')
  }

  const getIconComponent = (iconName) => {
    return iconComponents[iconName] || Calendar
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Timeline Management</h1>
              <p className="text-gray-600 mt-2">Manage your organization's timeline milestones</p>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Timeline Item
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search timeline items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              {timelineCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {uniqueYears.map(year => (
                <option key={year} value={year}>
                  {year === 'All' ? 'All Years' : year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Timeline Items ({filteredItems.length})
              </h2>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No timeline items found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedCategory !== 'All' || selectedYear !== 'All'
                    ? 'Try adjusting your search filters.'
                    : 'Get started by adding your first timeline item.'
                  }
                </p>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Timeline Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const IconComponent = getIconComponent(item.icon)
                  return (
                    <div
                      key={item.id}
                      className={`bg-white p-6 rounded-lg border-2 hover:shadow-lg transition-all duration-200 ${
                        item.featured ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            item.featured ? 'bg-yellow-100' : 'bg-blue-100'
                          }`}>
                            <IconComponent className={`w-4 h-4 ${
                              item.featured ? 'text-yellow-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <span className={`text-sm font-bold ${
                              item.featured ? 'text-yellow-600' : 'text-blue-600'
                            }`}>
                              {item.year}
                            </span>
                            {item.featured && (
                              <Star className="w-3 h-3 text-yellow-500 fill-current inline ml-1" />
                            )}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(item.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

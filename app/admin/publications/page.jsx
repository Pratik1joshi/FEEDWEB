"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Plus, Eye, Edit, Trash2, Download, Calendar, Users, FileText, BookOpen } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'

export default function PublicationsManagement() {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Fetch publications from API
  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/publications')
      const data = await response.json()
      
      if (data.success) {
        setPublications(data.data)
      } else {
        console.error('Failed to fetch publications:', data.message)
      }
    } catch (error) {
      console.error('Error fetching publications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter publications
  const filteredPublications = publications.filter(publication => {
    const matchesSearch = publication.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         publication.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (publication.authors && publication.authors.some(author => 
                           author.toLowerCase().includes(searchTerm.toLowerCase())))
    
    const matchesType = selectedType === '' || publication.type === selectedType
    const matchesStatus = selectedStatus === '' || 
                         (selectedStatus === 'published' && publication.is_published) ||
                         (selectedStatus === 'draft' && !publication.is_published)

    return matchesSearch && matchesType && matchesStatus
  })

  // Get unique types for filters
  const types = [...new Set(publications.map(pub => pub.type).filter(Boolean))]
  const statuses = ['Published', 'Draft']

  const handleDelete = async (pubId, pubTitle) => {
    if (window.confirm(`Are you sure you want to delete "${pubTitle}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/publications/${pubId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (data.success) {
          alert('Publication deleted successfully!')
          fetchPublications() // Refresh the list
        } else {
          alert('Error deleting publication: ' + data.message)
        }
      } catch (error) {
        console.error('Error deleting publication:', error)
        alert('Error deleting publication. Please try again.')
      }
    }
  }

  const getStatusColor = (isPublished) => {
    return isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'research report':
      case 'research paper':
        return <FileText className="w-4 h-4" />
      case 'report':
      case 'white paper':
        return <BookOpen className="w-4 h-4" />
      case 'policy brief':
        return <FileText className="w-4 h-4" />
      case 'case study':
        return <BookOpen className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Publications Management">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading publications...</span>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Publications Management">
      {/* Action Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-600">Manage research papers, reports, and policy briefs</p>
        </div>
        <Link
          href="/admin/publications/add"
          className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Publication
        </Link>
      </div>

      {/* Filters */}
      <div className="p-6 bg-white border-b">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search publications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent min-w-[150px]"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent min-w-[150px]"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredPublications.length} of {publications.length} publications
        </div>
      </div>

      {/* Publications Grid */}
      <div className="grid gap-6">
        {filteredPublications.map((publication) => (
            <div key={publication.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {/* Title and Type */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-[#1A365D]/10 rounded-lg text-[#1A365D]">
                        {getTypeIcon(publication.type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{publication.title}</h3>
                        <p className="text-sm text-gray-600">{publication.type}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">{publication.description || publication.abstract}</p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      {publication.publication_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(publication.publication_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {publication.authors && publication.authors.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{publication.authors.slice(0, 2).join(', ')}</span>
                          {publication.authors.length > 2 && <span> +{publication.authors.length - 2} more</span>}
                        </div>
                      )}
                      {publication.download_count && (
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span>{publication.download_count} downloads</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {publication.tags && publication.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {publication.tags.slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {publication.tags.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                            +{publication.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="ml-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(publication.is_published)}`}>
                      {publication.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/publications/view/${publication.id}`}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      href={`/admin/publications/edit/${publication.id}`}
                      className="px-3 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(publication.id, publication.title)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>

                  {/* Additional Actions */}
                  <div className="flex gap-2">
                    {publication.download_url && (
                      <a
                        href={publication.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-[#1A365D] hover:bg-[#1A365D]/5 rounded-lg flex items-center gap-2 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPublications.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No publications found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedType || selectedStatus
                ? 'Try adjusting your filters'
                : 'Get started by adding your first publication'}
            </p>
            <Link
              href="/admin/publications/add"
              className="inline-flex items-center px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Publication
            </Link>
          </div>
        )}
    </AdminLayout>
  )
}

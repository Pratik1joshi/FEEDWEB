'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApi, useProjects } from '../../../src/hooks/useApi'
import { projectsApi } from '../../../src/lib/api'
import AdminLayout from '@/components/AdminLayout'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Calendar,
  MapPin,
  DollarSign,
  Layers,
  Filter,
  MoreHorizontal
} from 'lucide-react'

export default function ProjectsAdmin() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('detailed') // 'detailed', 'map'
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterSector, setFilterSector] = useState('All')
  const [deleteLoading, setDeleteLoading] = useState(null)
  
  // State for projects and counts
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [detailedCount, setDetailedCount] = useState(0)
  const [mapCount, setMapCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const LIMIT = 20;

  // Ref for scroll preservation
  const scrollRef = React.useRef(null)

  // Fetch projects (incremental)
  const fetchProjects = React.useCallback(async (type, reset = false, customOffset = null) => {
    setLoading(true)
    setError(null)
    try {
      const currentOffset = customOffset !== null ? customOffset : (reset ? 0 : offset);
      console.log('=== FETCH PROJECTS DEBUG ===');
      console.log('Type:', type);
      console.log('Reset:', reset);
      console.log('Custom offset:', customOffset);
      console.log('Current offset:', currentOffset);
      console.log('State offset:', offset);
      
      const response = await projectsApi.getAll({
        type: type,
        limit: LIMIT,
        offset: currentOffset,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      })
      
      const newProjects = response.data || [];
      const totalProjects = response.pagination?.total || 0;
      const totalLoaded = reset ? newProjects.length : (projects.length + newProjects.length);
      
      console.log('Response data length:', newProjects.length);
      console.log('Total from API:', totalProjects);
      console.log('Total loaded so far:', totalLoaded);
      console.log('Has more calculation:', (currentOffset + LIMIT) < totalProjects);
      console.log('========================');
      
      if (reset) {
        setProjects(newProjects);
      } else {
        setProjects(prev => [...prev, ...newProjects]);
      }
      setHasMore((currentOffset + LIMIT) < totalProjects);
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [projects.length])

  // Fetch counts for both types
  const fetchCounts = React.useCallback(async () => {
    try {
      const [detailedResponse, mapResponse] = await Promise.all([
        projectsApi.getAll({ type: 'detailed', limit: 1 }),
        projectsApi.getAll({ type: 'map', limit: 1 })
      ])
      setDetailedCount(detailedResponse.pagination?.total || 0)
      setMapCount(mapResponse.pagination?.total || 0)
    } catch (err) {
      console.error('Error fetching counts:', err)
    }
  }, [])

  // Reset offset and projects when tab changes
  React.useEffect(() => {
    console.log('=== TAB CHANGE DEBUG ===');
    console.log('Switching to tab:', activeTab);
    console.log('Resetting state...');
    setOffset(0);
    setProjects([]);
    setHasMore(true);
    fetchProjects(activeTab, true);
  }, [activeTab])

  // Fetch counts on mount
  React.useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  // Load more handler
  const handleLoadMore = () => {
    // Preserve scroll position
    const scrollPosition = window.scrollY;
    
    const newOffset = offset + LIMIT;
    console.log('=== LOAD MORE DEBUG ===');
    console.log('Current offset:', offset);
    console.log('New offset:', newOffset);
    console.log('Current projects count:', projects.length);
    console.log('Has more before:', hasMore);
    console.log('=======================');
    
    setOffset(newOffset);
    fetchProjects(activeTab, false, newOffset).then(() => {
      // Restore scroll position after loading
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 100);
    });
  }

  // projectsArray is now just projects
  const projectsArray = projects || [];

  // Debug logging
  React.useEffect(() => {
    console.log('=== TAB SWITCH DEBUG ===');
    console.log('Active tab:', activeTab);
    console.log('Projects response:', projects);
    console.log('Projects array:', projectsArray.length, 'items');
    console.log('Detailed count:', detailedCount);
    console.log('Map count:', mapCount);
    console.log('Sample project types:', projectsArray.slice(0, 3).map(p => ({id: p.id, type: p.type, title: p.title?.substring(0, 50)})));
    console.log('========================');
  }, [activeTab, projects, projectsArray.length, detailedCount, mapCount]);

  // Filter projects based on search and filters (no need to filter by type since we already fetch by type)
  const filteredProjects = projectsArray.filter(project => {
    if (!project) return false
    
    const title = project.title || ''
    const description = project.description || ''
    const status = project.status || ''
    const sector = project.sector || project.category || ''
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || status === filterStatus
    const matchesSector = filterSector === 'All' || sector === filterSector
    
    return matchesSearch && matchesStatus && matchesSector
  })
    console.log('Filter sector:', filterSector);
  const uniqueStatuses = [...new Set(projectsArray.map(p => p?.status).filter(Boolean))]
  const uniqueSectors = [...new Set(projectsArray.map(p => p?.sector || p?.category).filter(Boolean))]

  const handleDelete = async (projectId) => {
    console.log('Delete button clicked for project:', projectId)
    
    if (!window.confirm('Are you sure you want to delete this project?')) {
      console.log('Delete cancelled by user')
      return
    }
    
    console.log('Attempting to delete project:', projectId)
    setDeleteLoading(projectId)
    
    try {
      console.log('Calling projectsApi.delete...')
      const result = await projectsApi.delete(projectId)
      console.log('Delete result:', result)
      
      console.log('Refreshing data...')
      // Refresh the current tab's projects
      fetchProjects(activeTab, true);
      console.log('Project deleted successfully')
    } catch (error) {
      console.error('Delete failed:', error)
      alert(`Failed to delete project: ${error.message}`)
    } finally {
      setDeleteLoading(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'ongoing': return 'bg-blue-100 text-blue-800'
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTabCount = (tab) => {
    if (tab === 'detailed') {
      return detailedCount
    }
    if (tab === 'map') {
      return mapCount
    }
    return 0
  }

  const truncateText = (text, limit) => {
    if (!text) return ''
    if (text.length <= limit) return text
    return text.substring(0, limit) + '...'
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error loading projects: {error.message}
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Projects Management">
      <div ref={scrollRef} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-gray-600">Manage and monitor all FEED projects - detailed and map-based projects</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button
              onClick={() => router.push('/admin/projects/add-map')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Layers className="w-4 h-4 mr-2" />
              Add Map Project
            </button>
            <button
              onClick={() => router.push('/admin/projects/add')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </button>
          </div>
        </div>

        {/* Project Type Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('detailed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'detailed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Detailed Projects ({getTabCount('detailed')})
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'map'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Map Projects ({getTabCount('map')})
            </button>
          </nav>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
          >
            <option value="All">All Sectors</option>
            {uniqueSectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>

          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No projects found</div>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'All' || filterSector !== 'All' 
                ? 'Try adjusting your search terms or filters' 
                : 'Get started by adding your first project'
              }
            </p>
            {!searchTerm && filterStatus === 'All' && filterSector === 'All' && (
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => router.push('/admin/projects/add')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Detailed Project
                </button>
                <button
                  onClick={() => router.push('/admin/projects/add-map')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Add Map Project
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                {/* Project Image */}
                <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  <img
                    src={project.image || project.images?.[0] || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop'}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop'
                    }}
                  />
                  {project.featured && (
                    <div className="absolute top-3 left-3">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status || 'Draft'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.type === 'map' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      {project.type === 'map' ? 'Map Project' : 'Detailed Project'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {truncateText(project.description, 120)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2 mb-4 text-sm text-gray-500">
                    {project.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{project.location}</span>
                      </div>
                    )}
                    {project.startDate && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                      </div>
                    )}
                    {project.budget && (
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>{project.budget}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>ID: {project.id}</span>
                    <span>Updated: {formatDate(project.updatedAt || project.createdAt)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/admin/projects/view/${project.slug || project.id}`)}
                        className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/admin/projects/${project.slug || project.id}/edit`)}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleteLoading === project.id}
                      className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      {deleteLoading === project.id ? (
                        <div className="w-4 h-4 animate-spin border-2 border-red-600 border-t-transparent rounded-full mr-1" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && projectsArray.length > 0 && (
          <div className="flex justify-center my-6">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full mr-2" />
                  Loading...
                </div>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{projectsArray.length}</div>
              <div className="text-sm text-gray-500">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {projectsArray.filter(p => p.type === 'map').length}
              </div>
              <div className="text-sm text-gray-500">Map Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {projectsArray.filter(p => p.type !== 'map').length}
              </div>
              <div className="text-sm text-gray-500">Detailed Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {projectsArray.filter(p => p.featured).length}
              </div>
              <div className="text-sm text-gray-500">Featured</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
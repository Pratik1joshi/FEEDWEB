"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Plus, Eye, Edit, Trash2, Mail, Phone, Settings } from 'lucide-react'
import { teamApi } from '@/src/lib/api-team'
import AdminLayout from '@/components/AdminLayout'

export default function TeamManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load team members
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await teamApi.getAll({ limit: 100 })
        
        if (response.success && response.data) {
          setTeamMembers(response.data)
        } else if (Array.isArray(response)) {
          // Handle direct array response
          setTeamMembers(response)
        } else {
          throw new Error('Failed to load team members')
        }
      } catch (err) {
        console.error('Error loading team members:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadTeamMembers()
  }, [])

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.department && member.department.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = selectedRole === '' || member.position.toLowerCase().includes(selectedRole.toLowerCase())
    const matchesDepartment = selectedDepartment === '' || member.department === selectedDepartment

    return matchesSearch && matchesRole && matchesDepartment
  })

  // Get unique roles and departments for filters
  const roles = [...new Set(teamMembers.map(member => member.position).filter(Boolean))]
  const departments = [...new Set(teamMembers.map(member => member.department).filter(Boolean))]

  const handleDelete = async (memberId, memberName) => {
    if (window.confirm(`Are you sure you want to delete ${memberName}? This action cannot be undone.`)) {
      try {
        const response = await teamApi.delete(memberId)
        
        if (response.success || response.message) {
          setTeamMembers(prev => prev.filter(member => member.id !== memberId))
          alert('Team member deleted successfully!')
        } else {
          throw new Error('Delete failed')
        }
      } catch (err) {
        console.error('Error deleting team member:', err)
        alert('Failed to delete team member: ' + err.message)
      }
    }
  }

  return (
    <AdminLayout title="Team Management">
      {/* Action Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-600">Manage team members and their information</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/team/settings"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Team Settings
          </Link>
          <Link
            href="/admin/team/add"
            className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A365D]"></div>
          <span className="ml-3 text-gray-600">Loading team members...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error loading team members</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Content - only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Filters */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent min-w-[150px]"
                >
                  <option value="">All Roles</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div className="relative">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent min-w-[150px]"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredMembers.length} of {teamMembers.length} team members
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {/* Member Photo */}
                <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Remove the broken image and show initials instead
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  
                  {/* Always show initials as fallback */}
                  <div className="w-full h-full bg-gradient-to-br from-[#1A365D] to-[#2D5A87] flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                    <p className="text-[#1A365D] font-medium">{member.position}</p>
                    <p className="text-gray-600 text-sm">{member.department}</p>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-2 mb-4">
                    {member.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    {member.linkedin && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>LinkedIn</span>
                      </div>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{member.years_experience || 0}</span> years of experience
                    </p>
                  </div>

                  {/* Expertise Tags */}
                  {member.expertise && Array.isArray(member.expertise) && member.expertise.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.expertise.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                            +{member.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/team/view/${member.id}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      href={`/admin/team/edit/${member.id}`}
                      className="flex-1 px-3 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(member.id, member.name)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedRole || selectedDepartment
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first team member'}
              </p>
              <Link
                href="/admin/team/add"
                className="inline-flex items-center px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Link>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  )
}

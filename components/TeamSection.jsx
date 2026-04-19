"use client"

import { useState, useEffect } from 'react'
import { teamApi } from '@/lib/api-services'
import { Mail, Linkedin, Award, Users, MapPin, ExternalLink } from 'lucide-react'
import RichContentRenderer from './RichContentRenderer'
import Link from 'next/link'

export default function TeamSection({ 
  title = "Our Team", 
  subtitle = "Meet the dedicated professionals working to create a sustainable future",
  showAll = false,
  department = null,
  limit = 8,
  layout = "grid" // "grid" or "detailed"
}) {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let response
        if (department) {
          response = await teamApi.getByDepartment(department, { limit: showAll ? 100 : limit })
        } else {
          response = await teamApi.getAll({ 
            is_active: true, 
            limit: showAll ? 100 : limit,
            sortBy: 'sort_order',
            sortOrder: 'ASC' 
          })
        }
        
        if (response.success && response.data) {
          setTeamMembers(response.data)
        } else if (Array.isArray(response)) {
          setTeamMembers(response)
        } else {
          console.warn('Unexpected API response format:', response)
          setTeamMembers([])
        }
      } catch (err) {
        console.error('Error fetching team data:', err)
        setError(err.message)
        setTeamMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [department, limit, showAll])

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-bold text-[#0396FF] mb-6">{title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0396FF]"></div>
            <span className="ml-3 text-gray-600">Loading team members...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-bold text-[#0396FF] mb-6">{title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
            <p className="font-medium">Unable to load team members</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (teamMembers.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-bold text-[#0396FF] mb-6">{title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          </div>
          <div className="text-center py-16">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-3">No team members found</h3>
            <p className="text-gray-600 text-lg">Check back soon for team information.</p>
          </div>
        </div>
      </section>
    )
  }

  // Helper function to get initials
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  // Helper function to parse array fields from JSON strings
  const parseArrayField = (field) => {
    if (Array.isArray(field)) return field
    if (typeof field === 'string') {
      try {
        return JSON.parse(field)
      } catch {
        return []
      }
    }
    return []
  }

  // Render different layouts
  if (layout === "detailed") {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif font-bold text-[#0396FF] mb-6">{title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          </div>
          
          <div className="space-y-16">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <div className="md:flex">
                  {/* Photo */}
                  <div className="md:w-1/3 h-80 md:h-auto relative">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-gradient-to-br from-[#0396FF] to-[#1A365D] flex items-center justify-center text-white text-4xl font-bold">
                      {getInitials(member.name)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="md:w-2/3 p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-serif font-bold text-[#0396FF] mb-2">{member.name}</h3>
                      <p className="text-xl text-[#1A365D] font-medium mb-1">{member.position}</p>
                      <p className="text-gray-600">{member.department}</p>
                    </div>

                    {/* Bio */}
                    {member.bio && (
                      <div className="mb-6">
                        <RichContentRenderer 
                          content={member.bio}
                          maxHeight="150px"
                          showExpandButton={true}
                        />
                      </div>
                    )}

                    {/* Experience & Publications */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {member.years_experience > 0 && (
                        <div className="flex items-center text-gray-600">
                          <Award className="w-4 h-4 mr-2" />
                          <span>{member.years_experience} years experience</span>
                        </div>
                      )}
                      {member.publications > 0 && (
                        <div className="flex items-center text-gray-600">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          <span>{member.publications} publications</span>
                        </div>
                      )}
                    </div>

                    {/* Expertise */}
                    {member.expertise && parseArrayField(member.expertise).length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {parseArrayField(member.expertise).slice(0, 6).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact */}
                    <div className="flex items-center space-x-4">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center text-[#0396FF] hover:text-[#1A365D] transition-colors"
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          <span className="text-sm">Email</span>
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-[#0396FF] hover:text-[#1A365D] transition-colors"
                        >
                          <Linkedin className="w-4 h-4 mr-1" />
                          <span className="text-sm">LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Grid layout (default)
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {teamMembers.map((member) => (
            <Link
              key={member.id}
              href={`/about/team/${member.slug || member.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
            >
              {/* Photo */}
              <div className="relative h-56 sm:h-64 overflow-hidden">
                {member.image_url ? (
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-gradient-to-br from-[#0396FF] to-[#1A365D] flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                  {getInitials(member.name)}
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Content */}
              <div className="p-5 sm:p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1A365D] mb-1 line-clamp-2">{member.name}</h3>
                  <p className="text-[#0396FF] font-semibold text-sm sm:text-base mb-1 line-clamp-1">{member.position}</p>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-1">{member.department}</p>
                </div>
                
                {/* Bio preview */}
                {member.bio && (
                  <div className="text-gray-600 text-sm mb-4 text-center">
                    <RichContentRenderer 
                      content={member.bio}
                      maxHeight="40px"
                      className="line-clamp-2"
                    />
                  </div>
                )}

                {/* Experience */}
                {member.years_experience > 0 && (
                  <div className="flex items-center justify-center text-xs text-gray-500 mb-3 bg-gray-50 rounded-full px-3 py-1">
                    <Award className="w-3 h-3 mr-1" />
                    {member.years_experience} years experience
                  </div>
                )}

                {/* Expertise Tags */}
                {member.expertise && parseArrayField(member.expertise).length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {parseArrayField(member.expertise).slice(0, 2).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {parseArrayField(member.expertise).length > 2 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                          +{parseArrayField(member.expertise).length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Icons */}
                <div className="flex items-center justify-center space-x-3 pt-2">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#0396FF] hover:text-white transition-all duration-300 hover:scale-110 group/icon"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all duration-300 hover:scale-110 group/icon"
                      title="View LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {!member.email && !member.linkedin && (
                    <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        {!showAll && teamMembers.length >= limit && (
          <div className="text-center mt-12">
            <Link
              href="/about/team"
              className="inline-flex items-center bg-gradient-to-r from-[#0396FF] to-blue-600 text-white px-8 py-4 rounded-full hover:from-[#1A365D] hover:to-blue-800 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Meet Our Full Team
              <ExternalLink className="ml-2 w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

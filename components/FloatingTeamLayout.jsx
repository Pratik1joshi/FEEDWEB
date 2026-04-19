"use client"

import { useState, useEffect, useRef } from 'react'
import { teamApi } from '@/lib/api-services'
import Link from 'next/link'
import { Users, Sparkles } from 'lucide-react'

export default function FloatingTeamLayout() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredMember, setHoveredMember] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await teamApi.getAll({ 
          is_active: true, 
          limit: 20,
          sortBy: 'sort_order',
          sortOrder: 'ASC' 
        })
        
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
  }, [])

  // Helper function to get initials
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'TM'
  }

  // Generate random positions for team members
  const generateRandomPositions = (count) => {
    const positions = []
    const usedPositions = new Set()
    
    for (let i = 0; i < count; i++) {
      let x, y, positionKey
      let attempts = 0
      
      do {
        x = Math.random() * 85 // Leave some margin
        y = Math.random() * 85 // Leave some margin
        positionKey = `${Math.round(x/10)}-${Math.round(y/10)}` // Grid-based collision detection
        attempts++
      } while (usedPositions.has(positionKey) && attempts < 50)
      
      usedPositions.add(positionKey)
      positions.push({ x, y })
    }
    
    return positions
  }

  const positions = generateRandomPositions(teamMembers.length)

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-[#1A365D] mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated professionals working to create a sustainable future
            </p>
          </div>
          <div className="relative min-h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0396FF] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading our amazing team...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || teamMembers.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-[#1A365D] mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated professionals working to create a sustainable future
            </p>
          </div>
          <div className="relative min-h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {error ? 'Unable to load team members' : 'No team members found'}
              </h3>
              <p className="text-gray-600">
                {error || 'Check back soon for team information.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-[#0396FF]/10 text-[#0396FF] px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold">Interactive Team Explorer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A365D] mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Click on any team member to learn more about their expertise and contributions to our mission
          </p>
        </div>

        {/* Floating Team Container */}
        <div 
          ref={containerRef}
          className="relative min-h-[700px] md:min-h-[800px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-[#0396FF] rounded-full blur-3xl"></div>
            <div className="absolute top-32 right-20 w-24 h-24 bg-purple-400 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-32 w-28 h-28 bg-green-400 rounded-full blur-2xl"></div>
            <div className="absolute bottom-32 right-16 w-36 h-36 bg-pink-400 rounded-full blur-3xl"></div>
          </div>

          {/* Team Members */}
          {teamMembers.map((member, index) => {
            const position = positions[index] || { x: 50, y: 50 }
            const isHovered = hoveredMember === member.id
            
            return (
              <Link
                key={member.id}
                href={`/about/team/${member.slug || member.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-110 hover:z-50 group"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  animationDelay: `${index * 0.1}s`,
                }}
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="relative">
                  {/* Main Photo */}
                  <div className={`
                    relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden
                    shadow-lg group-hover:shadow-2xl transition-all duration-500
                    ring-4 ring-white group-hover:ring-[#0396FF] group-hover:ring-6
                    ${isHovered ? 'scale-125 z-50' : ''}
                  `}>
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
                    <div className="w-full h-full bg-gradient-to-br from-[#0396FF] to-[#1A365D] flex items-center justify-center text-white text-sm md:text-base lg:text-lg font-bold">
                      {getInitials(member.name)}
                    </div>
                  </div>

                  {/* Hover Info Card */}
                  {isHovered && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-50 animate-fadeIn">
                      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 min-w-[250px] max-w-[300px]">
                        {/* Arrow */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
                        
                        {/* Content */}
                        <div className="text-center">
                          <h3 className="font-serif font-bold text-[#1A365D] text-lg mb-1">
                            {member.name}
                          </h3>
                          <p className="text-[#0396FF] font-semibold text-sm mb-1">
                            {member.position}
                          </p>
                          <p className="text-gray-600 text-xs mb-3">
                            {member.department}
                          </p>
                          
                          {/* Quick Stats */}
                          <div className="flex justify-center space-x-4 text-xs text-gray-500 mb-3">
                            {member.years_experience > 0 && (
                              <span>{member.years_experience}y exp</span>
                            )}
                            {member.publications > 0 && (
                              <span>{member.publications} pubs</span>
                            )}
                          </div>
                          
                          <div className="text-xs text-[#0396FF] font-medium">
                            Click to view full profile →
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Floating Animation */}
                  <div 
                    className="absolute inset-0 rounded-full bg-[#0396FF]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"
                    style={{
                      animation: `float-${index % 3} 3s ease-in-out infinite`,
                    }}
                  ></div>
                </div>
              </Link>
            )
          })}

          {/* Instructions */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
              <p className="text-sm text-gray-600 font-medium">
                🖱️ Hover over photos to see details • Click to view full profiles
              </p>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-[#0396FF] mb-2">{teamMembers.length}</div>
            <div className="text-gray-600 font-medium">Team Members</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {teamMembers.filter(m => m.years_experience > 0).reduce((sum, m) => sum + m.years_experience, 0)}+
            </div>
            <div className="text-gray-600 font-medium">Years Combined Experience</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {teamMembers.filter(m => m.publications > 0).reduce((sum, m) => sum + m.publications, 0)}
            </div>
            <div className="text-gray-600 font-medium">Publications</div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}

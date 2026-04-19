"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { teamApi } from '@/lib/api-services'
import TeamColumn from './TeamColumn'
import { Users, Sparkles, ArrowDown } from 'lucide-react'

export default function ParallaxTeamLayout() {
  const [teamMembers, setTeamMembers] = useState([] )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await teamApi.getAll({ 
          is_active: true, 
          limit: 50,
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

  // Split team members into columns based on device size
  const createColumns = (members, columnCount = 4) => {
    const columns = Array.from({ length: columnCount }, () => [])
    
    members.forEach((member, index) => {
      const columnIndex = index % columnCount
      columns[columnIndex].push(member)
    })
    
    return columns
  }

  // Determine column count based on screen size (will be handled in CSS grid)
  const teamColumns = createColumns(teamMembers, 4) // Always prepare 4 columns, CSS will handle responsive

  // Define different vertical offsets and speeds for up to 4 columns
  const columnOffsets = [100, -60, 80, -40] // Alternating high/low positions
  const columnSpeeds = [0.2, 0.5, 0.3, 0.6] // Varying speeds for different parallax effects

  if (loading) {
    return (
      <section className="py-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 min-h-screen">
        {/* Header Section with Background */}
        <div className="relative pt-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/photo-1617280137702-32e761be8b26.jpg"
              alt="Team working together"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4 shadow-lg border border-white/30"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="font-semibold text-sm">Meet Our Amazing Team</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4"
              >
                Our Team
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed"
              >
                Meet the dedicated professionals working to create a sustainable future
              </motion.p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0396FF] mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 font-medium">Loading our amazing team...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || teamMembers.length === 0) {
    return (
      <section className="py-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 min-h-screen">
        {/* Header Section with Background */}
        <div className="relative py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/photo-1617280137702-32e761be8b26.jpg"
              alt="Team working together"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4 shadow-lg border border-white/30"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="font-semibold text-sm">Meet Our Amazing Team</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4"
              >
                Our Team
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed"
              >
                Meet the dedicated professionals working to create a sustainable future
              </motion.p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <Users className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {error ? 'Unable to load team members' : 'No team members found'}
            </h3>
            <p className="text-gray-600 text-lg">
              {error || 'Check back soon for team information.'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 min-h-screen overflow-hidden">
      {/* Header Section with Background */}
      <div className="relative pt-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/photo-1617280137702-32e761be8b26.jpg"
            alt="Team working together"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4 shadow-lg border border-white/30"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="font-semibold text-sm">Meet Our Amazing Team</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4"
            >
              Our Team
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Meet the dedicated professionals working to create a sustainable future
            </motion.p>

            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <div className="animate-bounce">
                <ArrowDown className="w-5 h-5 text-white/80" />
              </div>
            </motion.div> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">

        {/* Team Columns with Parallax Effect - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {teamColumns.map((columnMembers, columnIndex) => (
            <div 
              key={columnIndex}
              className={`
                ${columnIndex === 0 ? "md:mt-0" : ""}
                ${columnIndex === 1 ? "md:mt-16" : ""}
                ${columnIndex === 2 ? "lg:mt-8" : ""}
                ${columnIndex === 3 ? "xl:mt-20" : ""}
              `}
            >
              <TeamColumn
                members={columnMembers}
                columnIndex={columnIndex}
                offset={columnOffsets[columnIndex]}
                speed={columnSpeeds[columnIndex]}
              />
            </div>
          ))}
        </div>

        {/* Team Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-32 mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl border border-white/20">
              <div className="text-4xl md:text-5xl font-bold text-[#0396FF] mb-3">
                {teamMembers.length}
              </div>
              <div className="text-gray-700 font-semibold text-lg">Team Members</div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl border border-white/20">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-3">
                {teamMembers.filter(m => m.years_experience > 0).reduce((sum, m) => sum + m.years_experience, 0)}+
              </div>
              <div className="text-gray-700 font-semibold text-lg">Years Experience</div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl border border-white/20">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-3">
                {teamMembers.filter(m => m.publications > 0).reduce((sum, m) => sum + m.publications, 0)}
              </div>
              <div className="text-gray-700 font-semibold text-lg">Publications</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1A365D] mb-4">
              Join Our Mission
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We're always looking for passionate individuals to join our team 
              and help create a more sustainable future.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#0396FF] to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Open Positions
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

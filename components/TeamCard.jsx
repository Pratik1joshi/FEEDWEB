"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Award } from 'lucide-react'

export default function TeamCard({ member, index }) {
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

  // Helper function to get initials
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'TM'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <Link href={`/about/team/${member.slug || member.id}`}>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:scale-[1.02]">
          {/* Profile Image */}
          <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
            {member.image_url ? (
              <img
                src={member.image_url}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            
            {/* Fallback with initials */}
            <div className="w-full h-full bg-gradient-to-br from-[#0396FF] to-[#1A365D] flex items-center justify-center text-white text-4xl md:text-5xl font-bold">
              {getInitials(member.name)}
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[#0396FF] font-semibold text-sm">
                View Profile
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Name and Role */}
            <div className="text-center mb-4">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1A365D] mb-2 line-clamp-2 group-hover:text-[#0396FF] transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-[#0396FF] font-semibold text-base md:text-lg mb-1">
                {member.position}
              </p>
              <p className="text-gray-600 text-sm">
                {member.department}
              </p>
            </div>

            {/* Quick Info */}
            <div className="space-y-2">
              {member.location && (
                <div className="flex items-center justify-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{member.location}</span>
                </div>
              )}
              
              {member.years_experience > 0 && (
                <div className="flex items-center justify-center text-gray-500 text-sm">
                  <Award className="w-4 h-4 mr-2" />
                  <span>{member.years_experience} years experience</span>
                </div>
              )}
            </div>

            {/* Expertise Tags */}
            {member.expertise && parseArrayField(member.expertise).length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {parseArrayField(member.expertise).slice(0, 2).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                  {parseArrayField(member.expertise).length > 2 && (
                    <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                      +{parseArrayField(member.expertise).length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Light blue border effect on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-200 to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl transform scale-105"></div>
        </div>
      </Link>
    </motion.div>
  )
}

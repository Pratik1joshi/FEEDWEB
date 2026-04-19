"use client"

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import { teamApi } from '@/lib/api-services'
import { Mail, Linkedin, Phone, MapPin, Award, Calendar, ExternalLink, ArrowLeft, Users, BookOpen } from 'lucide-react'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import RichContentRenderer from '@/components/RichContentRenderer'
import Link from 'next/link'
import Image from 'next/image'

export default function TeamMemberPage() {
  const params = useParams()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await teamApi.getBySlug(params.slug)
        
        if (response.success && response.data) {
          setMember(response.data)
        } else if (response.data) {
          setMember(response.data)
        } else {
          setError('Team member not found')
        }
      } catch (err) {
        console.error('Error fetching team member:', err)
        setError('Failed to load team member details')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchMemberData()
    }
  }, [params.slug])

  // Helper function to get initials
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'TM'
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

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-6 py-20">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0396FF] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading team member details...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !member) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-6 py-20">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Team Member Not Found</h1>
              <p className="text-gray-600 mb-8">{error || 'The requested team member could not be found.'}</p>
              <Link
                href="/about/team"
                className="inline-flex items-center bg-[#0396FF] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Team
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section with Photo */}
        <section className="relative bg-gradient-to-br from-[#0396FF] to-[#1A365D] text-white">
          <div className="container mx-auto px-6 py-20">
            {/* Back Button */}
            <div className="mb-8">
              <Link
                href="/about/team"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Team
              </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 items-center">
              {/* Photo */}
              <div className="lg:col-span-1">
                <div className="relative w-full max-w-sm mx-auto">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
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
                    <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-white text-6xl font-bold backdrop-blur-sm">
                      {getInitials(member.name)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="lg:col-span-2 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{member.name}</h1>
                <p className="text-2xl md:text-3xl text-blue-200 font-semibold mb-2">{member.position}</p>
                <p className="text-xl text-blue-100 mb-6">{member.department}</p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {member.years_experience > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                      <Award className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                      <div className="text-2xl font-bold">{member.years_experience}</div>
                      <div className="text-sm text-blue-200">Years Experience</div>
                    </div>
                  )}
                  {member.publications > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                      <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                      <div className="text-2xl font-bold">{member.publications}</div>
                      <div className="text-sm text-blue-200">Publications</div>
                    </div>
                  )}
                  {member.location && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                      <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                      <div className="text-lg font-semibold">{member.location}</div>
                      <div className="text-sm text-blue-200">Location</div>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Information */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Biography */}
                {member.bio && (
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-6 flex items-center">
                      <Users className="w-6 h-6 mr-3 text-[#0396FF]" />
                      About {member.name?.split(' ')[0]}
                    </h2>
                    <div className="prose prose-lg max-w-none">
                      <RichContentRenderer content={member.bio} />
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {member.achievements && (
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-6 flex items-center">
                      <Award className="w-6 h-6 mr-3 text-[#0396FF]" />
                      Key Achievements
                    </h2>
                    <div className="prose prose-lg max-w-none">
                      <RichContentRenderer content={member.achievements} />
                    </div>
                  </div>
                )}

                {/* Education */}
                {member.education && (
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-serif font-bold text-[#1A365D] mb-6 flex items-center">
                      <BookOpen className="w-6 h-6 mr-3 text-[#0396FF]" />
                      Education & Qualifications
                    </h2>
                    <div className="prose prose-lg max-w-none">
                      <RichContentRenderer content={member.education} />
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Expertise */}
                {member.expertise && parseArrayField(member.expertise).length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-4">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {parseArrayField(member.expertise).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-800 text-sm font-medium rounded-full border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {member.languages && parseArrayField(member.languages).length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-4">Languages</h3>
                    <div className="space-y-2">
                      {parseArrayField(member.languages).map((language, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-[#0396FF] rounded-full mr-3"></div>
                          <span className="text-gray-700">{language}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Career Timeline */}
                {member.joining_date && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-4">Career Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Calendar className="w-4 h-4 mt-1 mr-3 text-[#0396FF]" />
                        <div>
                          <div className="font-medium text-gray-900">Joined FEED</div>
                          <div className="text-sm text-gray-600">
                            {new Date(member.joining_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long'
                            })}
                          </div>
                        </div>
                      </div>
                      {member.years_experience > 0 && (
                        <div className="flex items-start">
                          <Award className="w-4 h-4 mt-1 mr-3 text-[#0396FF]" />
                          <div>
                            <div className="font-medium text-gray-900">Total Experience</div>
                            <div className="text-sm text-gray-600">{member.years_experience} years</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Contact */}
                <div className="bg-gradient-to-br from-[#0396FF] to-[#1A365D] rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-serif font-bold mb-4">Get in Touch</h3>
                  <p className="text-blue-100 mb-4 text-sm">
                    Have questions or want to collaborate? Feel free to reach out!
                  </p>
                  <div className="space-y-2">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center text-blue-100 hover:text-white transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm">{member.email}</span>
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-100 hover:text-white transition-colors"
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        <span className="text-sm">LinkedIn Profile</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Team Members */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-4">More Team Members</h2>
              <Link
                href="/about/team"
                className="inline-flex items-center bg-[#0396FF] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                View All Team Members
                <ExternalLink className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

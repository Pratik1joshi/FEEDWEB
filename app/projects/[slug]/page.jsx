"use client"

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RichTextDisplay from '@/src/components/RichTextDisplay'
import { MapPin, Calendar, Users, CheckCircle, ArrowRight, BarChart2, Target, Clock, AlertTriangle, Award, ChevronLeft, ChevronRight, PlayCircle, Calendar as CalendarIcon, Zap, Handshake, Lightbulb, Settings, Leaf, Globe, Heart, Tag, Activity, Loader } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useProject, useProjects } from '@/src/hooks/useApi'

export default function ProjectDetailPage({ params }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Fetch project data from API
  const { data: projectResponse, loading: projectLoading, error: projectError } = useProject(params.slug);
  const project = projectResponse?.data;

  // Fetch related projects
  const { data: relatedResponse, loading: relatedLoading } = useProjects({ category: project?.category, limit: 4 });
  const allProjects = relatedResponse?.data || [];
  
  // Filter out current project and limit to 2 related projects
  const relatedProjects = allProjects
    .filter(p => p.slug !== params.slug)
    .slice(0, 2);

  // Loading state
  if (projectLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading project...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (projectError || !project) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Project not found or error loading project</p>
            <Link href="/projects" className="text-blue-600 hover:text-blue-800">
              ← Back to Projects
            </Link>
          </div>
        </div>
      </>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800"
      case "in progress": return "bg-blue-100 text-blue-800"
      case "ongoing": return "bg-blue-100 text-blue-800"
      case "research phase": return "bg-purple-100 text-purple-800"
      case "scaling up": return "bg-orange-100 text-orange-800"
      case "planning": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Image navigation functions
  const nextImage = () => {
    if (project.images && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    }
  }

  const prevImage = () => {
    if (project.images && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
    }
  }

  // Get image source with fallback
  const getImageSrc = (imageArray, index = 0) => {
    if (imageArray && imageArray.length > index) {
      return imageArray[index];
    }
    return '/work1.png'; // Default image
  };

  // Parse timeline if it's a string
  const getTimeline = () => {
    if (!project.timeline) return [];
    if (Array.isArray(project.timeline)) return project.timeline;
    if (typeof project.timeline === 'string') {
      try {
        return JSON.parse(project.timeline);
      } catch {
        return [];
      }
    }
    return [];
  };

  // Parse arrays from project data (in case they're stored as JSON strings)
  const parseArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return [];
  };

  // Parse impact object
  const parseImpact = () => {
    if (!project.impact) return {};
    if (typeof project.impact === 'object' && !Array.isArray(project.impact)) return project.impact;
    if (typeof project.impact === 'string') {
      try {
        return JSON.parse(project.impact);
      } catch {
        return {};
      }
    }
    return {};
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner Section */}
        <section className="relative h-[40vh] min-h-[300px] w-full">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={getImageSrc(project.images)}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
          </div>
          
          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto px-6 pt-16">
            <div className="mb-3">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-4 text-center max-w-4xl">
              {project.title}
            </h1>
            <p className="text-base md:text-lg text-center max-w-3xl opacity-90">
              {project.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{project.duration}</span>
              </div>
              {project.team_size && (
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{project.team_size}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content Section with Image Carousel and Project Info Side by Side */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 py-8">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              
              {/* Image Gallery Section */}
              <div className="space-y-4">
                {/* Main Image Display */}
                <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                  <img
                    src={getImageSrc(project.images, currentImageIndex)}
                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Image Navigation Overlay - only show if more than one image */}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between px-4">
                      <button
                        onClick={prevImage}
                        className="bg-white/80 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="bg-white/80 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* Image Counter - only show if more than one image */}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {project.images.length}
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Thumbnail Gallery - only show if more than one image */}
                {project.images && project.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {project.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'ring-2 ring-[#0396FF] ring-offset-2 opacity-100' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Details Section */}
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center px-3 py-1 bg-[#0396FF] text-white text-sm font-medium rounded-full mb-4">
                    {project.category}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1A365D] mb-4 leading-tight">
                    {project.title}
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center text-[#0396FF] mb-2">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="font-medium text-sm">Location</span>
                    </div>
                    <p className="text-gray-700 font-medium">{project.location}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center text-[#0396FF] mb-2">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span className="font-medium text-sm">Duration</span>
                    </div>
                    <p className="text-gray-700 font-medium">{project.duration}</p>
                  </div>
                  {project.team_size && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center text-[#0396FF] mb-2">
                        <Users className="w-5 h-5 mr-2" />
                        <span className="font-medium text-sm">Team Size</span>
                      </div>
                      <p className="text-gray-700 font-medium">{project.team_size}</p>
                    </div>
                  )}
                  {project.budget && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center text-[#0396FF] mb-2">
                        <BarChart2 className="w-5 h-5 mr-2" />
                        <span className="font-medium text-sm">Budget</span>
                      </div>
                      <p className="text-gray-700 font-medium">{project.budget}</p>
                    </div>
                  )}
                </div>

                {/* Timeline Section - only show if timeline exists */}
                {getTimeline().length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
                    <div className="flex items-center mb-4">
                      <CalendarIcon className="w-5 h-5 text-[#0396FF] mr-2" />
                      <h3 className="text-lg font-serif font-bold text-[#1A365D]">Project Timeline</h3>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {getTimeline().map((milestone, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-3 h-3 bg-[#0396FF] rounded-full mt-2"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <h4 className="text-sm font-medium text-gray-900">{milestone.title}</h4>
                              <span className="text-xs text-gray-500 mt-1 sm:mt-0">{milestone.date}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Client/Partners - only show if client exists */}
                {project.client && (
                  <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-serif font-bold text-[#1A365D] mb-3">Client & Partners</h3>
                    <p className="text-gray-700">{project.client}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-8 text-center">Project Details</h2>
              <RichTextDisplay 
                content={project.fullDescription || project.description} 
                className="text-gray-600"
              />
            </div>
          </div>
        </section>

        {/* Key Metrics - Only show if impact metrics exist */}
        {parseImpact() && Object.keys(parseImpact()).length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-12 text-center">Key Achievements</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {Object.entries(parseImpact()).map(([key, value], index) => (
                  <div key={index} className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="text-3xl md:text-4xl font-bold text-[#0396FF] mb-2">{value}</div>
                    <div className="text-gray-600 font-medium text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Goals & Outcomes Grid - Only show if goals or outcomes exist */}
        {((parseArray(project.objectives).length > 0) || (parseArray(project.outcomes).length > 0)) && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Goals Section */}
                {parseArray(project.objectives).length > 0 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <Target className="w-6 h-6 text-[#0396FF] mr-3" />
                      <h2 className="text-2xl font-serif font-bold text-[#1A365D]">Project Objectives</h2>
                    </div>
                    <div className="space-y-4">
                      {parseArray(project.objectives).map((objective, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex items-start">
                          <CheckCircle className="w-5 h-5 text-[#0396FF] mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{objective}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Outcomes Section */}
                {parseArray(project.outcomes).length > 0 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <Award className="w-6 h-6 text-[#0396FF] mr-3" />
                      <h2 className="text-2xl font-serif font-bold text-[#1A365D]">Project Outcomes</h2>
                    </div>
                    <div className="space-y-4">
                      {parseArray(project.outcomes).map((outcome, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Challenges Addressed - Only show if challenges exist */}
        {parseArray(project.challenges).length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-12">
                  <AlertTriangle className="w-6 h-6 text-[#0396FF] mr-3" />
                  <h2 className="text-3xl font-serif font-bold text-[#1A365D]">Challenges Addressed</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {parseArray(project.challenges).map((challenge, index) => (
                    <div key={index} className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">{challenge}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Technologies Used - Only show if technologies exist */}
        {parseArray(project.technologies).length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-12">
                  <Settings className="w-6 h-6 text-[#0396FF] mr-3" />
                  <h2 className="text-3xl font-serif font-bold text-[#1A365D]">Technologies Used</h2>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {parseArray(project.technologies).map((tech, index) => (
                    <div key={index} className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                      <span className="text-gray-700 font-medium text-sm">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Partners & Collaborations - Only show if partners exist */}
        {project.partners && project.partners.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-12">
                  <Handshake className="w-6 h-6 text-[#0396FF] mr-3" />
                  <h2 className="text-3xl font-serif font-bold text-[#1A365D]">Partners & Collaborations</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {project.partners.map((partner, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
                      <div className="flex items-start">
                        <Handshake className="w-5 h-5 text-[#0396FF] mr-3 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 font-medium">{partner}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Innovations & Features - Only show if innovations exist */}
        {project.innovations && project.innovations.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-12">
                  <Lightbulb className="w-6 h-6 text-[#0396FF] mr-3" />
                  <h2 className="text-3xl font-serif font-bold text-[#1A365D]">Innovations & Key Features</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {project.innovations.map((innovation, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-200">
                      <div className="flex items-start">
                        <Lightbulb className="w-5 h-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">{innovation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Impact & Sustainability - Only show if impact fields exist */}
        {(project.sustainability || project.environmentalImpact || project.socialImpact || 
          (project.impactMetrics && Object.values(project.impactMetrics).some(value => value))) && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center mb-12">
                  <Globe className="w-6 h-6 text-[#0396FF] mr-3" />
                  <h2 className="text-3xl font-serif font-bold text-[#1A365D]">Impact & Sustainability</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {/* Sustainability */}
                  {project.sustainability && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl">
                      <div className="flex items-center mb-4">
                        <Leaf className="w-6 h-6 text-green-600 mr-3" />
                        <h3 className="text-lg font-serif font-bold text-green-800">Sustainability</h3>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{project.sustainability}</p>
                    </div>
                  )}
                  
                  {/* Environmental Impact */}
                  {project.environmentalImpact && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl">
                      <div className="flex items-center mb-4">
                        <Globe className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-lg font-serif font-bold text-blue-800">Environmental Impact</h3>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{project.environmentalImpact}</p>
                    </div>
                  )}
                  
                  {/* Social Impact */}
                  {project.socialImpact && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
                      <div className="flex items-center mb-4">
                        <Heart className="w-6 h-6 text-purple-600 mr-3" />
                        <h3 className="text-lg font-serif font-bold text-purple-800">Social Impact</h3>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{project.socialImpact}</p>
                    </div>
                  )}
                </div>

                {/* Impact Metrics */}
                {project.impactMetrics && Object.values(project.impactMetrics).some(value => value) && (
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-6 text-center">Impact Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {project.impactMetrics.beneficiaries && (
                        <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                          <div className="text-2xl font-bold text-[#0396FF] mb-1">{project.impactMetrics.beneficiaries}</div>
                          <div className="text-gray-600 text-xs">Total Beneficiaries</div>
                        </div>
                      )}
                      {project.impactMetrics.directBeneficiaries && (
                        <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                          <div className="text-2xl font-bold text-green-600 mb-1">{project.impactMetrics.directBeneficiaries}</div>
                          <div className="text-gray-600 text-xs">Direct Beneficiaries</div>
                        </div>
                      )}
                      {project.impactMetrics.areaKm2 && (
                        <div className="text-center bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-xl">
                          <div className="text-2xl font-bold text-orange-600 mb-1">{project.impactMetrics.areaKm2}</div>
                          <div className="text-gray-600 text-xs">Area (km²)</div>
                        </div>
                      )}
                      {project.impactMetrics.co2Reduction && (
                        <div className="text-center bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-xl">
                          <div className="text-2xl font-bold text-teal-600 mb-1">{project.impactMetrics.co2Reduction}</div>
                          <div className="text-gray-600 text-xs">CO₂ Reduction</div>
                        </div>
                      )}
                      {project.impactMetrics.energyGenerated && (
                        <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl">
                          <div className="text-2xl font-bold text-yellow-600 mb-1">{project.impactMetrics.energyGenerated}</div>
                          <div className="text-gray-600 text-xs">Energy Generated</div>
                        </div>
                      )}
                      {project.impactMetrics.communitiesServed && (
                        <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                          <div className="text-2xl font-bold text-purple-600 mb-1">{project.impactMetrics.communitiesServed}</div>
                          <div className="text-gray-600 text-xs">Communities Served</div>
                        </div>
                      )}
                      {project.impactMetrics.jobsCreated && (
                        <div className="text-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl">
                          <div className="text-2xl font-bold text-indigo-600 mb-1">{project.impactMetrics.jobsCreated}</div>
                          <div className="text-gray-600 text-xs">Jobs Created</div>
                        </div>
                      )}
                      {project.impactMetrics.capacityBuilt && (
                        <div className="text-center bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl">
                          <div className="text-2xl font-bold text-red-600 mb-1">{project.impactMetrics.capacityBuilt}</div>
                          <div className="text-gray-600 text-xs">Capacity Built</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Project Tags - Only show if tags exist */}
        {parseArray(project.tags).length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-12">
                  <Tag className="w-6 h-6 text-[#0396FF] mr-3" />
                  <h2 className="text-3xl font-serif font-bold text-[#1A365D]">Project Tags</h2>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {parseArray(project.tags).map((tag, index) => (
                    <div key={index} className="bg-gradient-to-r from-[#0396FF] to-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
                      <span className="font-medium text-sm">#{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-12 text-center">Related Projects</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {relatedProjects.map((relatedProject, index) => (
                  <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={getImageSrc(relatedProject.images)}
                        alt={relatedProject.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(relatedProject.status)}`}>
                          {relatedProject.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3">{relatedProject.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{relatedProject.description}</p>
                      <Link 
                        href={`/projects/${relatedProject.slug}`}
                        className="inline-flex items-center text-[#0396FF] font-medium hover:text-[#0396FF]/80 transition-colors duration-300"
                      >
                        Explore Project <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-[#0396FF] to-blue-600">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl font-serif font-bold mb-6">Ready to Start Your Next Project?</h2>
              <p className="text-xl opacity-90 mb-8">
                Contact us to learn how we can develop customized sustainable solutions for your organization's unique challenges.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/contact" 
                  className="bg-white text-[#0396FF] px-8 py-3 rounded-full hover:bg-gray-50 transition-all duration-300 font-medium inline-flex items-center"
                >
                  Contact Our Team
                </Link>
                <Link 
                  href="/projects" 
                  className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-[#0396FF] transition-all duration-300 font-medium inline-flex items-center"
                >
                  Explore All Projects
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

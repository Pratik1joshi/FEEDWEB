"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { pagesApi, projectsApi } from '@/lib/api-services'
import Link from 'next/link'

const DEFAULT_PROJECTS_SECTION_META = {
  header: {
    badgeText: "Portfolio Showcase",
    title: "Latest Projects",
    subtitle:
      "Explore our latest innovative solutions across environmental and energy sectors, showcasing our commitment to sustainable development and technical excellence.",
    ctaText: "See All Projects",
    ctaLink: "/projects",
  },
  messages: {
    loading: "Loading our latest projects...",
    empty: "No projects available at the moment.",
    error: "Failed to load projects. Please try again later.",
  },
}

const cloneObject = (value) => JSON.parse(JSON.stringify(value))

const normalizeProjectsSectionMeta = (rawMeta) => {
  const defaults = cloneObject(DEFAULT_PROJECTS_SECTION_META)
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {}

  return {
    ...defaults,
    ...meta,
    header: {
      ...defaults.header,
      ...(meta.header || {}),
    },
    messages: {
      ...defaults.messages,
      ...(meta.messages || {}),
    },
  }
}

export default function ProjectCarousel() {
  const [currentProject, setCurrentProject] = useState(0)
  const [currentImage, setCurrentImage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [projects, setProjects] = useState([])
  const [sectionMeta, setSectionMeta] = useState(cloneObject(DEFAULT_PROJECTS_SECTION_META))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const imageIntervalRef = useRef(null)
  const projectIntervalRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const fetchLatestProjects = async () => {
      try {
        const response = await projectsApi.getAll({ type: 'detailed', limit: 4, sort: 'createdAt', order: 'desc' })
        if (!isMounted) return

        if (response.success) {
          setProjects(response.data || [])
        } else {
          setError(DEFAULT_PROJECTS_SECTION_META.messages.error)
        }
      } catch (err) {
        if (!isMounted) return
        setError(DEFAULT_PROJECTS_SECTION_META.messages.error)
        console.error('Error fetching projects:', err)
      }
    }

    const fetchSectionMeta = async () => {
      try {
        const response = await pagesApi.getBySlug("projects-section")
        if (!isMounted) return

        if (response.success && response.data) {
          setSectionMeta(normalizeProjectsSectionMeta(response.data.meta_data))
        }
      } catch (err) {
        if (`${err?.message || ""}`.toLowerCase().includes("page not found")) {
          return
        }
        console.warn("Failed to load projects-section meta, using defaults", err)
      }
    }

    const fetchAll = async () => {
      setLoading(true)
      await Promise.all([fetchLatestProjects(), fetchSectionMeta()])
      if (isMounted) {
        setLoading(false)
      }
    }

    fetchAll()

    return () => {
      isMounted = false
    }
  }, [])

  // Clear timers function
  const clearTimers = () => {
    if (imageIntervalRef.current) {
      clearInterval(imageIntervalRef.current)
      imageIntervalRef.current = null
    }
    if (projectIntervalRef.current) {
      clearInterval(projectIntervalRef.current)
      projectIntervalRef.current = null
    }
  }

  // Setup auto-progression timers
  const setupTimers = () => {
    clearTimers()

    // Only setup timers if we have projects
    if (projects.length === 0) return;

    // Image changes every 4 seconds
    imageIntervalRef.current = setInterval(() => {
      if (!isAnimating) {
        setCurrentImage((prev) => (prev === 0 ? 1 : 0))
      }
    }, 4000)

    // Project changes every 8 seconds
    projectIntervalRef.current = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true)
        setTimeout(() => {
          setCurrentProject((prev) => (prev + 1) % projects.length)
          setCurrentImage(0) // Reset to first image when project changes
          setIsAnimating(false)
        }, 500)
      }
    }, 8000)
  }

  // Initialize timers
  useEffect(() => {
    if (projects.length > 0) {
      setupTimers()
    }
    
    return () => {
      clearTimers()
    }
  }, [isAnimating, projects.length])

  // Navigation functions
  const nextProject = () => {
    if (isAnimating || projects.length === 0) return
    setIsAnimating(true)
    
    setTimeout(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length)
      setCurrentImage(0)
      setIsAnimating(false)
      setupTimers() // Reset timers after manual navigation
    }, 500)
  }

  const prevProject = () => {
    if (isAnimating || projects.length === 0) return
    setIsAnimating(true)
    
    setTimeout(() => {
      setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length)
      setCurrentImage(0)
      setIsAnimating(false)
      setupTimers() // Reset timers after manual navigation
    }, 500)
  }

  const goToProject = (targetIndex) => {
    if (isAnimating || targetIndex === currentProject || projects.length === 0) return
    
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentProject(targetIndex)
      setCurrentImage(0)
      setIsAnimating(false)
      setupTimers() // Reset timers after manual navigation
    }, 500)
  }

  // Loading state
  if (loading) {
    return (
      <section className="py-14 md:py-16 bg-gray-100 px-4 md:px-12 relative overflow-hidden">
        <div className="container mx-auto px-3 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-[#00966a] text-white text-base font-medium px-6 py-3 rounded-full mb-6">
              {sectionMeta.header.badgeText}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0396FF] mb-6">
              {sectionMeta.header.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
              {sectionMeta.messages.loading}
            </p>
          </div>
          <div className="min-h-[400px] flex items-center justify-center bg-white rounded-2xl shadow-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0396FF] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-14 md:py-16 bg-gray-100 px-4 md:px-12 relative overflow-hidden">
        <div className="container mx-auto px-3 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-red-500 text-white text-base font-medium px-6 py-3 rounded-full mb-6">
              Error
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0396FF] mb-6">
              {sectionMeta.header.title}
            </h2>
            <p className="text-red-600 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
              {sectionMeta.messages.error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // No projects available
  if (!projects.length) {
    return (
      <section className="py-14 md:py-16 bg-gray-100 px-4 md:px-12 relative overflow-hidden">
        <div className="container mx-auto px-3 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-[#00966a] text-white text-base font-medium px-6 py-3 rounded-full mb-6">
              {sectionMeta.header.badgeText}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0396FF] mb-6">
              {sectionMeta.header.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
              {sectionMeta.messages.empty}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 md:py-16 bg-gray-100 px-4 md:px-12 relative overflow-hidden">
      <div className="container mx-auto px-3 md:px-6">
        {/* Section Heading */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">
            <div className="text-left">
              <div className="inline-block bg-[#00966a] text-white text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-3 shadow-sm">
                {sectionMeta.header.badgeText}
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF]">
                {sectionMeta.header.title}
              </h2>
            </div>
            {sectionMeta.header.ctaText && (
              <Link
                href={sectionMeta.header.ctaLink || "/projects"}
                className="inline-flex items-center gap-2 bg-[#0396FF] text-white px-6 py-2.5 rounded-lg hover:bg-[#1f7fd8] transition-all duration-300 font-semibold text-sm w-fit shrink-0"
              >
                {sectionMeta.header.ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          <p className="text-gray-600 max-w-3xl leading-relaxed text-sm md:text-base text-left mt-4">
            {sectionMeta.header.subtitle}
          </p>
        </div>
        
        {/* Main Canvas - Responsive Layout */}
        <div className="min-h-[500px] md:min-h-[440px] max-h-[75vh] flex flex-col md:flex-row overflow-hidden bg-gray-100">
          
          {/* Image Section - Top on mobile, Right on desktop */}
          <div className="w-full md:w-[58%] md:order-2 relative overflow-hidden bg-black min-h-[220px] md:min-h-0">
            {/* Main Image Display */}
            <div 
               className="relative w-full h-full transition-all duration-500 ease-in-out"
               style={{
                 opacity: isAnimating ? 0 : 1,
                 transform: isAnimating ? 'scale(1.02)' : 'scale(1)'
               }}
            >
              {/* First Image */}
              <img
                src={projects[currentProject]?.images?.[0] || '/work1.png'}
                alt={`${projects[currentProject]?.title} - View 1`}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out"
                style={{
                  opacity: currentImage === 0 ? 1 : 0,
                  transform: currentImage === 0 ? 'scale(1) rotate(0deg)' : 'scale(1.05) rotate(0.5deg)',
                  filter: currentImage === 0 ? 'brightness(1) saturate(1.1)' : 'brightness(0.8) saturate(0.9)'
                }}
              />
              
              {/* Second Image */}
              <img
                src={projects[currentProject]?.images?.[1] || '/work2.png'}
                alt={`${projects[currentProject]?.title} - View 2`}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out"
                style={{
                  opacity: currentImage === 1 ? 1 : 0,
                  transform: currentImage === 1 ? 'scale(1) rotate(0deg)' : 'scale(1.05) rotate(-0.5deg)',
                  filter: currentImage === 1 ? 'brightness(1) saturate(1.1)' : 'brightness(0.8) saturate(0.9)'
                }}
              />

              {/* Gradient Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
            </div>

            {/* Image Controls and Status */}
            <div className="absolute top-3 md:top-6 right-3 md:right-6 flex flex-col space-y-2 md:space-y-4 z-30">
              {/* Image Toggle Button */}
              <button
                onClick={() => {
                  if (!isAnimating) {
                    setCurrentImage(prev => prev === 0 ? 1 : 0)
                  }
                }}
                disabled={isAnimating}
                className="bg-white/90 backdrop-blur-md text-[#1A365D] px-2 md:px-4 py-1 md:py-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 z-30 disabled:opacity-50 text-xs md:text-sm font-medium hover:scale-105 border border-gray-200"
              >
                <span className="hidden md:inline">{currentImage === 0 ? "Implementation View" : "Overview"}</span>
                <span className="md:hidden">{currentImage === 0 ? "Impl." : "Overview"}</span>
              </button>

              {/* Image Indicators */}
              <div className="flex space-x-2">
                {projects[currentProject]?.images?.slice(0, 2).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isAnimating) {
                        setCurrentImage(idx)
                      }
                    }}
                    disabled={isAnimating}
                    className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all duration-500 ${
                      idx === currentImage 
                        ? 'bg-[#0396FF] scale-150 shadow-lg' 
                        : 'bg-white/70 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Image Status */}
            <div className="absolute bottom-3 md:bottom-6 left-3 md:left-6 bg-white/90 backdrop-blur-md px-2 md:px-4 py-1 md:py-2 rounded-full z-30 border border-gray-200 shadow-lg">
              <span className="text-[#1A365D] font-medium text-xs md:text-sm">
                <span className="hidden md:inline">{currentImage === 0 ? "Project Overview" : "Implementation Details"}</span>
                <span className="md:hidden">{currentImage === 0 ? "Overview" : "Details"}</span>
              </span>
            </div>

            {/* Project Counter */}
            <div className="absolute bottom-3 md:bottom-6 right-3 md:right-6 bg-white/90 backdrop-blur-md px-2 md:px-4 py-1 md:py-2 rounded-full z-30 border border-gray-200 shadow-lg">
              <span className="text-[#1A365D] font-medium text-xs md:text-sm">
                {String(currentProject + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
            </div>

            {/* Full-screen Image Transition Effect */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out"
              style={{
                background: `linear-gradient(45deg, rgba(3, 150, 255, 0.1), transparent 50%)`,
                opacity: isAnimating ? 0.3 : 0
              }}
            ></div>
          </div>

          {/* Project Details - Bottom on mobile, Left on desktop */}
          <ProjectDetails
            key={currentProject}
            project={projects[currentProject]}
            currentProject={currentProject}
            totalProjects={projects.length}
            isAnimating={isAnimating}
            onPrev={prevProject}
            onNext={nextProject}
            onGoToProject={goToProject}
          />
          </div>
        </div>
    </section>
  )
}

function ProjectDetails({
  project,
  currentProject,
  totalProjects,
  isAnimating,
  onPrev,
  onNext,
  onGoToProject,
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(true)
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="w-full md:w-[42%] md:order-1 bg-gray-100 relative flex flex-col justify-center p-4 md:p-6 z-10 overflow-y-auto">
      {/* Project Details */}
      <div 
        className="space-y-3 md:space-y-4 py-2 md:py-4 transition-all duration-500 ease-in-out"
        style={{
          opacity: (!isAnimating && isVisible) ? 1 : 0,
          transform: (!isAnimating && isVisible) ? 'translateY(0)' : 'translateY(10px)'
        }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 md:mb-4 gap-2">
          <div
            className="inline-flex items-center px-2 md:px-3 py-1 bg-[#0396FF] text-white text-xs font-bold rounded-full w-fit"
          >
            {project?.category}
          </div>
          <div
            className="inline-flex items-center px-2 md:px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full w-fit"
          >
            {project?.status}
          </div>
        </div>

        <h3
          className="text-lg md:text-xl lg:text-2xl font-serif font-bold text-[#1A365D] leading-tight"
        >
          {project?.title}
        </h3>

        <p
          className="text-gray-700 leading-relaxed text-sm md:text-sm"
        >
          {project?.description || project?.excerpt}
        </p>

        <div
          className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-full px-3 py-2 shadow-md w-fit"
        >
          <div className="w-2 h-2 bg-[#0396FF] rounded-full animate-pulse shadow-lg"></div>
          <span className="text-[#1A365D] font-medium text-xs md:text-xs">{project?.location}</span>
        </div>

        <div className="pt-2 md:pt-3">
          <a 
            href={`/projects/${project?.slug}`}
            className="bg-gradient-to-r from-[#0396FF] to-blue-600 text-white px-4 md:px-6 py-2 rounded-xl hover:from-[#1A365D] hover:to-blue-800 transform hover:-translate-y-1 transition-all duration-300 font-bold inline-block text-center hover:scale-105 text-xs md:text-sm"
          >
            Explore This Project
          </a>
        </div>

        {/* Project Navigation */}
        <div className="flex justify-center items-center pt-3 md:pt-4">
          <div className="flex space-x-2 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 shadow-lg">
            {Array.from({ length: totalProjects }).map((_, index) => (
              <button
                key={index}
                onClick={() => onGoToProject(index)}
                disabled={isAnimating}
                className={`transition-all duration-500 disabled:opacity-50 ${
                  index === currentProject
                    ? "w-4 md:w-6 h-1 bg-[#0396FF] rounded-full shadow-lg"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400 rounded-full hover:scale-125"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center space-x-3 pt-2 md:pt-3">
          <button
            onClick={onPrev}
            disabled={isAnimating}
            className="w-8 md:w-10 h-8 md:h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#0396FF] hover:bg-[#0396FF] hover:text-white transition-all duration-300 z-40 disabled:opacity-50 hover:scale-110 border border-gray-200"
          >
            <ChevronLeft className="w-3 md:w-4 h-3 md:h-4" />
          </button>
          
          <button
            onClick={onNext}
            disabled={isAnimating}
            className="w-8 md:w-10 h-8 md:h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#0396FF] hover:bg-[#0396FF] hover:text-white transition-all duration-300 z-40 disabled:opacity-50 hover:scale-110 border border-gray-200"
          >
            <ChevronRight className="w-3 md:w-4 h-3 md:h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

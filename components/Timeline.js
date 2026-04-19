import { Flag, Award, Heart, FileText, Building, Globe, Users, Target, MapPin, TrendingUp, Star, Lightbulb, Zap, Leaf, BookOpen } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { timelineApi, pagesApi } from "../lib/api-services"

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Icon mapping for dynamic icon rendering
const iconMap = {
  Flag,
  Award,
  Heart,
  FileText,
  Building,
  Globe,
  Users,
  Target,
  MapPin,
  TrendingUp,
  Star,
  Lightbulb,
  Zap,
  Leaf,
  BookOpen
}

const DEFAULT_TIMELINE_SECTION_META = {
  header: {
    badgeText: "Milestones",
    title: "Our Journey",
    subtitle:
      "Explore the key milestones that have shaped our organization's impact on energy and environmental development.",
  },
  messages: {
    loading: "Loading timeline...",
    empty: "No timeline items available.",
    error: "Unable to load timeline. Please try again later.",
    note: "Drag to explore the timeline",
  },
}

const normalizeTimelineSectionMeta = (rawMeta) => {
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {}
  return {
    ...DEFAULT_TIMELINE_SECTION_META,
    ...meta,
    header: {
      ...DEFAULT_TIMELINE_SECTION_META.header,
      ...(meta.header || {}),
    },
    messages: {
      ...DEFAULT_TIMELINE_SECTION_META.messages,
      ...(meta.messages || {}),
    },
  }
}

export default function Timeline() {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [timelineData, setTimelineData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sectionMeta, setSectionMeta] = useState(DEFAULT_TIMELINE_SECTION_META)
  const timelineRef = useRef(null)
  const timelineLineRef = useRef(null)
  const cardsRef = useRef([])

  const animatedTexts = [
    "25+ Years of Experience",
    "100+ Projects Completed"
  ]

  // Fetch timeline data from API
  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        setError(null)
        const response = await timelineApi.getAll()
        if (response.success) {
          setTimelineData(response.data)
        }
      } catch (error) {
        console.error('Error fetching timeline:', error)
        setError(error?.message || 'Failed to load timeline')
        // Fallback to empty array if API fails
        setTimelineData([])
      } finally {
        setLoading(false)
      }
    }

    fetchTimelineData()
  }, [])

  useEffect(() => {
    let isMounted = true

    const fetchSectionMeta = async () => {
      try {
        const response = await pagesApi.getBySlug("timeline-section")
        if (!isMounted) return

        if (response.success && response.data) {
          setSectionMeta(normalizeTimelineSectionMeta(response.data.meta_data))
        }
      } catch (err) {
        if (`${err?.message || ""}`.toLowerCase().includes("page not found")) {
          return
        }
        console.warn("Failed to load timeline-section metadata, using defaults", err)
      }
    }

    fetchSectionMeta()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !timelineRef.current) return

    // Reset refs array
    cardsRef.current = []
    
    // Initially hide everything completely
    if (timelineLineRef.current) {
      gsap.set(timelineLineRef.current, { 
        scaleX: 0,
        transformOrigin: "left center"
      })
    }
    gsap.set(".timeline-card", {  // Target cards by class
      opacity: 0,
      scale: 0,
      y: (index) => index % 2 === 0 ? -50 : 50
    })
    gsap.set(".timeline-node", {
      scale: 0,
      opacity: 0
    })
    gsap.set(".impact-stat", {
      opacity: 0,
      y: 50
    })

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.current.parentElement,
        start: "top 60%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        markers: false,  // Remove debug markers
      }
    })

    // Animate the line
    tl.to(timelineLineRef.current, {
      scaleX: 1,
      duration: 0.5,
      ease: "power3.out"
    })

    // Animate cards one by one with a more dramatic entrance
    .to(".timeline-card", {  // Target cards by class
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.2,
      ease: "back.out(1.7)",
      clearProps: "all"
    })

    // Add bounce effect to timeline nodes with fade in
    .to(".timeline-node", {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: "back.out(2)",
      clearProps: "all"
    })

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        const triggers = ScrollTrigger.getAll()
        triggers.forEach(trigger => trigger.kill())
      }
    }

  }, [timelineData]) // Add timelineData as dependency

  // Typing animation effect
  useEffect(() => {
    const currentFullText = animatedTexts[currentTextIndex]
    
    if (isTyping) {
      // Typing animation
      if (displayText.length < currentFullText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1))
        }, 100) // Typing speed
        return () => clearTimeout(timeout)
      } else {
        // Finished typing, wait then start erasing
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000) // Display duration
        return () => clearTimeout(timeout)
      }
    } else {
      // Erasing animation
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 50) // Erasing speed
        return () => clearTimeout(timeout)
      } else {
        // Finished erasing, move to next text
        setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length)
        setIsTyping(true)
      }
    }
  }, [displayText, isTyping, currentTextIndex, animatedTexts])

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - timelineRef.current.offsetLeft)
    setScrollLeft(timelineRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !timelineRef.current) return
    e.preventDefault()
    const x = e.pageX - timelineRef.current.offsetLeft
    const walk = (x - startX) * 2
    timelineRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Get timeline items from API data, show all items (not just featured)
  const timelineItems = timelineData.map(item => ({
    ...item,
    // Map string icon name to actual icon component
    iconComponent: iconMap[item.icon] || Flag
  }))

  if (loading) {
    return (
      <section className="py-20 px-8 bg-white">
        <div className="max-w-[90%] mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-500 text-lg">{sectionMeta.messages.loading}</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 px-8 bg-white">
        <div className="max-w-[90%] mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A365D] mb-4">{sectionMeta.header.title}</h2>
            <p className="text-red-600 text-lg">{sectionMeta.messages.error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (timelineItems.length === 0) {
    return (
      <section className="py-20 px-8 bg-white">
        <div className="max-w-[90%] mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A365D] mb-4">{sectionMeta.header.title}</h2>
            <p className="text-gray-500 text-lg">{sectionMeta.messages.empty}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-[90%] mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block bg-[#00966a] text-white text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-4 shadow-sm">
            {sectionMeta.header.badgeText}
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-4">
            {sectionMeta.header.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            {sectionMeta.header.subtitle}
          </p>
          {/* Animated Text Header */}
          {/* <div className="mt-6">
            <div className="inline-block bg-gradient-to-r from-[#0396FF] to-blue-600 text-white px-6 py-3 rounded-full shadow-lg">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5" />
                <span className="text-lg font-bold min-w-[280px] text-left">
                  {displayText}
                  <span className={`inline-block w-0.5 h-5 bg-white ml-1 ${isTyping ? 'animate-pulse' : ''}`}></span>
                </span>
              </div>
            </div>
          </div> */}
        </div>
        
        {/* Timeline Container */}
        <div className="relative h-[750px] min-h-[500px]">
          <div 
            ref={timelineRef}
            className="absolute inset-0 overflow-x-auto cursor-grab select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex flex-col h-full pl-[180px] pr-[200px] min-w-max">
              {/* Timeline Items Container */}
              <div className="flex items-center h-full gap-48 relative">
                {/* Timeline Line - Now part of the scrollable content */}
                <div 
                  ref={timelineLineRef}
                  className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#1A365D]/20 via-[#1A365D] to-[#1A365D]/20"
                  style={{ width: '100%' }}
                ></div>
                {timelineItems.map((item, index) => (
                  <div key={index} className="relative group h-full flex items-center flex-shrink-0">
                    {/* Content Card */}
                    <div 
                      className={`timeline-card absolute left-1/2 transform -translate-x-1/2 w-64 
                        ${index % 2 === 0 ? 'top-[15%]' : 'top-[60%]'} 
                        transition-all duration-300 group-hover:-translate-y-2`}
                    >
                      <div className="bg-white p-4 rounded-xl shadow-xl border-t-4 border-[#B22234] 
                        hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[#B22234] font-bold text-base">{item.year}</span>
                          <item.iconComponent className="w-3 h-3 text-[#1A365D]" />
                        </div>
                        <h3 className="text-base font-serif font-bold text-[#1A365D] mb-4 leading-tight">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
                      </div>
                      {/* Connector Line */}
                      <div className={`absolute left-1/2 transform -translate-x-1/2 w-px bg-gradient-to-b 
                        ${index % 2 === 0 ? 
                          'from-[#1A365D] to-transparent h-20 bottom-0 translate-y-full' : 
                          'from-transparent to-[#1A365D] h-20 -top-20'}`}>
                      </div>
                    </div>

                    {/* Timeline Node */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="timeline-node w-5 h-5 rounded-full bg-[#1A365D] border-4 border-white shadow-lg
                        transform transition-transform duration-300 group-hover:scale-125">
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add a hint for users */}
      <div className="text-center mt-3 text-gray-500 text-xs">
        ← {sectionMeta.messages.note} →
      </div>
    </section>
  )
}

"use client"

import { ArrowRight } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { pagesApi } from "@/lib/api-services"

const DEFAULT_HERO_SECTION_META = {
  video: {
    src: "/hero-video.mp4",
    poster: "",
    overlayBrightness: 0.4,
  },
  header: {
    badgeText: "Forum for Energy and Environment Development",
    title: "An organization committed for sustainable Development in The Himalayas",
  },
  buttons: {
    primaryText: "Know Us More",
    primaryLink: "/about",
    secondaryText: "Our Works",
    secondaryLink: "/projects",
  },
  stats: {
    title: "Up to Now",
    items: [
      "25+ Years of Experience",
      "100+ Projects Completed in Nepal",
      "Helped Thousands of People",
      "Sustainable Development Solutions",
    ],
  },
}

const cloneObject = (value) => JSON.parse(JSON.stringify(value))

const normalizeHeroSectionMeta = (rawMeta) => {
  const defaults = cloneObject(DEFAULT_HERO_SECTION_META)
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {}

  const parsedBrightness = Number(meta.video?.overlayBrightness)
  const overlayBrightness = Number.isFinite(parsedBrightness)
    ? Math.min(1, Math.max(0, parsedBrightness))
    : defaults.video.overlayBrightness

  const statsItemsRaw =
    Array.isArray(meta.stats?.items) && meta.stats.items.length > 0
      ? meta.stats.items
      : defaults.stats.items

  const statsItems = statsItemsRaw
    .map((item) => `${item || ""}`.trim())
    .filter(Boolean)

  return {
    ...defaults,
    ...meta,
    video: {
      ...defaults.video,
      ...(meta.video || {}),
      overlayBrightness,
    },
    header: {
      ...defaults.header,
      ...(meta.header || {}),
    },
    buttons: {
      ...defaults.buttons,
      ...(meta.buttons || {}),
    },
    stats: {
      ...defaults.stats,
      ...(meta.stats || {}),
      items: statsItems.length > 0 ? statsItems : defaults.stats.items,
    },
  }
}

const getVideoMimeType = (src) => {
  const value = `${src || ""}`.toLowerCase()
  if (value.endsWith(".webm")) return "video/webm"
  if (value.endsWith(".mp4")) return "video/mp4"
  return undefined
}

export default function HeroSection() {
  const [heroMeta, setHeroMeta] = useState(cloneObject(DEFAULT_HERO_SECTION_META))
  const [currentStatIndex, setCurrentStatIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  const rotatingStats = useMemo(() => {
    const items = heroMeta.stats?.items
    if (Array.isArray(items) && items.length > 0) {
      return items
    }
    return DEFAULT_HERO_SECTION_META.stats.items
  }, [heroMeta.stats?.items])

  useEffect(() => {
    let isMounted = true

    const fetchHeroMeta = async () => {
      try {
        const response = await pagesApi.getBySlug("hero-section")
        if (!isMounted) return

        if (response.success && response.data) {
          setHeroMeta(normalizeHeroSectionMeta(response.data.meta_data))
        }
      } catch (error) {
        if (`${error?.message || ""}`.toLowerCase().includes("page not found")) {
          return
        }
        console.warn("Failed to load hero-section meta, using defaults", error)
      }
    }

    fetchHeroMeta()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (currentStatIndex >= rotatingStats.length) {
      setCurrentStatIndex(0)
      setDisplayText("")
      setIsTyping(true)
      setIsVisible(true)
    }
  }, [currentStatIndex, rotatingStats.length])

  useEffect(() => {
    const currentFullText = rotatingStats[currentStatIndex] || ""
    if (!currentFullText) return
    
    if (isTyping) {
      // Typing animation
      if (displayText.length < currentFullText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1))
        }, 80) // Typing speed
        return () => clearTimeout(timeout)
      } else {
        // Finished typing, wait then start fade out
        const timeout = setTimeout(() => {
          setIsVisible(false)
          // After fade out, start erasing
          setTimeout(() => {
            setIsTyping(false)
          }, 500) // Fade out duration
        }, 2500) // Display duration
        return () => clearTimeout(timeout)
      }
    } else {
      // Erasing animation
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 40) // Erasing speed
        return () => clearTimeout(timeout)
      } else {
        // Finished erasing, move to next stat
        setCurrentStatIndex((prev) => (prev + 1) % rotatingStats.length)
        setIsTyping(true)
        setIsVisible(true)
      }
    }
  }, [displayText, isTyping, currentStatIndex, rotatingStats, isVisible])

  return (
    <section className="h-[100vh] bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden flex items-center">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroMeta.video.poster || undefined}
          className="w-full h-full object-cover"
          style={{ filter: `brightness(${heroMeta.video.overlayBrightness ?? 0.4})` }}
        >
          <source src={heroMeta.video.src || "/hero-video.mp4"} type={getVideoMimeType(heroMeta.video.src)} />
        </video>
      </div>
      
      <div className="container mx-auto px-12 h-full flex items-center relative">
        {/* Left Side Content */}
        <div className="space-y-6">
          <div className="inline-block bg-[#0396FF] text-white text-sm font-medium px-5 py-2 rounded-full drop-shadow-lg">
            {heroMeta.header.badgeText}
          </div>
          
          <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-white leading-tight drop-shadow-lg">
            {heroMeta.header.title}
          </h2>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {heroMeta.buttons.primaryText && (
              <a 
                href={heroMeta.buttons.primaryLink || "/about"}
                className="group bg-[#0396FF] text-white px-5 py-2 rounded-xl hover:bg-[#1A365D] shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold flex items-center space-x-2 hover:scale-105"
              >
                <span className="text-base">{heroMeta.buttons.primaryText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            )}
            
            {heroMeta.buttons.secondaryText && (
              <a 
                href={heroMeta.buttons.secondaryLink || "/projects"}
                className="group bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-xl hover:bg-white/30 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold border border-white/30 hover:border-white/50 flex items-center space-x-2 hover:scale-105"
              >
                <span className="text-base">{heroMeta.buttons.secondaryText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            )}
          </div>
        </div>

        {/* Right Bottom Stats Container */}
        <div className="absolute bottom-8 right-8 w-72">
          <h3 className="text-[#0396FF] font-semibold text-xl mb-3 text-right">
            {heroMeta.stats.title}
          </h3>
          
          <div className="bg-black/40 backdrop-blur-sm border-r-4 border-[#0396FF] p-5 rounded-lg shadow-2xl">
            <div className="text-right">
              <div 
                className={`text-white text-sm font-medium transition-opacity duration-500 min-h-[1.5rem] ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {displayText}
                <span className={`inline-block w-0.5 h-3.5 bg-[#0396FF] ml-1 ${isTyping ? 'animate-pulse' : ''}`}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
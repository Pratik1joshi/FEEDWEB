"use client"

import { Users, Target, Eye, Award, Globe, Lightbulb } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import Image from "next/image"
import { pagesApi } from "@/lib/api-services"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
  : "http://localhost:5000"

const DEFAULT_ABOUT_STAT = {
  number: 26,
  suffix: "+",
  label: "Years of Experience",
  icon: "award",
}

const DEFAULT_ABOUT_CLIENT = {
  name: "World Bank",
  logo: "/clients/AEPC.png",
}

const DEFAULT_ABOUT_SECTION_META = {
  header: {
    badgeText: "About Us",
    title: "26 Years of Proven Experience",
    description:
      "Forum for Energy and Environment Development (FEED) P. Ltd. is one of the leading consulting companies in Nepal initiated by the Engineers' and development planners' with a vision of providing best research and consulting services in developing the risk informed societies. FEED is driven by strong and diverse professionals with proven expertise and experience in handling large and complex projects across sectors.",
    ctaText: "Know Us More",
    ctaLink: "/about",
    image: "/placeholder.jpg",
  },
  stats: {
    title: "Our Impact in Numbers",
    subtitle: "Measurable results from our commitment to sustainable development",
    items: [
      { number: 26, suffix: "+", label: "Years of Experience", icon: "award" },
      { number: 100, suffix: "+", label: "Projects Completed", icon: "target" },
      { number: 30, suffix: "+", label: "Countries Reached", icon: "globe" },
      { number: 50, suffix: "+", label: "Expert Consultants", icon: "users" },
    ],
  },
  clients: {
    title: "Our Clients",
    subtitle: "Our Valuable Clients and Collaborators",
    items: [
      { name: "World Bank", logo: "/clients/AEPC.png" },
      { name: "United Nations", logo: "/clients/Helvetas.png" },
      { name: "Asian Development Bank", logo: "/clients/UNDP.jpg" },
      { name: "USAID", logo: "/clients/UNEnvironment.png" },
      { name: "GIZ", logo: "/clients/PracticalAction.jpg" },
      { name: "UNDP", logo: "/clients/IUCN.png" },
    ],
  },
}

const ICON_MAP = {
  award: Award,
  target: Target,
  globe: Globe,
  users: Users,
  eye: Eye,
  lightbulb: Lightbulb,
}

const cloneObject = (value) => {
  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value))
}

const withMediaOrigin = (url) => {
  if (!url || typeof url !== "string") {
    return "/placeholder.jpg"
  }

  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) {
    return url
  }

  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`
  }

  return url
}

const normalizeAboutSectionMeta = (metaData) => {
  const defaults = cloneObject(DEFAULT_ABOUT_SECTION_META)
  const meta = metaData && typeof metaData === "object" ? metaData : {}

  const statsItems = Array.isArray(meta.stats?.items) && meta.stats.items.length
    ? meta.stats.items.map((item) => ({ ...DEFAULT_ABOUT_STAT, ...(item || {}) }))
    : defaults.stats.items

  const clientItems = Array.isArray(meta.clients?.items) && meta.clients.items.length
    ? meta.clients.items.map((item) => ({ ...DEFAULT_ABOUT_CLIENT, ...(item || {}) }))
    : defaults.clients.items

  return {
    ...defaults,
    ...meta,
    header: {
      ...defaults.header,
      ...(meta.header || {}),
    },
    stats: {
      ...defaults.stats,
      ...(meta.stats || {}),
      items: statsItems,
    },
    clients: {
      ...defaults.clients,
      ...(meta.clients || {}),
      items: clientItems,
    },
  }
}

export default function AboutUs() {
  const [meta, setMeta] = useState(cloneObject(DEFAULT_ABOUT_SECTION_META))
  const statsRef = useRef(null)
  const numberRefs = useRef([])

  const stats = useMemo(() => meta.stats?.items || [], [meta.stats?.items])
  const clients = useMemo(() => meta.clients?.items || [], [meta.clients?.items])

  useEffect(() => {
    let isMounted = true

    const fetchAboutSection = async () => {
      try {
        const response = await pagesApi.getBySlug("about-section")
        if (isMounted && response.success && response.data) {
          setMeta(normalizeAboutSectionMeta(response.data.meta_data))
        }
      } catch (error) {
        console.error("Failed to load About section content", error)
      }
    }

    fetchAboutSection()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: statsRef.current,
        start: "top 60%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    })

    numberRefs.current.forEach((ref) => {
      if (ref) {
        gsap.set(ref, { innerText: "0" })
      }
    })

    numberRefs.current = numberRefs.current.slice(0, stats.length)

    numberRefs.current.forEach((ref, index) => {
      if (ref) {
        const targetNumber = Number(stats[index]?.number) || 0
        const suffix = stats[index]?.suffix || ""

        tl.to(ref, {
          innerText: targetNumber,
          duration: 1.5,
          snap: { innerText: 1 },
          modifiers: {
            innerText: value => Math.ceil(Number(value)) + suffix
          }
        }, index * 0.2)
      }
    })

    return () => {
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    }
  }, [stats])

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="text-center md:text-left">
            <div className="inline-block bg-[#00966a] text-white text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-4 shadow-sm">
              {meta.header.badgeText}
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-4">
              {meta.header.title}
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 mx-auto md:mx-0 max-w-3xl">
              {meta.header.description}
            </p>
            {meta.header.ctaText && (
              <Link
                href={meta.header.ctaLink || "/about"}
                className="inline-flex items-center bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-base font-medium"
              >
                {meta.header.ctaText}
              </Link>
            )}
          </div>
          <div className="relative h-[350px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src={withMediaOrigin(meta.header.image)}
              alt="FEED Office or Team"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Statistics */}
        <div ref={statsRef} className="bg-white border border-gray-100 rounded-lg p-12 shadow-lg">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-4">{meta.stats.title}</h3>
            <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">{meta.stats.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const StatIcon = ICON_MAP[stat.icon] || Award
              return (
                <div key={`stat-${index}`} className="text-center">
                  <div className="w-12 h-12 bg-[#0396FF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <StatIcon className="w-6 h-6 text-[#0396FF]" />
                  </div>
                  <div ref={(el) => (numberRefs.current[index] = el)} className="text-4xl font-bold text-[#1A365D] mb-3">
                    0{stat.suffix}
                  </div>
                  <div className="text-gray-600 font-medium text-base">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Clients Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-bold text-[#1A365D] mb-6">{meta.clients.title}</h3>
            <p className="text-xl text-[#0396FF]">{meta.clients.subtitle}</p>
          </div>
          
          {/* Clients Slider Container */}
          <div className="relative w-full overflow-hidden bg-transparent py-16">
            {/* Use CSS animations for smoother performance */}
            <div className="flex animate-marquee hover:pause whitespace-nowrap">
              {clients.map((client, index) => (
                <div
                  key={`client-${index}`}
                  className="flex-shrink-0 w-48 h-24 mx-10 bg-white rounded-lg shadow-md p-4 flex items-center justify-center group hover:shadow-lg transition-shadow duration-300"
                >
                  <Image
                    src={withMediaOrigin(client.logo)}
                    alt={client.name}
                    width={160}
                    height={80}
                    className="object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
              
              {/* Duplicate set of logos for seamless loop */}
              {clients.map((client, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="flex-shrink-0 w-48 h-24 mx-10 bg-white rounded-lg shadow-md p-4 flex items-center justify-center group hover:shadow-lg transition-shadow duration-300"
                >
                  <Image
                    src={withMediaOrigin(client.logo)}
                    alt={client.name}
                    width={160}
                    height={80}
                    className="object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

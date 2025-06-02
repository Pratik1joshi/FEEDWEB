"use client"

import { Users, Target, Eye, Award, Globe, Lightbulb } from "lucide-react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import Image from "next/image"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function AboutUs() {
  const statsRef = useRef(null)
  const numberRefs = useRef([])
  const clientsRef = useRef(null)

  const stats = [
    { number: 26, suffix: "+", label: "Years of Experience", icon: Award },
    { number: 100, suffix: "+", label: "Projects Completed", icon: Target },
    { number: 30, suffix: "+", label: "Countries Reached", icon: Globe },
    { number: 50, suffix: "+", label: "Expert Consultants", icon: Users },
  ]

  const clients = [
    { name: "World Bank", logo: "/clients/AEPC.png" },
    { name: "United Nations", logo: "/clients/Helvetas.png" },
    { name: "Asian Development Bank", logo: "/clients/UNDP.jpg" },
    { name: "USAID", logo: "/clients/UNEnvironment.png" },
    { name: "GIZ", logo: "/clients/PracticalAction.jpg" },
    { name: "UNDP", logo: "/clients/IUCN.png" }
  ]

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

    numberRefs.current.forEach((ref, index) => {
      if (ref) {
        const targetNumber = stats[index].number
        const suffix = stats[index].suffix

        tl.to(ref, {
          innerText: targetNumber,
          duration: 1.5,
          snap: { innerText: 1 },
          modifiers: {
            innerText: value => Math.ceil(value) + suffix
          }
        }, index * 0.2)
      }
    })

    return () => {
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    }
  }, [])

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A365D] mb-2">About FEED PVT LTD</h2>
            <p className="text-2xl text-[#0396FF] font-semibold mb-6">26 Years of Proven Experience</p>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Forum for Energy and Environment Development (FEED) P. Ltd. is one of the leading consulting companies in Nepal 
              initiated by the Engineers' and development planners' with a vision of providing best research and consulting 
              services in developing the risk informed societies. FEED is driven by strong and diverse professionals with 
              proven expertise and experience in handling large and complex projects across sectors.
            </p>
            <Link 
              href="/about" 
              className="inline-flex items-center bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium"
            >
              Know Us More
            </Link>
          </div>
          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/placeholder.jpg"
              alt="FEED Office or Team"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Statistics */}
        <div ref={statsRef} className="bg-gradient-to-r from-[#0396FF] to-[#0396FF]/80 rounded-lg p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold text-white mb-4">Our Impact in Numbers</h3>
            <p className="text-blue-100 text-lg">Measurable results from our commitment to sustainable development</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div ref={(el) => (numberRefs.current[index] = el)} className="text-4xl font-bold text-white mb-2">
                  0{stat.suffix}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Clients Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold text-[#1A365D] mb-4">Our Clients</h3>
            <p className="text-lg text-[#0396FF]">Our Valuable Clients and Collaborators</p>
          </div>
          
          {/* Clients Slider Container */}
          <div className="relative w-full overflow-hidden bg-transparent py-12">
            {/* Use CSS animations for smoother performance */}
            <div className="flex animate-marquee hover:pause whitespace-nowrap">
              {clients.map((client, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-48 h-24 mx-10 bg-white rounded-lg shadow-md p-4 flex items-center justify-center group hover:shadow-lg transition-shadow duration-300"
                >
                  <Image
                    src={client.logo}
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
                    src={client.logo}
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

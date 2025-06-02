import { Flag, Award, Heart, FileText, Building, Globe } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Timeline() {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const timelineRef = useRef(null)
  const timelineLineRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Reset refs array
    cardsRef.current = []
    
    // Initially hide everything completely
    gsap.set(timelineLineRef.current, { 
      scaleX: 0,
      transformOrigin: "left center"
    })
    gsap.set(".timeline-card", {  // Target cards by class
      opacity: 0,
      scale: 0,
      y: (index) => index % 2 === 0 ? -50 : 50
    })
    gsap.set(".timeline-node", {
      scale: 0,
      opacity: 0
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

  }, [])

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
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - timelineRef.current.offsetLeft
    const walk = (x - startX) * 2
    timelineRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const timelineItems = [
    {
      year: "2015",
      title: "Foundation",
      description:
        "FEED was established with a vision to bridge the gap between energy development and environmental conservation.",
      icon: Flag,
    },
    {
      year: "2017",
      title: "First Major Research Grant",
      description: "Secured $5M in funding for renewable energy integration research across developing regions.",
      icon: Award,
    },
    {
      year: "2019",
      title: "Global Partnership Launch",
      description: "Formed strategic alliances with 15 international organizations to expand our impact worldwide.",
      icon: Heart,
    },
    {
      year: "2021",
      title: "Policy Impact Achievement",
      description: "Our research directly influenced renewable energy policies in 12 countries.",
      icon: FileText,
    },
    {
      year: "2023",
      title: "Innovation Center Opening",
      description: "Launched state-of-the-art research facility focused on sustainable technology development.",
      icon: Building,
    },
    {
      year: "2025",
      title: "Global Impact Milestone",
      description: "Successfully implemented 100+ sustainable energy projects across 30 countries.",
      icon: Globe,
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[90%] mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-serif font-bold text-[#1A365D] mb-6">Our Journey</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Explore the key milestones that have shaped our organization's impact on energy and environmental
            development.
          </p>
        </div>
        
        {/* Timeline Container */}
        <div className="relative h-[800px] min-h-[600px]">
          <div 
            ref={timelineRef}
            className="absolute inset-0 overflow-x-auto cursor-grab select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="min-w-[1800px] h-full relative pl-[200px] pr-[100px]">
              {/* Timeline Line */}
              <div 
                ref={timelineLineRef}
                className="absolute top-1/2 transform -translate-y-1/2 left-[200px] right-[100px] h-1 bg-gradient-to-r from-[#1A365D]/20 via-[#1A365D] to-[#1A365D]/20"
              ></div>
              
              {/* Timeline Items */}
              <div className="flex justify-between items-center h-full relative">
                {timelineItems.map((item, index) => (
                  <div key={index} className="relative group h-full flex items-center">
                    {/* Content Card */}
                    <div 
                      className={`timeline-card absolute left-1/2 transform -translate-x-1/2 w-80 
                        ${index % 2 === 0 ? 'top-[15%]' : 'top-[60%]'} 
                        transition-all duration-300 group-hover:-translate-y-2`}
                    >
                      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#B22234] 
                        hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[#B22234] font-bold text-2xl">{item.year}</span>
                          <item.icon className="w-6 h-6 text-[#1A365D]" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                      </div>
                      {/* Connector Line */}
                      <div className={`absolute left-1/2 transform -translate-x-1/2 w-px bg-gradient-to-b 
                        ${index % 2 === 0 ? 
                          'from-[#1A365D] to-transparent h-24 bottom-0 translate-y-full' : 
                          'from-transparent to-[#1A365D] h-24 -top-24'}`}>
                      </div>
                    </div>

                    {/* Timeline Node */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="timeline-node w-8 h-8 rounded-full bg-[#1A365D] border-4 border-white shadow-md
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
      <div className="text-center mt-4 text-gray-500">
        ← Drag to explore the timeline →
      </div>
    </section>
  )
}

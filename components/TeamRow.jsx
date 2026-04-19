"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import TeamCard from './TeamCard'

export default function TeamRow({ members, rowIndex, offset = 0 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Create parallax effect - higher rows move slower, lower rows move faster
  const baseSpeed = 0.3
  const speed = baseSpeed - (rowIndex * 0.05) // Higher rows (lower index) move slower
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset * (1 + speed)])

  // Determine grid columns based on screen size
  const getGridCols = () => {
    if (typeof window === 'undefined') return 'grid-cols-1'
    
    if (window.innerWidth >= 1280) return 'xl:grid-cols-4' // 4 columns on xl screens
    if (window.innerWidth >= 1024) return 'lg:grid-cols-3' // 3 columns on lg screens
    if (window.innerWidth >= 768) return 'md:grid-cols-2'  // 2 columns on md screens
    return 'grid-cols-1' // 1 column on small screens
  }

  const [gridCols, setGridCols] = useState('grid-cols-1')

  useEffect(() => {
    const updateGridCols = () => setGridCols(getGridCols())
    updateGridCols()
    window.addEventListener('resize', updateGridCols)
    return () => window.removeEventListener('resize', updateGridCols)
  }, [])

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="w-full"
    >
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 px-4 md:px-0`}>
        {members.map((member, index) => (
          <TeamCard 
            key={member.id} 
            member={member} 
            index={index}
          />
        ))}
      </div>
    </motion.div>
  )
}

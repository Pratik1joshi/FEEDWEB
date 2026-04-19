"use client"

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import TeamCard from './TeamCard'

export default function TeamColumn({ members, columnIndex, offset = 0, speed = 0.5 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Create parallax effect with different speeds for each column
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset * speed])

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="flex flex-col space-y-6 lg:space-y-8"
    >
      {members.map((member, index) => (
        <TeamCard 
          key={member.id} 
          member={member} 
          index={index + columnIndex * 3} // Stagger animation delays between columns
        />
      ))}
    </motion.div>
  )
}

"use client"

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function HeroBanner({ 
  title, 
  subtitle, 
  description, 
  badgeText,
  backgroundImage = "/photo-1617280137702-32e761be8b26.jpg",
  badgeIcon: BadgeIcon = Sparkles,
  showBadge = true,
  rootClassName = "",
  containerClassName = "",
  contentClassName = "",
  titleClassName = "text-3xl md:text-5xl lg:text-6xl",
  subtitleClassName = "text-xl md:text-2xl lg:text-3xl",
  descriptionClassName = "text-base md:text-lg"
}) {
  const rootClasses = `relative pt-20 overflow-hidden ${rootClassName}`.trim()
  const containerClasses = `container mx-auto px-6 relative z-10 ${containerClassName}`.trim()
  const contentClasses = `text-center mb-16 ${contentClassName}`.trim()

  return (
    <div className={rootClasses}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
      </div>
      
      <div className={containerClasses}>
        <div className={contentClasses}>
          {showBadge && badgeText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4 shadow-lg border border-white/30"
            >
              <BadgeIcon className="w-4 h-4 mr-2" />
              <span className="font-semibold text-sm">{badgeText}</span>
            </motion.div>
          )}
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${titleClassName} font-serif font-bold text-white mb-4`}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`${subtitleClassName} font-medium text-white/90 mb-6`}
            >
              {subtitle}
            </motion.h2>
          )}
          
          {description && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${descriptionClassName} text-white/90 max-w-3xl mx-auto leading-relaxed`}
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      className="fixed bottom-8 right-8 w-12 h-12 bg-[#0396FF] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1A365D] transition-colors duration-300 z-50 cursor-pointer"
      onClick={scrollToTop}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}

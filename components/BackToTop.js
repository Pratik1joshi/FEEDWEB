"use client"

import { ArrowUp } from "lucide-react"

export default function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <button
      className="fixed bottom-8 right-8 w-12 h-12 bg-[#1A365D] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#B22234] transition-colors duration-300 z-50 cursor-pointer"
      onClick={scrollToTop}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}

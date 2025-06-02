"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAboutOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const aboutDropdownItems = [
    { title: "Know Us", href: "/about" },
    { title: "Our Team", href: "/about/team" },
    { title: "Awards & Achievements", href: "/about/awards" },
    { title: "Work With Us", href: "/about/careers" },
  ]

  const handleAboutClick = () => {
    setIsAboutOpen(!isAboutOpen)
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 ${
        isScrolled ? "bg-white shadow-md py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className={`text-3xl font-bold font-serif transition-colors duration-300`}>
            <span className="text-[#0396FF]">F</span>
            <span className="text-[#0396FF]">E</span>
            <span className="text-[#0396FF]">E</span>
            <span className="text-[#0396FF]">D</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-10">
          <Link
              href= {"/"}
              className={`text-lg font-medium hover:text-[#B22234] transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                isScrolled ? "text-[#0396FF]" : "text-white"
              }`}
              onClick={() => setActiveTab("home".toLowerCase())}
            >
              Home
            </Link>
          {/* About Dropdown */}
          <div className="relative group" ref={dropdownRef}>
            <button
              className={`flex items-center space-x-1 text-lg font-medium hover:text-[#B22234] transition-colors duration-300 cursor-pointer ${
                isScrolled ? "text-[#0396FF]" : "text-white"
              }`}
              onClick={handleAboutClick}
            >
              <span>About</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${isAboutOpen ? 'rotate-180' : ''}`} />
            </button>
            {isAboutOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                {aboutDropdownItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#0396FF] transition-colors duration-200"
                    onClick={handleAboutClick}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Other Navigation Items */}
          {["Services", "Projects", "Publications", "Media", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/#${item.toLowerCase()}`}
              className={`text-lg font-medium hover:text-[#B22234] transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                isScrolled ? "text-[#0396FF]" : "text-white"
              }`}
              onClick={() => setActiveTab(item.toLowerCase())}
            >
              {item}
            </Link>
          ))}
          <button className="bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap text-lg">
            Join Us
          </button>
        </nav>
        <div className="md:hidden">
          <Menu className={`w-8 h-8 cursor-pointer ${isScrolled ? "text-[#0396FF]" : "text-white"}`} />
        </div>
      </div>
    </header>
  )
}

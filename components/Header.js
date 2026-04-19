"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isMediaOpen, setIsMediaOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const mediaDropdownRef = useRef(null)
  const pathname = usePathname()

  // Check if current page has a hero section
  const hasHeroSection = pathname === "/" || 
                        pathname === "/about" || 
                        pathname === "/services" || 
                        pathname === "/projects" ||
                        pathname === "/contact" ||
                        pathname === "/media" ||
                        pathname === "/media/news" ||
                        pathname === "/media/blog" ||
                        pathname === "/media/press" ||
                        pathname === "/media/videos" ||
                        pathname === "/media/gallery" ||
                        pathname === "/publications"

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
      if (mediaDropdownRef.current && !mediaDropdownRef.current.contains(event.target)) {
        setIsMediaOpen(false)
      }
    }

    // For pages without hero sections, set header as scrolled by default
    if (!hasHeroSection) {
      setIsScrolled(true)
    } else {
      // Check initial scroll position for pages with hero sections
      handleScroll()
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [hasHeroSection])

  const aboutDropdownItems = [
    { title: "Know Us", href: "/about" },
    { title: "Our Team", href: "/about/team" },
    { title: "Awards & Achievements", href: "/about/awards" },
    { title: "Work With Us", href: "/about/careers" },
  ]

  const mediaDropdownItems = [
    { title: "News", href: "/media/news" },
    { title: "Press Releases", href: "/media/press" },
    { title: "Videos", href: "/media/videos" },
    { title: "Gallery", href: "/media/gallery" },
    { title: "Blog", href: "/media/blog" },
    { title: "Publications", href: "/publications" },
  ]

  const handleAboutClick = () => {
    setIsAboutOpen(!isAboutOpen)
  }

  const handleMediaClick = () => {
    setIsMediaOpen(!isMediaOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-4"
      }`}
    >
      <div className="container px-12 py-1 mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="inline-flex items-center" aria-label="FEED home">
            <Image
              src="/feed_logo.png"
              alt="FEED logo"
              width={160}
              height={56}
              priority
              className="h-12 w-auto drop-shadow-sm"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
              href= {"/"}
              className={`text-m font-medium hover:text-[#0396FF] cursor-pointer whitespace-nowrap ${
                isScrolled ? "text-black" : "text-white"
              }`}
              onClick={() => setActiveTab("home".toLowerCase())}
            >
              Home
            </Link>
          {/* About Dropdown */}
          <div className="relative group" ref={dropdownRef}>
            <button
              className={`flex items-center space-x-1 text-m font-medium hover:text-[#0396FF] cursor-pointer ${
                isScrolled ? "text-black" : "text-white"
              }`}
              onClick={handleAboutClick}
            >
              <span>About</span>
              <ChevronDown className={`w-3 h-3 transform transition-transform duration-200 ${isAboutOpen ? 'rotate-180' : ''}`} />
            </button>
            {isAboutOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                {aboutDropdownItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-[#0396FF] transition-none"
                    onClick={handleAboutClick}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Other Navigation Items */}
          {["Services", "Projects"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className={`text-m font-medium hover:text-[#0396FF] cursor-pointer whitespace-nowrap ${
                isScrolled ? "text-black" : "text-white"
              }`}
              onClick={() => setActiveTab(item.toLowerCase())}
            >
              {item}
            </Link>
          ))}

          <Link
            href="/events"
            className={`text-m font-medium hover:text-[#0396FF] cursor-pointer whitespace-nowrap ${
              isScrolled ? "text-black" : "text-white"
            }`}
            onClick={() => setActiveTab("events")}
          >
            Events
          </Link>

          {/* Media Dropdown */}
          <div className="relative group" ref={mediaDropdownRef}>
            <button
              className={`flex items-center space-x-1 text-m font-medium hover:text-[#0396FF] cursor-pointer ${
                isScrolled ? "text-black" : "text-white"
              }`}
              onClick={handleMediaClick}
            >
              <span>Media</span>
              <ChevronDown className={`w-3 h-3 transform transition-transform duration-200 ${isMediaOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMediaOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                {mediaDropdownItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-[#0396FF] transition-none"
                    onClick={handleMediaClick}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`text-m font-medium px-5 py-2 rounded-full cursor-pointer whitespace-nowrap ${
              isScrolled 
                ? "bg-[#0396FF] text-white hover:bg-opacity-90" 
                : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/30 hover:border-white/50"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            Contact Us
          </Link>
        </nav>
        <div className="md:hidden">
          <Menu 
            className={`w-6 h-6 cursor-pointer ${isScrolled ? "text-[#0396FF]" : "text-white"}`} 
            onClick={toggleMobileMenu}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t ${
          isScrolled ? "bg-white border-white" : "bg-transparent backdrop-blur-md border-white/20"
        }`}>
          <nav className="container mx-auto px-6 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`font-medium hover:text-[#B22234] transition-colors duration-300 ${
                  isScrolled ? "text-[#0396FF]" : "text-white"
                }`}
                onClick={() => {
                  setActiveTab("home")
                  setIsMobileMenuOpen(false)
                }}
              >
                Home
              </Link>
              
              {/* Mobile About Section */}
              <div className="space-y-2">
                <button
                  className={`font-medium hover:text-[#B22234] transition-colors duration-300 flex items-center justify-between w-full ${
                    isScrolled ? "text-[#0396FF]" : "text-white"
                  }`}
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                >
                  <span>About</span>
                  <ChevronDown className={`w-3 h-3 transform transition-transform duration-200 ${isAboutOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAboutOpen && (
                  <div className="pl-4 space-y-2">
                    {aboutDropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block hover:text-[#0396FF] transition-colors duration-200 ${
                          isScrolled ? "text-gray-600" : "text-gray-300"
                        }`}
                        onClick={() => {
                          setIsAboutOpen(false)
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Mobile Navigation Items */}
              {["Services", "Projects"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`font-medium hover:text-[#B22234] transition-colors duration-300 ${
                    isScrolled ? "text-[#0396FF]" : "text-white"
                  }`}
                  onClick={() => {
                    setActiveTab(item.toLowerCase())
                    setIsMobileMenuOpen(false)
                  }}
                >
                  {item}
                </Link>
              ))}

              <Link
                href="/events"
                className={`font-medium hover:text-[#B22234] transition-colors duration-300 ${
                  isScrolled ? "text-[#0396FF]" : "text-white"
                }`}
                onClick={() => {
                  setActiveTab("events")
                  setIsMobileMenuOpen(false)
                }}
              >
                Events
              </Link>

              {/* Mobile Media Section */}
              <div className="space-y-2">
                <button
                  className={`font-medium hover:text-[#B22234] transition-colors duration-300 flex items-center justify-between w-full ${
                    isScrolled ? "text-[#0396FF]" : "text-white"
                  }`}
                  onClick={() => setIsMediaOpen(!isMediaOpen)}
                >
                  <span>Media</span>
                  <ChevronDown className={`w-3 h-3 transform transition-transform duration-200 ${isMediaOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMediaOpen && (
                  <div className="pl-4 space-y-2">
                    {mediaDropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block hover:text-[#0396FF] transition-colors duration-200 ${
                          isScrolled ? "text-gray-600" : "text-gray-300"
                        }`}
                        onClick={() => {
                          setIsMediaOpen(false)
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className={`font-medium px-5 py-2 rounded-full transition-all duration-300 mt-2 block w-fit ${
                  isScrolled 
                    ? "bg-[#0396FF] text-white hover:bg-opacity-90" 
                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/30 hover:border-white/50"
                }`}
                onClick={() => {
                  setActiveTab("contact")
                  setIsMobileMenuOpen(false)
                }}
              >
                Contact Us
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

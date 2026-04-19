"use client"

import Link from "next/link"
import Image from "next/image"
import { Twitter, Facebook, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { useSiteSettings } from "@/src/hooks/useSiteSettings"

export default function Footer() {
  const { settings } = useSiteSettings()

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Our Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Publications", href: "/publications" },
    { label: "Media Center", href: "/media/news" },
    { label: "Contact Us", href: "/contact" },
  ]

  const resources = [
    { label: "Research Papers", href: "/publications" },
    { label: "Policy Briefs", href: "/publications" },
    { label: "Annual Reports", href: "/publications" },
    { label: "Latest News", href: "/media/news" },
  ]

  const contactInfo = [
    { icon: MapPin, text: settings.address || "Kathmandu, Nepal" },
    { icon: Phone, text: settings.phone_primary || "+977-1-XXXXXXX" },
    { icon: Mail, text: settings.email_primary || "info@feed.org.np" },
  ]

  return (
    <footer className="bg-[#102A4C] text-white pt-16 px-12 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center" aria-label="FEED home">
                <Image
                  src="/feed_logo.png"
                  alt="FEED logo"
                  width={190}
                  height={66}
                  className="h-14 w-auto"
                />
              </Link>
            </div>
            <p className="text-blue-100 mb-6 leading-relaxed">
              {settings.footer_description}
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: settings.twitter_url },
                { icon: Facebook, href: settings.facebook_url },
                { icon: Linkedin, href: settings.linkedin_url },
                { icon: Instagram, href: settings.instagram_url },
                { icon: Youtube, href: settings.youtube_url },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href || "#"}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-blue-100 hover:bg-[#0396FF] hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-blue-100 hover:text-white transition-colors duration-300 cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Resources</h3>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.href + resource.label}>
                  <Link href={resource.href} className="text-blue-100 hover:text-white transition-colors duration-300 cursor-pointer">
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Contact</h3>
            <ul className="space-y-4">
              {contactInfo.map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-blue-100">
                  <item.icon className="w-5 h-5 mt-0.5 text-[#0396FF]" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-100 text-sm">
            &copy; {new Date().getFullYear()} Forum for Energy and Environment Development. All rights reserved.
          </p>
          <div className="mt-0">
            {/* <a
              href="#"
              className="text-blue-100 hover:text-white transition-colors duration-300 text-sm cursor-pointer"
            >
              Privacy Policy
            </a>
            <span className="mx-2 text-blue-100/40">|</span>
            <a
              href="#"
              className="text-blue-100 hover:text-white transition-colors duration-300 text-sm cursor-pointer"
            >
              Terms of Service
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

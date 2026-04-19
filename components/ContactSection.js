"use client"

import { MapPin, Phone, Mail, Twitter, Facebook, Linkedin, Instagram, Youtube } from "lucide-react"
import { useEffect, useState } from "react"
import { useSiteSettings } from "@/src/hooks/useSiteSettings"
import { inboxApi, pagesApi } from "@/src/lib/api-services"

const DEFAULT_CONTACT_SECTION_META = {
  header: {
    badgeText: "",
    title: "Get in Touch",
    subtitle: "Send us a message and our team will get back to you.",
    ctaText: "Send Message",
  },
  messages: {
    note: "Contact Information",
  },
}

const normalizeContactSectionMeta = (rawMeta) => {
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {}
  return {
    ...DEFAULT_CONTACT_SECTION_META,
    ...meta,
    header: {
      ...DEFAULT_CONTACT_SECTION_META.header,
      ...(meta.header || {}),
    },
    messages: {
      ...DEFAULT_CONTACT_SECTION_META.messages,
      ...(meta.messages || {}),
    },
  }
}

export default function ContactSection() {
  const { settings } = useSiteSettings()
  const [sectionMeta, setSectionMeta] = useState(DEFAULT_CONTACT_SECTION_META)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState("")
  const mapUrl = settings.map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.9638655399463!2d85.30972257615835!3d27.687511676193928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19bca03b6dd5%3A0x4f3b7763d3a0b37f!2sFEED%20Pvt.%20Ltd.!5e0!3m2!1sen!2snp!4v1748843024752!5m2!1sen!2snp"

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(`${email || ""}`)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError("")
    setSubmitSuccess("")

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    }

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setSubmitError("Please fill in all fields before submitting.")
      return
    }

    if (!isValidEmail(payload.email)) {
      setSubmitError("Please enter a valid email address.")
      return
    }

    try {
      setIsSubmitting(true)
      const response = await inboxApi.submitContact(payload)
      setSubmitSuccess(response?.message || "Thanks for reaching out. We received your message and will get back to you shortly.")
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setSubmitError(error.message || "We could not send your message right now. Please try again in a few minutes.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchSectionMeta = async () => {
      try {
        const response = await pagesApi.getBySlug("contact-section")
        if (!isMounted) return

        if (response.success && response.data) {
          setSectionMeta(normalizeContactSectionMeta(response.data.meta_data))
        }
      } catch (error) {
        if (`${error?.message || ""}`.toLowerCase().includes("page not found")) {
          return
        }
        console.warn("Failed to load contact-section metadata, using defaults", error)
      }
    }

    fetchSectionMeta()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-12 bg-white" id="contact">
      <div className="container mx-auto px-0 sm:px-2 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            {sectionMeta.header.badgeText && (
              <div className="inline-block bg-[#00966a] text-white text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-4 shadow-sm">
                {sectionMeta.header.badgeText}
              </div>
            )}
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A365D] mb-6">
              {sectionMeta.header.title || settings.contact_heading}
            </h2>
            <p className="text-base text-gray-600 mb-8">
              {sectionMeta.header.subtitle || settings.contact_description}
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all duration-300 text-base"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all duration-300 text-base"
                    placeholder="Your email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all duration-300 text-base"
                  placeholder="Subject of your message"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all duration-300 resize-none text-base"
                  placeholder="Your message"
                ></textarea>
              </div>

              {submitError && (
                <p className="text-sm text-red-600">{submitError}</p>
              )}

              {submitSuccess && (
                <p className="text-sm text-green-600">{submitSuccess}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0396FF] text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 whitespace-nowrap text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : sectionMeta.header.ctaText || "Send Message"}
              </button>
            </form>
          </div>
          <div className="lg:pl-8 xl:pl-12">
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8 lg:p-10 h-full">
              <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-6">
                {sectionMeta.messages.note || "Contact Information"}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#0396FF] rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-[#1A365D] mb-2">Our Location</h4>
                    <p className="text-gray-600 text-sm">
                      {settings.address}
                      {settings.city ? <><br />{settings.city}</> : null}
                      {settings.country ? <><br />{settings.country}</> : null}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#0396FF] rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-[#1A365D] mb-2">Call Us</h4>
                    <p className="text-gray-600 text-sm">
                      {settings.phone_primary}
                      {settings.phone_secondary ? <><br />{settings.phone_secondary}</> : null}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#0396FF] rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-[#1A365D] mb-2">Email Us</h4>
                    <p className="text-gray-600 text-sm">
                      {settings.email_primary}
                      {settings.email_secondary ? <><br />{settings.email_secondary}</> : null}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="text-base font-medium text-[#1A365D] mb-4">Follow Us</h4>
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
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1A365D] hover:bg-[#0396FF] hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="mt-8 rounded-lg h-56 md:h-64 overflow-hidden shadow-md">
                {/* Google Maps Embed - FEED Pvt. Ltd. location */}
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="FEED PVT LTD Location"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

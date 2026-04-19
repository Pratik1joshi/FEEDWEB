"use client"

import { useEffect, useState } from "react"
import { useSiteSettings } from "@/src/hooks/useSiteSettings"
import { inboxApi, pagesApi } from "@/src/lib/api-services"

const DEFAULT_NEWSLETTER_SECTION_META = {
  header: {
    badgeText: "FEED Updates",
    title: "Stay Updated",
    subtitle: "Get updates about our latest projects, insights, and publications.",
    ctaText: "Subscribe",
  },
  messages: {
    placeholder: "Enter your email address",
    note: "We only send relevant updates. Unsubscribe anytime.",
  },
}

const normalizeNewsletterSectionMeta = (rawMeta) => {
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {}
  return {
    ...DEFAULT_NEWSLETTER_SECTION_META,
    ...meta,
    header: {
      ...DEFAULT_NEWSLETTER_SECTION_META.header,
      ...(meta.header || {}),
    },
    messages: {
      ...DEFAULT_NEWSLETTER_SECTION_META.messages,
      ...(meta.messages || {}),
    },
  }
}

export default function Newsletter() {
  const { settings } = useSiteSettings()
  const [sectionMeta, setSectionMeta] = useState(DEFAULT_NEWSLETTER_SECTION_META)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState("")

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(`${value || ""}`)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError("")
    setSubmitSuccess("")

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setSubmitError("Please enter your email address.")
      return
    }

    if (!isValidEmail(trimmedEmail)) {
      setSubmitError("Please enter a valid email address.")
      return
    }

    try {
      setIsSubmitting(true)
      const response = await inboxApi.submitNewsletter({ email: trimmedEmail })
      setSubmitSuccess(response?.message || "Thanks for subscribing. You are now on the newsletter list.")
      setEmail("")
    } catch (error) {
      setSubmitError(error.message || "We could not complete your subscription right now. Please try again shortly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchSectionMeta = async () => {
      try {
        const response = await pagesApi.getBySlug("newsletter-section")
        if (!isMounted) return

        if (response.success && response.data) {
          setSectionMeta(normalizeNewsletterSectionMeta(response.data.meta_data))
        }
      } catch (error) {
        if (`${error?.message || ""}`.toLowerCase().includes("page not found")) {
          return
        }
        console.warn("Failed to load newsletter-section metadata, using defaults", error)
      }
    }

    fetchSectionMeta()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-12 bg-[#21406F]">
      <div className="container mx-auto px-0 sm:px-2 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-[#0396FF] text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
            {sectionMeta.header.badgeText}
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
            {sectionMeta.header.title || settings.newsletter_title}
          </h2>
          <p className="text-blue-100 mb-10 text-lg md:text-xl leading-relaxed">
            {sectionMeta.header.subtitle || settings.newsletter_description}
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="flex-grow px-6 py-4 rounded-md focus:outline-none border border-white/10 bg-white text-[#1A365D] placeholder:text-gray-500 text-base"
              placeholder={sectionMeta.messages.placeholder}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0396FF] text-white px-10 py-4 rounded-md hover:bg-opacity-90 transition-all duration-300 whitespace-nowrap font-semibold text-lg w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Subscribing..." : sectionMeta.header.ctaText}
            </button>
          </form>

          {submitError && <p className="text-red-200 text-sm mt-4">{submitError}</p>}
          {submitSuccess && <p className="text-green-200 text-sm mt-4">{submitSuccess}</p>}

          <p className="text-blue-200 text-base mt-6">{sectionMeta.messages.note}</p>
        </div>
      </div>
    </section>
  )
}
  
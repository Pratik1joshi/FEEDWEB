import { useCallback, useEffect, useState } from 'react'
import { siteSettingsApi } from '../lib/api-services'

export const defaultSiteSettings = {
  organization_name: 'FEED',
  tagline: 'Forum for Energy and Environment Development',
  footer_description:
    'Forum for Energy and Environment Development works toward practical, research-driven solutions for climate resilience, energy access, and sustainable development in Nepal.',
  contact_heading: 'Get In Touch',
  contact_description:
    "Have questions or want to collaborate? Reach out to our team and we'll get back to you as soon as possible.",
  newsletter_title: 'Stay in the Loop',
  newsletter_description:
    'Get research highlights, project updates, event announcements, and sustainable development insights delivered directly to your inbox.',
  address: 'Kathmandu, Nepal',
  city: 'Kathmandu',
  country: 'Nepal',
  phone_primary: '+977-1-XXXXXXX',
  phone_secondary: '',
  email_primary: 'info@feed.org.np',
  email_secondary: 'support@feed.org.np',
  facebook_url: '',
  twitter_url: '',
  linkedin_url: '',
  instagram_url: '',
  youtube_url: '',
  map_url:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.9638655399463!2d85.30972257615835!3d27.687511676193928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19bca03b6dd5%3A0x4f3b7763d3a0b37f!2sFEED%20Pvt.%20Ltd.!5e0!3m2!1sen!2snp!4v1748843024752!5m2!1sen!2snp',
  mail_from_name: 'FEED Website',
  mail_from_email: '',
  smtp_host: '',
  smtp_port: '587',
  smtp_secure: 'false',
  smtp_user: '',
  smtp_password: '',
  contact_form_recipient_email: '',
  newsletter_recipient_email: '',
}

export const normalizeSiteSettings = (data = {}) => ({
  ...defaultSiteSettings,
  ...data,
})

export function useSiteSettings({ admin = false } = {}) {
  const [settings, setSettings] = useState(defaultSiteSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = admin ? await siteSettingsApi.getAdmin() : await siteSettingsApi.get()
      const payload = response?.data || response
      setSettings(normalizeSiteSettings(payload))
      return normalizeSiteSettings(payload)
    } catch (err) {
      setError(err.message)
      setSettings(defaultSiteSettings)
      return defaultSiteSettings
    } finally {
      setLoading(false)
    }
  }, [admin])

  const updateSettings = useCallback(async (updates) => {
    const response = await siteSettingsApi.update(updates)
    const payload = response?.data || response
    const normalized = normalizeSiteSettings(payload)
    setSettings(normalized)
    return normalized
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return {
    settings,
    loading,
    error,
    refetch: loadSettings,
    updateSettings,
  }
}

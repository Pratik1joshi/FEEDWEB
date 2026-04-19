"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { useSiteSettings, defaultSiteSettings } from '@/src/hooks/useSiteSettings'
import { showAdminError, showAdminSuccess } from '@/lib/admin-toast'
import { Save } from 'lucide-react'

export default function SocialsAdminPage() {
  const { settings, loading, error, updateSettings } = useSiteSettings({ admin: true })
  const [formData, setFormData] = useState(defaultSiteSettings)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  useEffect(() => {
    if (error) {
      showAdminError(`Could not load settings: ${error}`)
    }
  }, [error])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      await updateSettings(formData)
      showAdminSuccess('Settings saved. Contact, social, and mail options are now updated.')
    } catch (err) {
      showAdminError(err.message || 'Could not save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Site Socials & Contacts">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Socials & Contacts</h1>
          <p className="text-gray-600">Manage organization details, contacts, social links, and mail delivery settings used across the website.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Organization Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Organization Name" name="organization_name" value={formData.organization_name} onChange={handleChange} />
              <Field label="Tagline" name="tagline" value={formData.tagline} onChange={handleChange} />
              <Field label="Footer Description" name="footer_description" value={formData.footer_description} onChange={handleChange} textarea />
              <Field label="Contact Heading" name="contact_heading" value={formData.contact_heading} onChange={handleChange} />
              <Field label="Contact Description" name="contact_description" value={formData.contact_description} onChange={handleChange} textarea />
              <Field label="Newsletter Title" name="newsletter_title" value={formData.newsletter_title} onChange={handleChange} />
              <Field label="Newsletter Description" name="newsletter_description" value={formData.newsletter_description} onChange={handleChange} textarea />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Contact Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Address" name="address" value={formData.address} onChange={handleChange} textarea />
              <Field label="City" name="city" value={formData.city} onChange={handleChange} />
              <Field label="Country" name="country" value={formData.country} onChange={handleChange} />
              <Field label="Primary Phone" name="phone_primary" value={formData.phone_primary} onChange={handleChange} />
              <Field label="Secondary Phone" name="phone_secondary" value={formData.phone_secondary} onChange={handleChange} />
              <Field label="Primary Email" name="email_primary" value={formData.email_primary} onChange={handleChange} />
              <Field label="Secondary Email" name="email_secondary" value={formData.email_secondary} onChange={handleChange} />
              <Field label="Map Embed URL" name="map_url" value={formData.map_url} onChange={handleChange} textarea />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Facebook URL" name="facebook_url" value={formData.facebook_url} onChange={handleChange} />
              <Field label="Twitter URL" name="twitter_url" value={formData.twitter_url} onChange={handleChange} />
              <Field label="LinkedIn URL" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} />
              <Field label="Instagram URL" name="instagram_url" value={formData.instagram_url} onChange={handleChange} />
              <Field label="YouTube URL" name="youtube_url" value={formData.youtube_url} onChange={handleChange} />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Mail Settings (Contact + Newsletter)</h2>
            <p className="text-sm text-gray-600">
              Configure SMTP and recipients for both public forms. If recipient fields are blank, Primary Email is used.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Sender Name" name="mail_from_name" value={formData.mail_from_name} onChange={handleChange} />
              <Field label="Sender Email" name="mail_from_email" value={formData.mail_from_email} onChange={handleChange} type="email" />
              <Field label="SMTP Host" name="smtp_host" value={formData.smtp_host} onChange={handleChange} />
              <Field label="SMTP Port" name="smtp_port" value={formData.smtp_port} onChange={handleChange} />
              <Field label="SMTP Username" name="smtp_user" value={formData.smtp_user} onChange={handleChange} />
              <Field label="SMTP Password" name="smtp_password" value={formData.smtp_password} onChange={handleChange} type="password" />

              <div>
                <label htmlFor="smtp_secure" className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Secure
                </label>
                <select
                  id="smtp_secure"
                  name="smtp_secure"
                  value={formData.smtp_secure || 'false'}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
                >
                  <option value="false">false (STARTTLS / port 587)</option>
                  <option value="true">true (SSL / port 465)</option>
                </select>
              </div>

              <Field
                label="Contact Form Recipient Email"
                name="contact_form_recipient_email"
                value={formData.contact_form_recipient_email}
                onChange={handleChange}
                type="email"
              />
              <Field
                label="Newsletter Recipient Email"
                name="newsletter_recipient_email"
                value={formData.newsletter_recipient_email}
                onChange={handleChange}
                type="email"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#0396FF] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

function Field({ label, name, value, onChange, textarea = false, type = 'text' }) {
  return (
    <div className={textarea ? 'md:col-span-2' : ''}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
        />
      )}
    </div>
  )
}

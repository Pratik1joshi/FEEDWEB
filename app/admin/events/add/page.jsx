'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import FileUpload from '@/components/FileUpload';
import BasicRichTextEditor from '../../../../components/rich-text-editor/BasicRichTextEditor';
import { eventsApi } from '@/lib/api-services';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Link as LinkIcon,
  User,
  X
} from 'lucide-react';

export default function AddEvent() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    short_description: '',
    full_description: '',
    event_date: '',
    end_date: '',
    event_time: '',
    location: '',
    venue: '',
    organizer: '',
    category: '',
    status: 'upcoming',
    capacity: '',
    registered_attendees: 0,
    ticket_price: '',
    images: [],
    speakers: [],
    sponsors: [],
    agenda: [],
    tags: [],
    registration_url: '',
    contact_info: { email: '', phone: '' }
  });

  const [newTag, setNewTag] = useState('');
  const [newSpeaker, setNewSpeaker] = useState({ name: '', title: '', image: '', bio: '' });
  const [newAgendaItem, setNewAgendaItem] = useState({ time: '', title: '', speaker: '', description: '' });

  const eventCategories = [
    'Summit',
    'Workshop', 
    'Conference',
    'Training',
    'Webinar',
    'Networking',
    'Panel Discussion',
    'Seminar',
    'Symposium'
  ];

  const eventStatuses = [
    'upcoming',
    'ongoing',
    'completed',
    'cancelled'
  ];

  // Helper functions for array management
  const addArrayItem = (arrayName, template = '') => {
    if (arrayName === 'speakers') {
      setFormData(prev => ({
        ...prev,
        [arrayName]: [...prev[arrayName], { name: '', title: '', image: '', bio: '' }]
      }));
    } else if (arrayName === 'sponsors') {
      setFormData(prev => ({
        ...prev,
        [arrayName]: [...prev[arrayName], { name: '', logo: '', type: '', website: '' }]
      }));
    } else if (arrayName === 'agenda') {
      setFormData(prev => ({
        ...prev,
        [arrayName]: [...prev[arrayName], { 
          day: '', 
          sessions: [{ time: '', title: '', speaker: '' }] 
        }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [arrayName]: [...prev[arrayName], template]
      }));
    }
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const addAgendaSession = (agendaIndex) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.map((day, index) => 
        index === agendaIndex 
          ? { ...day, sessions: [...day.sessions, { time: '', title: '', speaker: '' }] }
          : day
      )
    }));
  };

  const removeAgendaSession = (agendaIndex, sessionIndex) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.map((day, index) => 
        index === agendaIndex 
          ? { ...day, sessions: day.sessions.filter((_, i) => i !== sessionIndex) }
          : day
      )
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    if (typeof formData[arrayName][index] === 'object' && arrayName !== 'agenda') {
      setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else if (arrayName === 'agenda' && field === 'day') {
      setFormData(prev => ({
        ...prev,
        agenda: prev.agenda.map((item, i) => 
          i === index ? { ...item, day: value } : item
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
      }));
    }
  };

  const handleSessionChange = (agendaIndex, sessionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.map((day, dayIndex) => 
        dayIndex === agendaIndex 
          ? {
              ...day,
              sessions: day.sessions.map((session, sessIndex) => 
                sessIndex === sessionIndex ? { ...session, [field]: value } : session
              )
            }
          : day
      )
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title) => {
    handleInputChange('title', title);
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      handleInputChange('slug', generateSlug(title));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Clean up arrays
      const cleanTags = formData.tags.filter(tag => tag.trim() !== '');
      const cleanImages = formData.images.filter(img => img.trim() !== '');
      const cleanSpeakers = formData.speakers.filter(speaker => speaker.name.trim() !== '');
      const cleanSponsors = formData.sponsors.filter(sponsor => sponsor.name.trim() !== '');
      const cleanAgenda = formData.agenda.filter(day => 
        day.day && day.sessions.some(session => session.title.trim() !== '')
      );
      
      // Validate that at least one image is provided
      if (cleanImages.length === 0) {
        alert('At least one image is required for the event.');
        setSaving(false);
        return;
      }
      
      const submitData = {
        ...formData,
        tags: cleanTags,
        images: cleanImages,
        speakers: cleanSpeakers,
        sponsors: cleanSponsors,
        agenda: cleanAgenda,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        registered_attendees: 0,
        featured: false
      };

      console.log('Submitting event data:', submitData);
      const response = await eventsApi.create(submitData);
      console.log('Event creation response:', response);

      if (response?.success || response?.id) {
        router.push('/admin/events');
      } else {
        throw new Error(response?.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert(`Failed to create event: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900">
                  Add New Event
                </h1>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="url-friendly-slug"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Event subtitle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {eventCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {eventStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Date & Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => handleInputChange('event_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time
                  </label>
                  <input
                    type="text"
                    value={formData.event_time}
                    onChange={(e) => handleInputChange('event_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="09:00 AM - 06:00 PM"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, Country"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Specific venue name"
                  />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organizer
                  </label>
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => handleInputChange('organizer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Organization or person"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Price
                  </label>
                  <input
                    type="text"
                    value={formData.ticket_price}
                    onChange={(e) => handleInputChange('ticket_price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Free Registration or $50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registered Attendees
                  </label>
                  <input
                    type="number"
                    value={formData.registeredAttendees}
                    onChange={(e) => handleInputChange('registeredAttendees', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ✨ Short Description *
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write a brief, engaging description that will appear in event listings..."
                required
              />
            </div>

            {/* Full Description */}
            <div className="border-t pt-6">
              <BasicRichTextEditor
                label="📝 Full Event Description"
                value={formData.full_description}
                onChange={(value) => handleInputChange('full_description', value)}
                placeholder="Provide detailed information about the event. Include agenda, what attendees will learn, special features, etc..."
                height="400px"
              />
            </div>

            {/* Images */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Images *</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('images')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Image
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">At least one image is required for the event.</p>
              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Event Image {index + 1} {index === 0 && <span className="text-red-500">*</span>}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('images', index)}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        disabled={formData.images.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <FileUpload
                      label=""
                      uploadType="image"
                      value={image}
                      onChange={(value) => handleArrayChange('images', index, null, value)}
                      placeholder="https://example.com/event-image.jpg"
                      required={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Speakers */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Speakers</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('speakers')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Speaker
                </button>
              </div>
              <div className="space-y-6">
                {formData.speakers.map((speaker, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={speaker.name}
                          onChange={(e) => handleArrayChange('speakers', index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Speaker name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={speaker.title}
                          onChange={(e) => handleArrayChange('speakers', index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Job title or organization"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FileUpload
                          label="Speaker Photo"
                          uploadType="image"
                          value={speaker.image}
                          onChange={(value) => handleArrayChange('speakers', index, 'image', value)}
                          placeholder="https://example.com/speaker.jpg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-start justify-between">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                          </label>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('speakers', index)}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            disabled={formData.speakers.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          value={speaker.bio}
                          onChange={(e) => handleArrayChange('speakers', index, 'bio', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Brief bio"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsors */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Event Sponsors</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('sponsors')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Sponsor
                </button>
              </div>
              <div className="space-y-6">
                {formData.sponsors.map((sponsor, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sponsor Name *
                        </label>
                        <input
                          type="text"
                          value={sponsor.name}
                          onChange={(e) => handleArrayChange('sponsors', index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Organization name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sponsor Type
                        </label>
                        <select
                          value={sponsor.type}
                          onChange={(e) => handleArrayChange('sponsors', index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Type</option>
                          <option value="Title Sponsor">Title Sponsor</option>
                          <option value="Gold Sponsor">Gold Sponsor</option>
                          <option value="Silver Sponsor">Silver Sponsor</option>
                          <option value="Bronze Sponsor">Bronze Sponsor</option>
                          <option value="Partner">Partner</option>
                          <option value="Supporting Partner">Supporting Partner</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <FileUpload
                          label="Sponsor Logo"
                          uploadType="image"
                          value={sponsor.logo}
                          onChange={(value) => handleArrayChange('sponsors', index, 'logo', value)}
                          placeholder="https://example.com/sponsor-logo.jpg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-start justify-between">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Website URL
                          </label>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('sponsors', index)}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            disabled={formData.sponsors.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="url"
                          value={sponsor.website}
                          onChange={(e) => handleArrayChange('sponsors', index, 'website', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://sponsor-website.com"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agenda */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Event Agenda</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('agenda')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Day
                </button>
              </div>
              <div className="space-y-6">
                {formData.agenda.map((day, dayIndex) => (
                  <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1 mr-3">
                        <input
                          type="text"
                          value={day.day}
                          onChange={(e) => handleArrayChange('agenda', dayIndex, 'day', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Day 1 - March 15"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => addAgendaSession(dayIndex)}
                          className="flex items-center px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Session
                        </button>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('agenda', dayIndex)}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          disabled={formData.agenda.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {day.sessions.map((session, sessionIndex) => (
                        <div key={sessionIndex} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded">
                          <div className="col-span-2">
                            <input
                              type="text"
                              value={session.time}
                              onChange={(e) => handleSessionChange(dayIndex, sessionIndex, 'time', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="09:00 - 10:00"
                            />
                          </div>
                          <div className="col-span-6">
                            <input
                              type="text"
                              value={session.title}
                              onChange={(e) => handleSessionChange(dayIndex, sessionIndex, 'title', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Session Title"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="text"
                              value={session.speaker}
                              onChange={(e) => handleSessionChange(dayIndex, sessionIndex, 'speaker', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Speaker Name"
                            />
                          </div>
                          <div className="col-span-1">
                            <button
                              type="button"
                              onClick={() => removeAgendaSession(dayIndex, sessionIndex)}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50"
                              disabled={day.sessions.length === 1}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('tags')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Tag
                </button>
              </div>
              <div className="space-y-3">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, null, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tag keyword"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tags', index)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={formData.tags.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration & Contact */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Registration & Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <LinkIcon className="w-4 h-4 inline mr-1" />
                    Registration Link
                  </label>
                  <input
                    type="text"
                    value={formData.registration_url}
                    onChange={(e) => handleInputChange('registration_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="#register or https://example.com/register"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_info?.email || ''}
                    onChange={(e) => handleInputChange('contact_info', { ...formData.contact_info, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="events@feed.org.np"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📞 Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_info?.phone || ''}
                    onChange={(e) => handleInputChange('contact_info', { ...formData.contact_info, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+977-1-1234567"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="border-t pt-6">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Event
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

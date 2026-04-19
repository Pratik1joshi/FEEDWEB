export const EVENT_FORM_INITIAL_STATE = {
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
  category: 'conference',
  status: 'upcoming',
  capacity: '',
  registered_attendees: 0,
  ticket_price: '',
  images: [],
  speakers: [],
  agenda: [],
  registration_url: '',
  contact_info: { email: '', phone: '' },
  featured: false,
  tags: []
};

export const EVENT_CATEGORIES = [
  'conference',
  'workshop',
  'seminar',
  'webinar',
  'networking'
];

export const EVENT_STATUSES = [
  'upcoming',
  'ongoing',
  'past',
  'cancelled'
];

export const validateEventForm = (formData) => {
  const errors = {};
  
  if (!formData.title?.trim()) {
    errors.title = 'Event title is required';
  }
  if (!formData.short_description?.trim()) {
    errors.short_description = 'Short description is required';
  }
  if (!formData.event_date) {
    errors.event_date = 'Event date is required';
  }
  if (!formData.location?.trim()) {
    errors.location = 'Location is required';
  }
  if (!formData.category) {
    errors.category = 'Category is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const cleanEventData = (formData) => {
  const cleaned = { ...formData };
  
  // MAP fields
  cleaned.description = cleaned.short_description?.trim();
  delete cleaned.short_description;

  // Format strings
  ['title', 'slug', 'subtitle', 'full_description', 'event_time', 'location', 'venue', 'organizer', 'ticket_price', 'registration_url'].forEach(field => {
    if (cleaned[field] && typeof cleaned[field] === 'string') {
      cleaned[field] = cleaned[field].trim() || null;
    }
  });

  // Slug fallback
  cleaned.slug = cleaned.slug || cleaned.title?.toLowerCase().replace(/[^a-z0-9\\s-]/g, '').replace(/\\s+/g, '-').replace(/-+/g, '-');
  
  // Dates
  cleaned.event_date = cleaned.event_date ? new Date(cleaned.event_date).toISOString() : null;
  cleaned.end_date = cleaned.end_date ? new Date(cleaned.end_date).toISOString() : null;

  // Numbers
  cleaned.capacity = parseInt(cleaned.capacity) || null;
  cleaned.registered_attendees = parseInt(cleaned.registered_attendees) || 0;

  // Arrays
  if (typeof cleaned.images === 'string') cleaned.images = cleaned.images ? [cleaned.images] : [];
  if (!Array.isArray(cleaned.images)) cleaned.images = [];
  
  if (!Array.isArray(cleaned.speakers)) cleaned.speakers = [];
  if (!Array.isArray(cleaned.agenda)) cleaned.agenda = [];
  if (!Array.isArray(cleaned.tags)) cleaned.tags = [];
  
  cleaned.speakers = cleaned.speakers.filter(s => s && (typeof s === 'string' ? s.trim() !== '' : (s.name || s.role)));
  cleaned.agenda = cleaned.agenda.filter(a => a && (a.time || a.title));
  
  // Contact Info
  if (!cleaned.contact_info || typeof cleaned.contact_info !== 'object') {
    cleaned.contact_info = {};
  }

  return cleaned;
};

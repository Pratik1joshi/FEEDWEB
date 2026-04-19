export const PRESS_FORM_INITIAL_STATE = {
  title: '',
  slug: '',
  content: '',
  release_date: '',
  contact_person: '',
  contact_email: '',
  contact_phone: '',
  images: [],
  attachments: [],
  is_published: true,
  featured: false
};

// If there are types/categories we need, we can define them
// The frontend used "type" but Backend doesn't have it. We'll map "type" to something else if needed, but for now we follow backend exactly.

export const validatePressForm = (formData) => {
  const errors = {};
  
  if (!formData.title?.trim()) {
    errors.title = 'Press Release title is required';
  }
  
  if (!formData.release_date) {
    errors.release_date = 'Release date is required';
  }

  if (!formData.content?.trim()) {
    errors.content = 'Content is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const cleanPressData = (formData) => {
  const cleaned = { ...formData };
  
  cleaned.title = cleaned.title?.trim();
  cleaned.slug = cleaned.slug?.trim() || cleaned.title?.toLowerCase().replace(/[^a-z0-9\\s-]/g, '').replace(/\\s+/g, '-').replace(/-+/g, '-');
  cleaned.content = cleaned.content?.trim();
  cleaned.release_date = cleaned.release_date ? new Date(cleaned.release_date).toISOString() : new Date().toISOString();
  
  cleaned.contact_person = cleaned.contact_person?.trim() || null;
  cleaned.contact_email = cleaned.contact_email?.trim() || null;
  cleaned.contact_phone = cleaned.contact_phone?.trim() || null;

  // Handle images array
  if (typeof cleaned.images === 'string') {
    cleaned.images = cleaned.images ? [cleaned.images] : [];
  }
  if (!Array.isArray(cleaned.images)) cleaned.images = [];
  
  // Handle attachments
  if (typeof cleaned.attachments === 'string') {
    cleaned.attachments = cleaned.attachments ? [cleaned.attachments] : [];
  }
  if (!Array.isArray(cleaned.attachments)) cleaned.attachments = [];
  
  // Strip empty objects if frontend sends them like [{name: '', url: ''}]
  cleaned.attachments = cleaned.attachments.filter(a => {
    if (typeof a === 'object') return a.url && a.name;
    return !!a;
  });

  return cleaned;
};

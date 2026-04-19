export const TIMELINE_FORM_INITIAL_STATE = {
  year: '',
  title: '',
  description: '',
  icon: 'Flag',
  category: 'Milestone',
  featured: false,
  is_active: true,
  sort_order: 0
};

export const TIMELINE_CATEGORIES = [
  'Milestone',
  'Award',
  'Project',
  'Event',
  'Partnership'
];

export function validateTimelineForm(data) {
  const errors = {};

  if (!data.year || isNaN(data.year)) {
    errors.year = 'Valid year is required (e.g. 2024)';
  }
  
  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }

  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function cleanTimelineData(data) {
  return {
    ...data,
    year: parseInt(data.year) || new Date().getFullYear(),
    title: data.title?.trim() || '',
    description: data.description?.trim() || '',
    icon: data.icon?.trim() || 'Flag',
    category: data.category?.trim() || 'Milestone',
    sort_order: parseInt(data.sort_order) || 0
  };
}

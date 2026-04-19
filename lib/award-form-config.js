export const AWARD_FORM_INITIAL_STATE = {
  title: '',
  description: '',
  awarding_organization: '',
  award_date: '',
  category: 'recognition',
  recognition_level: 'organizational',
  project_id: null,
  team_member_id: null,
  image_url: '',
  certificate_url: '',
  featured: false
};

export const AWARD_CATEGORIES = [
  'recognition',
  'grant',
  'certification',
  'achievement',
  'prize'
];

export const RECOGNITION_LEVELS = [
  'international',
  'national',
  'regional',
  'local',
  'organizational'
];

export function validateAwardForm(data) {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }

  if (!data.awarding_organization?.trim()) {
    errors.awarding_organization = 'Awarding organization is required';
  }

  if (!data.award_date) {
    errors.award_date = 'Award date is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function cleanAwardData(data) {
  return {
    ...data,
    title: data.title?.trim() || '',
    description: data.description?.trim() || '',
    awarding_organization: data.awarding_organization?.trim() || '',
    category: data.category || 'recognition',
    recognition_level: data.recognition_level || 'organizational',
    project_id: data.project_id || null,
    team_member_id: data.team_member_id || null,
    image_url: data.image_url?.trim() || '',
    certificate_url: data.certificate_url?.trim() || '',
    featured: Boolean(data.featured)
  };
}

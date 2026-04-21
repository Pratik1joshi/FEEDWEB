export const TEAM_FORM_INITIAL_STATE = {
  name: '',
  position: '',
  department: '',
  bio: '',
  expertise: [''],
  education: [''],
  languages: [''],
  awards: [''],
  image_url: '',
  email: '',
  linkedin: '',
  publications: 0,
  years_experience: 0,
  is_active: true,
  sort_order: 0
};

export const DEFAULT_TEAM_ROLE_OPTIONS = [
  'Chairman & Principal Researcher',
  'Chief Technical Officer',
  'Research Director',
  'GIS & Remote Sensing Specialist'
];

export const DEFAULT_TEAM_DEPARTMENT_OPTIONS = [
  'Leadership',
  'Engineering', 
  'Research',
  'Technology',
  'Operations'
];

// Backward-compatible export for existing imports.
export const DEPARTMENT_OPTIONS = DEFAULT_TEAM_DEPARTMENT_OPTIONS;

export const validateTeamForm = (formData) => {
  const errors = {};
  
  if (!formData.name?.trim()) errors.name = 'Full Name is required';
  if (!formData.position?.trim()) errors.position = 'Position is required';
  if (!formData.department?.trim()) errors.department = 'Department is required';
  if (!formData.image_url?.trim()) errors.image_url = 'Profile Image is required';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const cleanTeamData = (formData) => {
  return {
    ...formData,
    expertise: formData.expertise ? formData.expertise.filter(item => typeof item === 'string' && item.trim() !== '') : [],
    education: formData.education ? formData.education.filter(item => typeof item === 'string' && item.trim() !== '') : [],
    languages: formData.languages ? formData.languages.filter(item => typeof item === 'string' && item.trim() !== '') : [],
    awards: formData.awards ? formData.awards.filter(item => typeof item === 'string' && item.trim() !== '') : [],
    publications: parseInt(formData.publications) || 0,
    years_experience: parseInt(formData.years_experience) || 0
  };
};

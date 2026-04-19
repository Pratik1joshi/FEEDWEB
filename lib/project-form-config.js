// Shared configuration for project forms (add and edit)
// This ensures both forms use identical structure and field names

export const PROJECT_FORM_INITIAL_STATE = {
  // Basic Information
  title: '',
  slug: '',
  description: '',
  fullDescription: '',
  location: '',
  status: 'Planning',
  category: '',
  
  // Project Details
  sector: '',
  startDate: '',
  completionDate: '',
  budget: '',
  duration: '',
  teamSize: '',
  clientPartners: '',
  
  // Geographic Data
  province: '',
  district: '',
  coordinates: { lat: '', lng: '' },
  
  // Media & Content
  images: [],
  featured: false,
  
  // Arrays for dynamic content
  tags: [],
  goals: [],
  outcomes: [],
  challenges: [],
  keyMetrics: [],
  timeline: [],
  relatedProjects: [],
  technologies: [],
  partners: [],
  partnerships: [],
  innovations: [],
  references: [],
  
  // Impact & Sustainability
  sustainability: '',
  environmentalImpact: '',
  socialImpact: '',
  impactMetrics: {
    beneficiaries: '',
    directBeneficiaries: '',
    indirectBeneficiaries: '',
    areaKm2: '',
    co2Reduction: '',
    energyGenerated: '',
    communitiesServed: '',
    jobsCreated: '',
    capacityBuilt: ''
  },
  
  // Additional fields
  riskAssessment: '',
  methodology: '',
  monitoringFramework: '',
  type: 'detailed' // Default to detailed project
}

export const PROJECT_ARRAY_STATE = {
  newGoal: '',
  newOutcome: '',
  newChallenge: '',
  newKeyMetric: { label: '', value: '' },
  newTimelineItem: { 
    date: '', 
    title: '', 
    description: '', 
    status: 'completed' 
  },
  newTechnology: '',
  newPartner: '',
  newInnovation: '',
  newTag: ''
}

export const SECTOR_OPTIONS = [
  'Renewable Energy',
  'Energy Access',
  'Climate Finance',
  'Policy & Governance',
  'Capacity Building',
  'Research & Development',
  'Community Development'
]

export const STATUS_OPTIONS = ['Planning', 'Ongoing', 'Completed', 'On Hold']

export const CATEGORY_OPTIONS = [
  'Solar Energy',
  'Wind Energy',
  'Hydropower',
  'Energy Storage',
  'Grid Infrastructure',
  'Energy Efficiency',
  'Policy Development',
  'Capacity Building',
  'Community Development',
  'Research & Innovation'
]

export const PROVINCE_OPTIONS = [
  'Province 1',
  'Madhesh Province',
  'Bagmati Province',
  'Gandaki Province',
  'Lumbini Province',
  'Karnali Province',
  'Sudurpashchim Province'
]

// Validation rules
export const PROJECT_VALIDATION_RULES = {
  required: ['title', 'description', 'location', 'category', 'sector', 'budget'],
  minLength: {
    title: 3,
    description: 10
  },
  maxLength: {
    title: 255,
    description: 500
  }
}

// Helper functions for array management
export const arrayHelpers = {
  addToArray: (formData, setFormData, field, value, setter) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }))
      setter('')
    }
  },
  
  removeFromArray: (formData, setFormData, field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }))
  },
  
  addKeyMetric: (formData, setFormData, metric, setter) => {
    if (metric.label.trim() && metric.value.trim()) {
      setFormData(prev => ({
        ...prev,
        keyMetrics: [...(prev.keyMetrics || []), { ...metric }]
      }))
      setter({ label: '', value: '' })
    }
  },
  
  addTimelineItem: (formData, setFormData, item, setter) => {
    if (item.date && item.title.trim()) {
      setFormData(prev => ({
        ...prev,
        timeline: [...(prev.timeline || []), { ...item }]
      }))
      setter({ date: '', title: '', description: '', status: 'completed' })
    }
  }
}

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Validate form data
export const validateProjectForm = (formData, projectType = 'detailed') => {
  const errors = {}
  
  // Common validations
  if (!formData.title?.trim()) errors.title = 'Title is required'
  if (!formData.description?.trim()) errors.description = 'Description is required'
  if (!formData.location?.trim()) errors.location = 'Location is required'
  if (!formData.category?.trim()) errors.category = 'Category is required'
  
  // Project type specific validations
  if (projectType === 'detailed') {
    if (!formData.sector?.trim()) errors.sector = 'Sector is required'
    if (!formData.budget?.trim()) errors.budget = 'Budget is required'
  } else if (projectType === 'map') {
    if (!formData.coordinates?.lat || !formData.coordinates?.lng) {
      errors.coordinates = 'Coordinates are required for map projects'
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

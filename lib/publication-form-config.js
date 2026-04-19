export const PUBLICATION_FORM_INITIAL_STATE = {
  title: '',
  subtitle: '',
  type: '',
  category: '',
  publication_date: '',
  authors: [''],
  abstract: '',
  description: '',
  full_content: '',
  download_url: '',
  image_url: '',
  tags: [''],
  pages: 0,
  language: 'English',
  doi: '',
  citations: 0,
  downloads: 0,
  featured: false,
  is_public: true,
  slug: ''
};

export const PUBLICATION_TYPES = [
  'Research Report',
  'Policy Brief', 
  'White Paper',
  'Case Study',
  'Annual Report',
  'Working Paper',
  'Journal Article',
  'Book',
  'Book Chapter',
  'Conference Proceeding',
  'Manual/Guideline'
];

export const CATEGORY_OPTIONS = [
  'Energy',
  'Policy',
  'Transportation',
  'Community Development',
  'Finance',
  'Energy Access',
  'Climate Change',
  'Urban Planning',
  'Environmental Policy',
  'Sustainable Infrastructure',
  'Green Financing',
  'Social Inclusion',
  'Disaster Management',
  'Clean Technology',
  'Research and Development'
];

export const LANGUAGE_OPTIONS = [
  'English',
  'Nepali',
  'Hindi',
  'Spanish',
  'French',
  'German'
];

export const validatePublicationForm = (formData) => {
  const errors = {};
  
  if (!formData.title?.trim()) errors.title = 'Title is required';
  if (!formData.type?.trim()) errors.type = 'Publication Type is required';
  if (!formData.category?.trim()) errors.category = 'Category is required';
  if (!formData.publication_date?.trim()) errors.publication_date = 'Publication Date is required';
  if (!formData.authors || formData.authors.filter(a => typeof a === 'string' && a.trim() !== '').length === 0) errors.authors = 'At least one Author is required';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const cleanPublicationData = (formData) => {
  return {
    ...formData,
    authors: formData.authors ? formData.authors.filter(item => typeof item === 'string' && item.trim() !== '') : [],
    tags: formData.tags ? formData.tags.filter(item => typeof item === 'string' && item.trim() !== '') : [],
    pages: parseInt(formData.pages) || 0,
    citations: parseInt(formData.citations) || 0,
    downloads: parseInt(formData.downloads) || 0
  };
};

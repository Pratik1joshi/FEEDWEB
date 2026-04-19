export const NEWS_FORM_INITIAL_STATE = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: '',
  category: 'News',
  publication_date: new Date().toISOString().split('T')[0],
  image_url: '',
  images: [],
  tags: [''],
  featured: false,
  is_published: true,
  views: 0,
  meta_title: '',
  meta_description: ''
};

export const NEWS_CATEGORIES = [
  'News',
  'Update',
  'Announcement',
  'Press Release',
  'Article',
  'Blog'
];

export function validateNewsForm(data) {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }

  if (!data.content?.trim()) {
    errors.content = 'Content is required';
  }

  if (!data.publication_date) {
    errors.publication_date = 'Publication date is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function cleanNewsData(data) {
  return {
    ...data,
    tags: Array.isArray(data.tags) 
      ? data.tags.filter(tag => tag && tag.trim() !== '') 
      : [],
    images: Array.isArray(data.images)
      ? data.images.filter(img => img && img.trim() !== '')
      : [],
    title: data.title?.trim() || '',
    excerpt: data.excerpt?.trim() || '',
    content: data.content?.trim() || '',
    author: data.author?.trim() || '',
    category: data.category?.trim() || 'News',
    image_url: data.image_url?.trim() || '',
    meta_title: data.meta_title?.trim() || '',
    meta_description: data.meta_description?.trim() || '',
    featured: Boolean(data.featured),
    is_published: Boolean(data.is_published)
  };
}

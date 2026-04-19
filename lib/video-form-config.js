export const VIDEO_FORM_INITIAL_STATE = {
  title: '',
  description: '',
  video_url: '',
  thumbnail_url: '',
  duration: '',
  category: '',
  youtube_id: '',
  vimeo_id: '',
  tags: [''],
  featured: false,
  is_active: true,
  project_id: '',
  event_id: ''
};

export const VIDEO_CATEGORIES = [
  'Documentary',
  'Interview',
  'Project Update',
  'Webinar',
  'Tutorial',
  'Animation',
  'Event Coverage'
];

export function validateVideoForm(data) {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }
  
  if (!data.video_url?.trim() && !data.youtube_id?.trim() && !data.vimeo_id?.trim()) {
    errors.video_url = 'At least one video source (URL, YouTube ID, or Vimeo ID) is required';
  }

  if (!data.category?.trim()) {
    errors.category = 'Category is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function cleanVideoData(data) {
  return {
    ...data,
    tags: Array.isArray(data.tags) 
      ? data.tags.filter(tag => tag && tag.trim() !== '') 
      : [],
    title: data.title?.trim() || '',
    description: data.description?.trim() || '',
    video_url: data.video_url?.trim() || '',
    thumbnail_url: data.thumbnail_url?.trim() || '',
    duration: data.duration?.trim() || '',
    category: data.category?.trim() || '',
    youtube_id: data.youtube_id?.trim() || '',
    vimeo_id: data.vimeo_id?.trim() || ''
  };
}

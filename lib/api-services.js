import { apiClient } from './api';

// Services API
export const servicesApi = {
  getAll: (params = {}) => apiClient.get('/services', params),
  getFeatured: (limit = 6) => apiClient.get('/services/featured', { limit }),
  search: (query, params = {}) => apiClient.get('/services/search', { q: query, ...params }),
  getById: (id) => apiClient.get(`/services/${id}`),
  create: (data) => apiClient.post('/services', data),
  update: (id, data) => apiClient.put(`/services/${id}`, data),
  delete: (id) => apiClient.delete(`/services/${id}`),
};

// Projects API
export const projectsApi = {
  getAll: (params = {}) => apiClient.get('/projects', params),
  getFeatured: (limit = 6) => apiClient.get('/projects/featured', { limit }),
  getStats: () => apiClient.get('/projects/stats'),
  search: (query, params = {}) => apiClient.get('/projects/search', { q: query, ...params }),
  getByCategory: (category, params = {}) => apiClient.get(`/projects/category/${category}`, params),
  getByProvince: (province, params = {}) => apiClient.get(`/projects/province/${province}`, params),
  getByLocation: (lat, lng, radius = 50) => apiClient.get(`/projects/location/${lat}/${lng}`, { radius }),
  getById: (id) => apiClient.get(`/projects/${id}`),
  getBySlug: (slug) => apiClient.get(`/projects/${slug}`),
  create: (data) => apiClient.post('/projects', data),
  update: (slug, data) => apiClient.put(`/projects/${slug}`, data),
  delete: (id) => apiClient.delete(`/projects/${id}`),
};

// Events API
export const eventsApi = {
  getAll: (params = {}) => apiClient.get('/events', params),
  getUpcoming: (params = {}) => apiClient.get('/events/upcoming', params),
  getPast: (params = {}) => apiClient.get('/events/past', params),
  getFeatured: (limit = 5) => apiClient.get('/events/featured', { limit }),
  getStats: () => apiClient.get('/events/stats'),
  search: (query, params = {}) => apiClient.get('/events/search', { q: query, ...params }),
  getByDateRange: (start, end, params = {}) => apiClient.get(`/events/date-range/${start}/${end}`, params),
  register: (id) => apiClient.post(`/events/${id}/register`),
  getById: (id) => apiClient.get(`/events/${id}`),
  create: (data) => apiClient.post('/events', data),
  update: (id, data) => apiClient.put(`/events/${id}`, data),
  delete: (id) => apiClient.delete(`/events/${id}`),
};

// Publications API
export const publicationsApi = {
  getAll: (params = {}) => apiClient.get('/publications', params),
  getFeatured: (limit = 6) => apiClient.get('/publications/featured', { limit }),
  getPopular: (limit = 10) => apiClient.get('/publications/popular', { limit }),
  getRecent: (limit = 10) => apiClient.get('/publications/recent', { limit }),
  getStats: () => apiClient.get('/publications/stats'),
  search: (query, params = {}) => apiClient.get('/publications/search', { q: query, ...params }),
  getByType: (type, params = {}) => apiClient.get(`/publications/type/${type}`, params),
  getByCategory: (category, params = {}) => apiClient.get(`/publications/category/${category}`, params),
  getByAuthor: (author, params = {}) => apiClient.get(`/publications/author/${author}`, params),
  trackDownload: (id) => apiClient.post(`/publications/${id}/download`),
  getById: (id) => apiClient.get(`/publications/${id}`),
  create: (data) => apiClient.post('/publications', data),
  update: (id, data) => apiClient.put(`/publications/${id}`, data),
  delete: (id) => apiClient.delete(`/publications/${id}`),
};

// Team API
export const teamApi = {
  getAll: (params = {}) => apiClient.get('/team', params),
  getByDepartment: (department, params = {}) => apiClient.get(`/team/department/${department}`, params),
  getBySlug: (slug) => apiClient.get(`/team/slug/${slug}`),
  search: (query, params = {}) => apiClient.get('/team/search', { q: query, ...params }),
  getById: (id) => apiClient.get(`/team/${id}`),
  create: (data) => apiClient.post('/team', data),
  update: (id, data) => apiClient.put(`/team/${id}`, data),
  delete: (id) => apiClient.delete(`/team/${id}`),
};

// News/Blog API
export const newsApi = {
  getAll: (params = {}) => apiClient.get('/news', params),
  getFeatured: (limit = 5) => apiClient.get('/news/featured', { limit }),
  getRecent: (limit = 10) => apiClient.get('/news/recent', { limit }),
  getPopular: (limit = 10) => apiClient.get('/news/popular', { limit }),
  search: (query, params = {}) => apiClient.get('/news/search', { q: query, ...params }),
  getByCategory: (category, params = {}) => apiClient.get(`/news/category/${category}`, params),
  getById: (id) => apiClient.get(`/news/${id}`),
  create: (data) => apiClient.post('/news', data),
  update: (id, data) => apiClient.put(`/news/${id}`, data),
  delete: (id) => apiClient.delete(`/news/${id}`),
};

// Blog API
export const blogApi = {
  getAll: (params = {}) => apiClient.get('/blog', params),
  getById: (id) => apiClient.get(`/blog/${id}`),
  getBySlug: (slug) => apiClient.get(`/blog/slug/${encodeURIComponent(slug)}`),
  getFeatured: (limit = 1) => apiClient.get('/blog', { featured: 'true', limit }),
  create: (data) => apiClient.post('/blog', data),
  update: (id, data) => apiClient.put(`/blog/${id}`, data),
  delete: (id) => apiClient.delete(`/blog/${id}`),
  toggleFeatured: (id) => apiClient.post(`/blog/${id}/toggle-featured`),
};

// Site Settings API
export const siteSettingsApi = {
  get: () => apiClient.get('/site-settings'),
  update: (data) => apiClient.put('/site-settings', data),
};

// Timeline API
export const timelineApi = {
  getAll: (params = {}) => apiClient.get('/timeline', params),
  getFeatured: (limit = 5) => apiClient.get('/timeline/featured', { limit }),
  getCategories: () => apiClient.get('/timeline/categories'),
  search: (query, params = {}) => apiClient.get('/timeline/search', { q: query, ...params }),
  getById: (id) => apiClient.get(`/timeline/${id}`),
  create: (data) => apiClient.post('/timeline', data),
  update: (id, data) => apiClient.put(`/timeline/${id}`, data),
  delete: (id) => apiClient.delete(`/timeline/${id}`),
};

// Authentication API
export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  forgotPassword: (payload) => apiClient.post('/auth/forgot-password', payload),
  resetPassword: (payload) => apiClient.post('/auth/reset-password', payload),
  getProfile: () => apiClient.get('/auth/profile'),
  changePassword: (passwords) => apiClient.put('/auth/change-password', passwords),
  getAdmins: () => apiClient.get('/auth/admins'),
  createAdmin: (adminData) => apiClient.post('/auth/admins', adminData),
  deactivateAdmin: (id) => apiClient.delete(`/auth/admins/${id}`),
  logout: () => {
    apiClient.clearToken();
    return Promise.resolve({ success: true });
  },
};

// File Upload API
export const uploadApi = {
  single: (file) => apiClient.uploadFile(file, false),
  multiple: (files) => apiClient.uploadFile(files, true),
  list: () => apiClient.get('/upload/list'),
  delete: (filename) => apiClient.delete(`/upload/${filename}`),
};

// Videos API
export const videosApi = {
  getAll: (params = {}) => apiClient.get('/videos', params),
  getFeatured: (limit = 10) => apiClient.get('/videos/featured', { limit }),
  getCategories: () => apiClient.get('/videos/categories'),
  search: (query, params = {}) => apiClient.get('/videos/search', { q: query, ...params }),
  getById: (id) => apiClient.get(`/videos/${id}`),
  create: (data) => apiClient.post('/videos', data),
  update: (id, data) => apiClient.put(`/videos/${id}`, data),
  delete: (id) => apiClient.delete(`/videos/${id}`),
};

// Awards API
export const awardsApi = {
  getAll: (params = {}) => apiClient.get('/awards', params),
  getFeatured: (limit = 10) => apiClient.get('/awards/featured', { limit }),
  getCategories: () => apiClient.get('/awards/categories'),
  getRecognitionLevels: () => apiClient.get('/awards/recognition-levels'),
  search: (query, params = {}) => apiClient.get('/awards/search', { q: query, ...params }),
  getById: (id) => apiClient.get(`/awards/${id}`),
  create: (data) => apiClient.post('/awards', data),
  update: (id, data) => apiClient.put(`/awards/${id}`, data),
  delete: (id) => apiClient.delete(`/awards/${id}`),
};

// Pages API
export const pagesApi = {
  getAll: () => apiClient.get("/pages"),
  getBySlug: (slug) => apiClient.get(`/pages/${slug}`),
  update: (slug, data) => apiClient.put(`/pages/${slug}`, data)
};

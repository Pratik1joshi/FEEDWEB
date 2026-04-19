// API configuration and base client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api');

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle rate limiting specifically
      if (response.status === 429) {
        console.warn(`Rate limited on ${endpoint}. Please wait before retrying.`);
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      
      if (!response.ok) {
        // Try to parse JSON error, but handle cases where response isn't JSON
        let errorMessage = 'API request failed';
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch (parseError) {
          // If response isn't JSON, use the response text
          const errorText = await response.text();
          if (errorText.includes('Too many requests')) {
            errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
          } else {
            errorMessage = errorText.substring(0, 100) || 'Unknown error occurred';
          }
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async uploadFile(file, isMultiple = false) {
    const formData = new FormData();
    if (isMultiple) {
      formData.append('files', file);
    } else {
      formData.append('file', file);
    }

    const endpoint = isMultiple ? '/upload/multiple' : '/upload/single';
    const token = this.getToken();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'File upload failed');
    }

    return await response.json();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Projects API
export const projectsApi = {
  getAll: (params = {}) => apiClient.get('/projects', params),
  getFeatured: (limit = 6, type) => {
    const params = { limit };
    if (type) params.type = type;
    return apiClient.get('/projects/featured', params);
  },
  getById: (id) => apiClient.get(`/projects/${id}`),
  search: (query, filters = {}) => apiClient.get('/projects/search', { q: query, ...filters }),
  getByCategory: (category, params = {}) => apiClient.get(`/projects/category/${encodeURIComponent(category)}`, params),
  getByProvince: (province, params = {}) => apiClient.get(`/projects/province/${encodeURIComponent(province)}`, params),
  getByLocation: (lat, lng, radius = 50) => apiClient.get(`/projects/location/${lat}/${lng}`, { radius }),
  getStats: () => apiClient.get('/projects/stats'),
  create: (data) => apiClient.post('/projects', data),
  update: (id, data) => apiClient.put(`/projects/${id}`, data),
  delete: (id) => apiClient.delete(`/projects/${id}`)
};

// Events API
export const eventsApi = {
  getAll: (params = {}) => apiClient.get('/events', params),
  getFeatured: (limit = 3) => apiClient.get('/events/featured', { limit }),
  getUpcoming: (limit = 10) => apiClient.get('/events/upcoming', { limit }),
  getById: (id) => apiClient.get(`/events/${id}`),
  create: (data) => apiClient.post('/events', data),
  update: (id, data) => apiClient.put(`/events/${id}`, data),
  delete: (id) => apiClient.delete(`/events/${id}`)
};

// Services API
export const servicesApi = {
  getAll: (params = {}) => apiClient.get('/services', params),
  getFeatured: (limit = 6) => apiClient.get('/services/featured', { limit }),
  getById: (id) => apiClient.get(`/services/${id}`),
  create: (data) => apiClient.post('/services', data),
  update: (id, data) => apiClient.put(`/services/${id}`, data),
  delete: (id) => apiClient.delete(`/services/${id}`)
};

// Team API
export const teamApi = {
  getAll: (params = {}) => apiClient.get('/team', params),
  getById: (id) => apiClient.get(`/team/${id}`),
  create: (data) => apiClient.post('/team', data),
  update: (id, data) => apiClient.put(`/team/${id}`, data),
  delete: (id) => apiClient.delete(`/team/${id}`)
};

// Publications API
export const publicationsApi = {
  getAll: (params = {}) => apiClient.get('/publications', params),
  getFeatured: (limit = 6) => apiClient.get('/publications/featured', { limit }),
  getById: (id) => apiClient.get(`/publications/${id}`),
  create: (data) => apiClient.post('/publications', data),
  update: (id, data) => apiClient.put(`/publications/${id}`, data),
  delete: (id) => apiClient.delete(`/publications/${id}`)
};

// Timeline API
export const timelineApi = {
  getAll: (params = {}) => apiClient.get('/timeline', params),
  getById: (id) => apiClient.get(`/timeline/${id}`),
  create: (data) => apiClient.post('/timeline', data),
  update: (id, data) => apiClient.put(`/timeline/${id}`, data),
  delete: (id) => apiClient.delete(`/timeline/${id}`)
};

// News API
export const newsApi = {
  getAll: (params = {}) => apiClient.get('/news', params),
  getFeatured: (limit = 6) => apiClient.get('/news/featured', { limit }),
  getById: (id) => apiClient.get(`/news/${id}`),
  create: (data) => apiClient.post('/news', data),
  update: (id, data) => apiClient.put(`/news/${id}`, data),
  delete: (id) => apiClient.delete(`/news/${id}`)
};

// Auth API
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
    return Promise.resolve();
  },
  checkAuth: () => apiClient.get('/auth/profile'),
  verifyToken: () => apiClient.post('/auth/verify-token')
};

// Upload API
export const uploadApi = {
  single: (file) => apiClient.uploadFile(file, false),
  multiple: (files) => apiClient.uploadFile(files, true)
};

// Health check function
export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return await response.json();
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  } else if (error.message.includes('404')) {
    return 'Resource not found.';
  } else if (error.message.includes('400')) {
    return 'Bad request. Please check your input.';
  } else if (error.message.includes('401')) {
    return 'Unauthorized. Please login again.';
  } else if (error.message.includes('403')) {
    return 'Access forbidden.';
  } else {
    return 'Something went wrong. Please try again.';
  }
};

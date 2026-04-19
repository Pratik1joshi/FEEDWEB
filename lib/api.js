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

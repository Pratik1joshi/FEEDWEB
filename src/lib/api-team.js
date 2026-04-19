import { apiClient } from './api';

// Team API
export const teamApi = {
  getAll: (params = {}) => apiClient.get('/team', params),
  getById: (id) => apiClient.get(`/team/${id}`),
  getByDepartment: (department, params = {}) => apiClient.get(`/team/department/${department}`, params),
  search: (query, params = {}) => apiClient.get('/team/search', { q: query, ...params }),
  create: (data) => apiClient.post('/team', data),
  update: (id, data) => apiClient.put(`/team/${id}`, data),
  delete: (id) => apiClient.delete(`/team/${id}`),
};

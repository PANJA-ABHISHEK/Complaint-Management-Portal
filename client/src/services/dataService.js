import api from './api';

export const complaintService = {
  create: (formData) => api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
  assign: (id, data) => api.put(`/complaints/${id}/assign`, data),
  addNote: (id, data) => api.put(`/complaints/${id}/notes`, data),
  resolve: (id, formData) => api.put(`/complaints/${id}/resolve`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  close: (id) => api.put(`/complaints/${id}/close`),
  delete: (id) => api.delete(`/complaints/${id}`),
  submitFeedback: (id, data) => api.post(`/complaints/${id}/feedback`, data),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleBlockUser: (id) => api.put(`/admin/users/${id}/block`),
  changeUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  updateDepartment: (id, data) => api.put(`/admin/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),
  getReports: (params) => api.get('/admin/reports', { params }),
  getFeedback: (params) => api.get('/admin/feedback', { params }),
};

export const notificationService = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const authService = {
  updateProfile: (data) => api.put('/auth/update-profile', data),
  updateAvatar: (formData) => api.put('/auth/update-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.put(`/auth/reset-password/${token}`, data),
};

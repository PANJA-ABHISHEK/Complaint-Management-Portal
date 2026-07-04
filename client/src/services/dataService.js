import api from './api';

export const complaintService = {
  createComplaint: (formData) => api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyComplaints: (params) => api.get('/complaints/my', { params }),
  getAssignedComplaints: (params) => api.get('/complaints/assigned', { params }),
  getAllComplaints: (params) => api.get('/complaints', { params }),
  getComplaintById: (id) => api.get(`/complaints/${id}`),
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
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllComplaints: (params) => api.get('/admin/complaints', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
  getOfficers: () => api.get('/admin/users', { params: { role: 'officer' } }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleBlockUser: (id) => api.put(`/admin/users/${id}/block`),
  changeUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  assignComplaint: (id, officerId) => api.put(`/admin/complaints/${id}/assign`, { officerId }),
  updateComplaintStatus: (id, data) => api.put(`/admin/complaints/${id}/status`, data),
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  updateDepartment: (id, data) => api.put(`/admin/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),
  getReports: (params) => api.get('/admin/reports', { params }),
  getFeedback: (params) => api.get('/admin/feedback', { params }),
};

export const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export const authService = {
  updateProfile: (data) => api.put('/auth/update-profile', data),
  uploadAvatar: (formData) => api.put('/auth/update-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.put(`/auth/reset-password/${token}`, data),
};

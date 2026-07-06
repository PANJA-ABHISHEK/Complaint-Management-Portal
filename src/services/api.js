import { mockDb } from './mockDb';

// This API wrapper simulates a real Axios API client
// but routes everything through the local mockDb.

export const api = {
  auth: {
    login: (email, password) => mockDb.login(email, password),
    register: (data) => mockDb.register(data),
    me: () => {
      const token = localStorage.getItem('cm_token');
      if (!token) return Promise.reject(new Error('No token'));
      return mockDb.getCurrentUser(token);
    },
    logout: () => {
      localStorage.removeItem('cm_token');
      return Promise.resolve();
    }
  },
  complaints: {
    getAll: (userId = null) => mockDb.getComplaints(userId),
    getById: (id) => mockDb.getComplaintById(id),
    create: (data) => {
      const token = localStorage.getItem('cm_token');
      if (!token) return Promise.reject(new Error('Unauthorized'));
      const userId = token.split('mock_token_')[1];
      return mockDb.createComplaint(data, userId);
    },
    updateStatus: (id, status) => mockDb.updateComplaintStatus(id, status)
  },
  stats: {
    get: (isAdmin = false) => {
      const token = localStorage.getItem('cm_token');
      const userId = token ? token.split('mock_token_')[1] : null;
      return mockDb.getStats(isAdmin, userId);
    }
  }
};

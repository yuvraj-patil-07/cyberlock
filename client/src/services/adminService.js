import api from './api';

export const adminService = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: () => api.get('/admin/users'),
  getChallenges: () => api.get('/admin/challenges'),
};

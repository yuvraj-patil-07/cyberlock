import api from './api';

export const profileService = {
  getProfile: () => api.get('/profile'),
  getSkills: () => api.get('/profile/skills'),
  getBadges: () => api.get('/profile/badges'),
  getHistory: () => api.get('/profile/history'),
  getCyberDNA: () => api.get('/profile/dna'),
  getRiskScore: () => api.get('/profile/risk-score'),
};

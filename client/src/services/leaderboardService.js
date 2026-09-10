import api from './api';

export const leaderboardService = {
  getLeaderboard: (category = 'score') => api.get(`/leaderboard?category=${category}`),
};

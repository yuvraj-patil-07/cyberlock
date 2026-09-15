import api from './api';

export const gameService = {
  getProgress: () => api.get('/game/progress'),
  startGame: (room = 1) => api.post('/game/start', { room }),
  resetGame: () => api.post('/game/reset'),
  submitAttempt: (challengeId, data) => api.post('/game/attempt', { challengeId, ...data }),
  getChallenges: (roomId, params = {}) => api.get('/challenges', { params: { room: roomId, ...params } }),
  getChallengeById: (id) => api.get(`/challenges/${id}`),
  completeRoom: (roomId, stars = 1) => api.post(`/game/complete-room/${roomId}`, { stars }),
  getCyberDNA: () => api.get('/game/cyber-dna'),
  submitCustomScore: (data) => api.post('/game/custom-score', data),
};


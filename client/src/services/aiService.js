import api from './api';

export const aiService = {
  generateChallenge: (category, difficulty, playerWeakness) =>
    api.post('/ai/generate-challenge', { category, difficulty, playerWeakness }),
  getExplanation: (challengeId, answer, reasoning = [], evidenceFound = [], isCorrect = false) =>
    api.post('/ai/explain', { challengeId, answer, reasoning, evidenceFound, isCorrect }),
  getHint: (challengeId, hintLevel = 1, evidenceFound = []) =>
    api.post('/ai/hint', { challengeId, hintLevel, evidenceFound }),
  analyzePerformance: () =>
    api.post('/ai/analyze-performance'),
  getRecommendation: () =>
    api.get('/ai/recommend'),
};

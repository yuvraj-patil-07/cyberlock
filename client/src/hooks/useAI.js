import { useState } from 'react';
import api from '../services/api';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const getHint = async (challengeId) => {
    setLoading(true);
    try {
      const res = await api.post('/ai/hint', { challengeId });
      setResponse(res.data.hint);
      return res.data.hint;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const analyzePerformance = async (sessionData) => {
    setLoading(true);
    try {
      const res = await api.post('/ai/analyze', sessionData);
      return res.data;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, response, getHint, analyzePerformance };
};

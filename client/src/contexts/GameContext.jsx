import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameSession, setGameSession] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/game/progress');
      setProgress(res.data);
    } catch (err) {
      console.error('Failed to load progress', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const startGame = async () => {
    try {
      setLoading(true);
      const res = await api.post('/game/start');
      setGameSession(res.data.session);
      await loadProgress();
    } catch (err) {
      console.error('Failed to start game', err);
    } finally {
      setLoading(false);
    }
  };

  const resetGame = async () => {
    try {
      setLoading(true);
      await api.post('/game/reset');
      setGameSession(null);
      await loadProgress();
    } catch (err) {
      console.error('Failed to reset game', err);
    } finally {
      setLoading(false);
    }
  };

  const submitAttempt = async (challengeId, answerData) => {
    try {
      const res = await api.post('/game/attempt', { challengeId, ...answerData });
      await loadProgress();
      return res.data;
    } catch (err) {
      console.error('Failed to submit attempt', err);
      throw err;
    }
  };

  return (
    <GameContext.Provider value={{ 
      gameSession, progress, currentRoom, challenges, loading, 
      setCurrentRoom, setChallenges, loadProgress, startGame, resetGame, submitAttempt 
    }}>
      {children}
    </GameContext.Provider>
  );
};

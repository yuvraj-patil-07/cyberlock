import { useState, useEffect } from 'react';
import { useGame } from './useGame';

export const useChallenge = (initialChallenge) => {
  const [challenge, setChallenge] = useState(initialChallenge);
  const [timeLeft, setTimeLeft] = useState(initialChallenge?.timeLimit || 60);
  const [hintsUsed, setHintsUsed] = useState(0);
  const { submitAttempt } = useGame();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return { challenge, timeLeft, hintsUsed, setHintsUsed, submitAttempt };
};

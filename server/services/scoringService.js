/**
 * CYBERLOCK Scoring Engine
 * Authority on XP, Trust Score, Levels, and Cyber Risk calculations
 */

export const calculateAttemptScore = ({
  isCorrect,
  evidenceFound = [],
  reasoning = [],
  hintsUsed = 0,
  responseTime = 15,
  difficulty = 'intermediate'
}) => {
  let baseXP = 0;
  let trustDelta = 0;

  const difficultyMultipliers = {
    beginner: 1.0,
    intermediate: 1.25,
    advanced: 1.5,
    expert: 2.0
  };

  const multiplier = difficultyMultipliers[difficulty] || 1.0;

  if (isCorrect) {
    baseXP = Math.round(50 * multiplier);
    trustDelta += 15;
  } else {
    baseXP = 10; // Participation XP
    trustDelta -= 20;
  }

  // Evidence bonuses (+5 to +15 pts per indicator)
  const evidenceBonus = evidenceFound.reduce((acc, curr) => acc + (curr.points || 5), 0);
  baseXP += evidenceBonus;
  if (evidenceFound.length > 0) {
    trustDelta += Math.min(evidenceFound.length * 5, 15);
  }

  // Reasoning alignment bonus
  if (reasoning.length > 0 && isCorrect) {
    baseXP += 15;
  }

  // Hint deduction
  const hintDeduction = hintsUsed * 10;
  const finalXP = Math.max(baseXP - hintDeduction, 5);

  // Speed bonus (if solved correctly in under 15 seconds)
  let speedBonus = 0;
  if (isCorrect && responseTime < 15) {
    speedBonus = 10;
  }

  return {
    xpEarned: finalXP + speedBonus,
    trustChange: trustDelta,
    evidencePoints: evidenceBonus,
    hintPenalty: hintDeduction,
    speedBonus
  };
};

export const computeLevel = (xp) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const computeCyberScore = (skillProfile = {}) => {
  const weights = {
    phishing: 0.25,
    passwords: 0.15,
    qrSafety: 0.15,
    scamDetection: 0.20,
    socialEngineering: 0.15,
    aiThreats: 0.10
  };

  let totalWeighted = 0;
  let totalWeights = 0;

  for (const [category, weight] of Object.entries(weights)) {
    const score = typeof skillProfile[category] === 'number' ? skillProfile[category] : 50;
    totalWeighted += score * weight;
    totalWeights += weight;
  }

  return Math.round(totalWeighted / totalWeights);
};

export const computeRiskLevel = (cyberScore) => {
  if (cyberScore >= 80) return 'low';
  if (cyberScore >= 60) return 'medium';
  if (cyberScore >= 40) return 'high';
  return 'critical';
};

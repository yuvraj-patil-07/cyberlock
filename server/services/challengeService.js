import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';
import Attempt from '../models/Attempt.js';
import User from '../models/User.js';
import SkillProfile from '../models/SkillProfile.js';
import RiskProfile from '../models/RiskProfile.js';
import Leaderboard from '../models/Leaderboard.js';
import { calculateAttemptScore, computeLevel, computeCyberScore, computeRiskLevel } from './scoringService.js';
import { checkAndAwardBadges } from './badgeService.js';
import { explainAttempt } from './ai/coachService.js';
import memoryStore from '../utils/memoryStore.js';

const isMongoConnected = () => mongoose.connection.readyState === 1;

export const getChallenges = async ({ category, difficulty, room }) => {
  if (isMongoConnected()) {
    try {
      const filter = { isActive: true };
      if (category) filter.category = category;
      if (difficulty) filter.difficulty = difficulty;
      if (room) filter.room = parseInt(room, 10);
      const results = await Challenge.find(filter).sort({ order: 1, createdAt: 1 });
      if (results && results.length > 0) return results;
    } catch (err) {
      console.warn('MongoDB getChallenges failed, using memoryStore:', err.message);
    }
  }

  // In-Memory Fallback
  let filtered = memoryStore.challenges;
  if (category) filtered = filtered.filter(c => c.category === category);
  if (difficulty) filtered = filtered.filter(c => c.difficulty === difficulty);
  if (room) filtered = filtered.filter(c => parseInt(c.room, 10) === parseInt(room, 10));
  return filtered;
};

export const getChallengeById = async (id) => {
  if (isMongoConnected()) {
    try {
      const challenge = await Challenge.findById(id);
      if (challenge) return challenge;
    } catch (err) {
      console.warn('MongoDB getChallengeById failed, using memoryStore:', err.message);
    }
  }

  const found = memoryStore.challenges.find(c => String(c._id) === String(id) || String(c.id) === String(id));
  if (!found) throw new Error('Challenge not found');
  return found;
};

export const submitChallengeAttempt = async ({
  userId,
  challengeId,
  answer,
  evidenceFound = [],
  reasoning = [],
  hintsUsed = 0,
  responseTime = 15
}) => {
  const challenge = await getChallengeById(challengeId);
  if (!challenge) throw new Error('Challenge not found');

  let user = null;
  if (isMongoConnected()) {
    try {
      user = await User.findById(userId);
    } catch (err) {
      console.warn('MongoDB user find failed during submitAttempt, using memoryStore:', err.message);
    }
  }
  if (!user) {
    user = memoryStore.users.get(String(userId));
  }
  if (!user) throw new Error('User not found');

  const isCorrect = String(answer).toLowerCase().trim() === String(challenge.correctAnswer).toLowerCase().trim();

  const scoring = calculateAttemptScore({
    isCorrect,
    evidenceFound,
    reasoning,
    hintsUsed,
    responseTime,
    difficulty: challenge.difficulty
  });

  const attemptData = {
    _id: `mem-att-${Date.now()}`,
    userId,
    challengeId,
    roomId: challenge.room,
    answer,
    isCorrect,
    evidenceFound,
    reasoning,
    hintsUsed,
    xpEarned: scoring.xpEarned,
    trustChange: scoring.trustChange,
    responseTime,
    createdAt: new Date()
  };

  if (isMongoConnected()) {
    try {
      const attempt = new Attempt(attemptData);
      await attempt.save();
    } catch (err) {
      console.warn('MongoDB attempt save failed:', err.message);
    }
  }
  memoryStore.attempts.push(attemptData);

  // Update User state
  user.xp = (user.xp || 0) + scoring.xpEarned;
  user.level = computeLevel(user.xp);
  user.trustScore = Math.max(0, Math.min(100, (user.trustScore ?? 100) + scoring.trustChange));
  if (!isCorrect) {
    user.lives = Math.max(0, (user.lives ?? 5) - 1);
  }
  user.totalChallengesAttempted = (user.totalChallengesAttempted || 0) + 1;
  if (isCorrect) user.totalCorrect = (user.totalCorrect || 0) + 1;

  const skillCategoryMap = {
    'phishing': 'phishing',
    'password': 'passwords',
    'qr': 'qrSafety',
    'scam': 'scamDetection',
    'social-engineering': 'socialEngineering',
    'ai-threat': 'aiThreats'
  };

  const skillKey = skillCategoryMap[challenge.category] || 'phishing';
  const currentSkillVal = user.skillProfile?.[skillKey] || 50;
  const delta = isCorrect ? 5 : -5;
  const newSkillVal = Math.max(10, Math.min(100, currentSkillVal + delta));

  if (!user.skillProfile) user.skillProfile = {};
  user.skillProfile[skillKey] = newSkillVal;

  user.cyberScore = computeCyberScore(user.skillProfile);
  user.currentScore = user.cyberScore;
  if (!user.firstAttemptScore || user.firstAttemptScore === 0) {
    user.firstAttemptScore = user.cyberScore;
  }

  if (isMongoConnected() && typeof user.save === 'function') {
    try {
      await user.save();
    } catch (err) {
      console.warn('MongoDB user update save failed:', err.message);
    }
  }

  // Check badges
  let newBadges = [];
  try {
    newBadges = await checkAndAwardBadges(userId, { roomCompleted: challenge.room });
  } catch (err) {
    console.warn('Badge award error ignored:', err.message);
  }

  // Get AI Coach explanation
  let coachExplanation = null;
  try {
    coachExplanation = await explainAttempt({
      challengeId: challenge._id,
      answer,
      reasoning,
      evidenceFound,
      isCorrect
    });
  } catch (err) {
    coachExplanation = {
      analysis: challenge.explanation || "Analyzed threat indicators.",
      strength: isCorrect ? "Accurate classification." : "Good attempt investigating the threat.",
      vulnerability: isCorrect ? "None" : "Pay attention to deceptive indicators.",
      actionableTip: "Verify all critical requests via trusted apps directly."
    };
  }

  return {
    attemptId: attemptData._id,
    isCorrect,
    correctAnswer: challenge.correctAnswer,
    explanation: challenge.explanation,
    scoring,
    userState: {
      xp: user.xp,
      level: user.level,
      trustScore: user.trustScore,
      lives: user.lives,
      cyberScore: user.cyberScore,
      skillProfile: user.skillProfile
    },
    consequenceChain: !isCorrect ? (challenge.consequenceChain || ["Security boundary breached", "Data at risk"]) : [],
    recoverySteps: !isCorrect ? (challenge.recoverySteps || ["Change credentials", "Enable 2FA"]) : [],
    newBadges,
    coachExplanation
  };
};

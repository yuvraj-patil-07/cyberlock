import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import SkillProfile from '../models/SkillProfile.js';
import RiskProfile from '../models/RiskProfile.js';
import Leaderboard from '../models/Leaderboard.js';
import { config } from '../config/env.js';

export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

export const register = async ({ username, email, password }) => {
  const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingEmail) {
    throw new Error('Email is already registered');
  }

  const existingUsername = await User.findOne({ username: username.trim() });
  if (existingUsername) {
    throw new Error('Username is already taken');
  }

  const user = new User({
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password,
    xp: 0,
    level: 1,
    cyberScore: 50,
    trustScore: 100,
    lives: 5,
    firstAttemptScore: 50,
    currentScore: 50,
    skillProfile: {
      phishing: 50,
      passwords: 50,
      qrSafety: 50,
      scamDetection: 50,
      socialEngineering: 50,
      aiThreats: 50,
      digitalPrivacy: 50
    }
  });

  await user.save();

  // Create SkillProfile
  await SkillProfile.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      categories: {
        phishing: { score: 50, attempts: 0, correct: 0 },
        passwords: { score: 50, attempts: 0, correct: 0 },
        qrSafety: { score: 50, attempts: 0, correct: 0 },
        scamDetection: { score: 50, attempts: 0, correct: 0 },
        socialEngineering: { score: 50, attempts: 0, correct: 0 },
        aiThreats: { score: 50, attempts: 0, correct: 0 },
        digitalPrivacy: { score: 50, attempts: 0, correct: 0 }
      },
      strongestSkill: 'passwords',
      weakestSkill: 'phishing'
    },
    { upsert: true, new: true }
  );

  // Create RiskProfile
  await RiskProfile.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      overallRisk: 'medium',
      overallScore: 50,
      categoryRisks: {
        phishing: 50,
        passwords: 50,
        qrSafety: 50,
        scamDetection: 50,
        socialEngineering: 50,
        aiThreats: 50
      }
    },
    { upsert: true, new: true }
  );

  // Create Leaderboard entry
  await Leaderboard.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      username: user.username,
      totalScore: 0,
      cyberScore: 50,
      fastestTime: 0,
      evidenceCount: 0,
      improvementPct: 0,
      gamesCompleted: 0
    },
    { upsert: true, new: true }
  );

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: sanitizeUser(user)
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).populate('badges.badgeId');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: sanitizeUser(user)
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).populate('badges.badgeId');
  if (!user) {
    throw new Error('User not found');
  }
  return sanitizeUser(user);
};

export const sanitizeUser = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    xp: user.xp,
    level: user.level,
    cyberScore: user.cyberScore,
    trustScore: user.trustScore,
    lives: user.lives,
    badges: user.badges || [],
    completedRooms: user.completedRooms || [],
    skillProfile: user.skillProfile || {},
    firstAttemptScore: user.firstAttemptScore || 0,
    currentScore: user.currentScore || user.cyberScore || 0,
    improvementPct: user.firstAttemptScore > 0 ? Math.round(((user.currentScore - user.firstAttemptScore) / user.firstAttemptScore) * 100) : 0,
    gamesPlayed: user.gamesPlayed || 0,
    totalChallengesAttempted: user.totalChallengesAttempted || 0,
    totalCorrect: user.totalCorrect || 0
  };
};

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import SkillProfile from '../models/SkillProfile.js';
import RiskProfile from '../models/RiskProfile.js';
import Leaderboard from '../models/Leaderboard.js';
import { config } from '../config/env.js';
import memoryStore from '../utils/memoryStore.js';

const isMongoConnected = () => mongoose.connection.readyState === 1;

export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

export const register = async ({ username, email, password }) => {
  const normEmail = email.toLowerCase().trim();
  const normUsername = username.trim();

  if (isMongoConnected()) {
    try {
      const existingEmail = await User.findOne({ email: normEmail });
      if (existingEmail) throw new Error('Email is already registered');

      const existingUsername = await User.findOne({ username: normUsername });
      if (existingUsername) throw new Error('Username is already taken');

      const user = new User({
        username: normUsername,
        email: normEmail,
        password,
        xp: 0,
        level: 1,
        cyberScore: 0,
        trustScore: 100,
        lives: 5,
        firstAttemptScore: 0,
        currentScore: 0,
        skillProfile: {
          phishing: 0,
          passwords: 0,
          qrSafety: 0,
          scamDetection: 0,
          socialEngineering: 0,
          aiThreats: 0,
          digitalPrivacy: 0
        }
      });
      await user.save();

      await SkillProfile.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          categories: {
            phishing: { score: 0, attempts: 0, correct: 0 },
            passwords: { score: 0, attempts: 0, correct: 0 },
            qrSafety: { score: 0, attempts: 0, correct: 0 },
            scamDetection: { score: 0, attempts: 0, correct: 0 },
            socialEngineering: { score: 0, attempts: 0, correct: 0 },
            aiThreats: { score: 0, attempts: 0, correct: 0 },
            digitalPrivacy: { score: 0, attempts: 0, correct: 0 }
          },
          strongestSkill: 'passwords',
          weakestSkill: 'phishing'
        },
        { upsert: true, new: true }
      );

      await RiskProfile.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          overallRisk: 'high',
          overallScore: 0,
          categoryRisks: { phishing: 0, passwords: 0, qrSafety: 0, scamDetection: 0, socialEngineering: 0, aiThreats: 0 }
        },
        { upsert: true, new: true }
      );

      await Leaderboard.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          username: user.username,
          totalScore: 0,
          cyberScore: 0,
          fastestTime: 0,
          evidenceCount: 0,
          improvementPct: 0,
          gamesCompleted: 0
        },
        { upsert: true, new: true }
      );

      const token = generateToken(user._id, user.role);
      return { token, user: sanitizeUser(user) };
    } catch (err) {
      if (err.message === 'Email is already registered' || err.message === 'Username is already taken') {
        throw err;
      }
      console.warn('MongoDB register query failed, falling back to memoryStore:', err.message);
    }
  }

  // Fallback: In-Memory Register
  for (const u of memoryStore.users.values()) {
    if (u.email === normEmail) throw new Error('Email is already registered');
    if (u.username === normUsername) throw new Error('Username is already taken');
  }

  const newId = `mem-user-${Date.now()}`;
  const memUser = {
    _id: newId,
    id: newId,
    username: normUsername,
    email: normEmail,
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'user',
    xp: 0,
    level: 1,
    cyberScore: 0,
    trustScore: 100,
    lives: 5,
    badges: [],
    completedRooms: [],
    skillProfile: { phishing: 0, passwords: 0, qrSafety: 0, scamDetection: 0, socialEngineering: 0, aiThreats: 0, digitalPrivacy: 0 },
    firstAttemptScore: 0,
    currentScore: 0,
    gamesPlayed: 0,
    totalChallengesAttempted: 0,
    totalCorrect: 0
  };

  memoryStore.users.set(newId, memUser);
  const token = generateToken(memUser._id, memUser.role);
  return { token, user: sanitizeUser(memUser) };
};

export const login = async ({ email, password }) => {
  const normEmail = email.toLowerCase().trim();

  if (isMongoConnected()) {
    try {
      const user = await User.findOne({ email: normEmail }).populate('badges.badgeId');
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
          const token = generateToken(user._id, user.role);
          return { token, user: sanitizeUser(user) };
        }
      }
    } catch (err) {
      console.warn('MongoDB login query failed, falling back to memoryStore:', err.message);
    }
  }

  // Fallback / memoryStore check
  for (const u of memoryStore.users.values()) {
    if (u.email === normEmail) {
      let isMatch = false;
      if (u.passwordHash) {
        isMatch = bcrypt.compareSync(password, u.passwordHash);
      } else if (u.password) {
        isMatch = u.password === password;
      }
      if (isMatch) {
        const token = generateToken(u._id, u.role);
        return { token, user: sanitizeUser(u) };
      }
    }
  }

  throw new Error('Invalid email or password');
};

export const getCurrentUser = async (userId) => {
  if (isMongoConnected()) {
    try {
      const user = await User.findById(userId).populate('badges.badgeId');
      if (user) return sanitizeUser(user);
    } catch (err) {
      console.warn('MongoDB getCurrentUser query failed, checking memoryStore:', err.message);
    }
  }

  const memUser = memoryStore.users.get(String(userId));
  if (memUser) return sanitizeUser(memUser);

  throw new Error('User not found');
};

export const sanitizeUser = (user) => {
  return {
    id: user._id || user.id,
    username: user.username,
    email: user.email,
    role: user.role || 'user',
    xp: user.xp || 0,
    level: user.level || 1,
    coins: user.coins || 0,          // ← was missing, always showed 0
    cyberScore: user.cyberScore || 0,
    trustScore: user.trustScore || 100,
    lives: user.lives ?? 5,
    badges: user.badges || [],
    completedRooms: user.completedRooms || [],
    roomStars: user.roomStars || {},   // per-room star ratings
    skillProfile: user.skillProfile || {},
    firstAttemptScore: user.firstAttemptScore || 0,
    currentScore: user.currentScore || user.cyberScore || 0,
    improvementPct: (user.firstAttemptScore || 0) > 0 ? Math.round((((user.currentScore || user.cyberScore || 0) - user.firstAttemptScore) / user.firstAttemptScore) * 100) : 0,
    gamesPlayed: user.gamesPlayed || 0,
    totalChallengesAttempted: user.totalChallengesAttempted || 0,
    totalCorrect: user.totalCorrect || 0
  };
};

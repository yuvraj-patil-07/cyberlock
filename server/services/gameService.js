import mongoose from 'mongoose';
import GameSession from '../models/GameSession.js';
import User from '../models/User.js';
import Attempt from '../models/Attempt.js';
import Challenge from '../models/Challenge.js';
import Leaderboard from '../models/Leaderboard.js';
import { checkAndAwardBadges } from './badgeService.js';
import { computeRiskLevel } from './scoringService.js';
import { getCurrentUser } from './authService.js';
import memoryStore from '../utils/memoryStore.js';

const isMongoConnected = () => mongoose.connection.readyState === 1;

export const startGameSession = async (userId, roomId = 1) => {
  if (isMongoConnected()) {
    try {
      let session = await GameSession.findOne({ userId, status: 'active' });
      if (!session) {
        session = new GameSession({
          userId,
          currentRoom: roomId,
          trustScore: 100,
          livesRemaining: 5,
          status: 'active',
          roomProgress: [
            { room: 1, completed: false, score: 0, challenges: 0 },
            { room: 2, completed: false, score: 0, challenges: 0 },
            { room: 3, completed: false, score: 0, challenges: 0 },
            { room: 4, completed: false, score: 0, challenges: 0 },
            { room: 5, completed: false, score: 0, challenges: 0 },
            { room: 6, completed: false, score: 0, challenges: 0 },
            { room: 7, completed: false, score: 0, challenges: 0 }
          ]
        });
        await session.save();
      }
      return session;
    } catch (err) {
      console.warn('MongoDB startGameSession failed, using memoryStore:', err.message);
    }
  }

  // Memory Fallback
  let memSession = memoryStore.gameSessions.get(String(userId));
  if (!memSession) {
    memSession = {
      _id: `mem-session-${userId}`,
      userId,
      currentRoom: roomId,
      trustScore: 100,
      livesRemaining: 5,
      status: 'active',
      roomProgress: [
        { room: 1, completed: false, score: 0, challenges: 0 },
        { room: 2, completed: false, score: 0, challenges: 0 },
        { room: 3, completed: false, score: 0, challenges: 0 },
        { room: 4, completed: false, score: 0, challenges: 0 },
        { room: 5, completed: false, score: 0, challenges: 0 },
        { room: 6, completed: false, score: 0, challenges: 0 },
        { room: 7, completed: false, score: 0, challenges: 0 }
      ]
    };
    memoryStore.gameSessions.set(String(userId), memSession);
  }
  return memSession;
};

export const getGameProgress = async (userId) => {
  const user = await getCurrentUser(userId);
  if (!user) throw new Error('User not found');

  const completedRooms = user.completedRooms || [];
  const roomStatus = [
    { id: 1, title: 'PHISHING', unlocked: true, completed: completedRooms.includes('1') },
    { id: 2, title: 'PASSWORD VAULT', unlocked: true, completed: completedRooms.includes('2') },
    { id: 3, title: 'QR TRAP', unlocked: true, completed: completedRooms.includes('3') },
    { id: 4, title: 'SCAM INBOX', unlocked: true, completed: completedRooms.includes('4') },
    { id: 5, title: 'SOCIAL ENGINEERING', unlocked: completedRooms.length >= 2, completed: completedRooms.includes('5') },
    { id: 6, title: 'AI THREAT LAB', unlocked: completedRooms.length >= 3, completed: completedRooms.includes('6') },
    { id: 7, title: 'FINAL CYBER LOCK', unlocked: completedRooms.length >= 4, completed: completedRooms.includes('7') }
  ];

  let attemptsCount = user.totalChallengesAttempted || 0;
  let correctCount = user.totalCorrect || 0;
  const activeSession = await startGameSession(userId);

  return {
    user: {
      username: user.username,
      cyberScore: user.cyberScore || 50,
      xp: user.xp || 0,
      level: user.level || 1,
      coins: user.coins || 0,
      trustScore: user.trustScore || 100,
      lives: user.lives ?? 5,
      badges: user.badges || [],
      skillProfile: user.skillProfile || {},
      firstAttemptScore: user.firstAttemptScore || 50,
      currentScore: user.currentScore || 50,
      roomStars: (() => {
        const obj = {};
        if (user.roomStars) {
          if (user.roomStars.forEach) {
            user.roomStars.forEach((v, k) => { obj[k] = v; });
          } else {
            Object.assign(obj, user.roomStars);
          }
        }
        return obj;
      })()
    },
    rooms: roomStatus,
    session: activeSession,
    totalAttempts: attemptsCount,
    correctAttempts: correctCount
  };
};

export const completeRoom = async (userId, roomId, stars = 1) => {
  let user = null;
  if (isMongoConnected()) {
    try {
      user = await User.findById(userId);
    } catch (err) {
      console.warn('MongoDB completeRoom user find failed:', err.message);
    }
  }
  if (!user) user = memoryStore.users.get(String(userId));
  if (!user) throw new Error('User not found');

  const rIdStr = String(roomId);
  if (!user.completedRooms) user.completedRooms = [];

  // Award XP only on first completion
  let xpGained = 0;
  if (!user.completedRooms.includes(rIdStr)) {
    user.completedRooms.push(rIdStr);
    xpGained = 150;
    user.xp = (user.xp || 0) + xpGained;
  }

  // Always update stars if the new value is better
  const starsNum = Math.max(1, Math.min(3, Math.round(stars)));
  if (!user.roomStars) user.roomStars = new Map();
  const prevStars = user.roomStars.get ? (user.roomStars.get(rIdStr) || 0) : (user.roomStars[rIdStr] || 0);
  if (starsNum > prevStars) {
    if (user.roomStars.set) {
      user.roomStars.set(rIdStr, starsNum);
    } else {
      user.roomStars[rIdStr] = starsNum;
    }
  }

  // Recalculate level after XP change
  if (typeof user.calculateLevel === 'function') {
    user.level = user.calculateLevel();
  } else {
    user.level = Math.floor(Math.sqrt((user.xp || 0) / 100)) + 1;
  }

  if (isMongoConnected() && typeof user.save === 'function') {
    try { await user.save(); } catch (err) { console.warn('completeRoom save failed:', err.message); }
  }

  let newBadges = [];
  try {
    newBadges = await checkAndAwardBadges(userId, { roomCompleted: parseInt(roomId, 10) });
  } catch (err) { /* ignore */ }

  // Convert Map to plain object for JSON response
  const roomStarsObj = {};
  if (user.roomStars) {
    if (user.roomStars.forEach) {
      user.roomStars.forEach((v, k) => { roomStarsObj[k] = v; });
    } else {
      Object.assign(roomStarsObj, user.roomStars);
    }
  }

  // Sync leaderboard entry for this user (upsert so new users appear immediately)
  if (isMongoConnected()) {
    try {
      const improvement = (user.firstAttemptScore || 0) > 0
        ? Math.round((((user.currentScore || user.cyberScore || 50) - user.firstAttemptScore) / user.firstAttemptScore) * 100)
        : 0;
      await Leaderboard.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          username: user.username,
          totalScore: user.xp || 0,
          cyberScore: user.cyberScore || 50,
          gamesCompleted: user.completedRooms?.length || 0,
          evidenceCount: (user.totalCorrect || 0) * 2,
          improvementPct: improvement,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
    } catch (lbErr) {
      console.warn('Leaderboard sync on completeRoom failed (non-fatal):', lbErr.message);
    }
  }

  return {
    success: true,
    completedRooms: user.completedRooms,
    xpGained,
    newLevel: user.level,
    newXp: user.xp,
    starsAwarded: starsNum,
    roomStars: roomStarsObj,
    newBadges
  };
};

export const getCyberDNA = async (userId) => {
  const user = await getCurrentUser(userId);
  if (!user) throw new Error('User not found');

  const skills = user.skillProfile || {
    phishing: 50,
    passwords: 50,
    qrSafety: 50,
    scamDetection: 50,
    socialEngineering: 50,
    aiThreats: 50,
    digitalPrivacy: 50
  };

  const categories = [
    { key: 'phishing', label: 'Phishing Awareness', score: skills.phishing || 50, color: '#06b6d4' },
    { key: 'passwords', label: 'Password Hygiene', score: skills.passwords || 50, color: '#10b981' },
    { key: 'qrSafety', label: 'QR Safety', score: skills.qrSafety || 50, color: '#8b5cf6' },
    { key: 'scamDetection', label: 'Scam Detection', score: skills.scamDetection || 50, color: '#f59e0b' },
    { key: 'socialEngineering', label: 'Social Engineering Resistance', score: skills.socialEngineering || 50, color: '#ec4899' },
    { key: 'aiThreats', label: 'AI Threat Awareness', score: skills.aiThreats || 50, color: '#6366f1' },
    { key: 'digitalPrivacy', label: 'Digital Privacy', score: skills.digitalPrivacy || 50, color: '#3b82f6' }
  ];

  const sorted = [...categories].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const overallScore = user.cyberScore || 50;
  const riskLevel = computeRiskLevel(overallScore);
  const improvement = (user.firstAttemptScore || 0) > 0
    ? Math.round((((user.currentScore || overallScore) - user.firstAttemptScore) / user.firstAttemptScore) * 100)
    : 0;

  return {
    categories,
    overallScore,
    riskLevel,
    riskLabel: `Educational Cyber Risk: ${riskLevel.toUpperCase()}`,
    strongestSkill: strongest,
    weakestSkill: weakest,
    mostImprovedSkill: categories.find(c => c.score > 60) || strongest,
    improvementPct: improvement,
    firstScore: user.firstAttemptScore || 50,
    currentScore: user.currentScore || overallScore,
    totalThreatsDetected: user.totalChallengesAttempted || 0,
    correctDecisions: user.totalCorrect || 0,
    evidenceFoundCount: (user.totalCorrect || 0) * 2,
    badges: user.badges || []
  };
};

export const resetGame = async (userId) => {
  let user = null;
  if (isMongoConnected()) {
    try {
      user = await User.findById(userId);
      if (user) {
        user.trustScore = 100;
        user.lives = 5;
        user.completedRooms = [];
        await user.save();
      }
    } catch (err) {
      /* ignore */
    }
  }
  const memUser = memoryStore.users.get(String(userId));
  if (memUser) {
    memUser.trustScore = 100;
    memUser.lives = 5;
    memUser.completedRooms = [];
  }

  return { success: true, message: 'Game progress reset to default state.' };
};

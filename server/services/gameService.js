import GameSession from '../models/GameSession.js';
import User from '../models/User.js';
import Attempt from '../models/Attempt.js';
import Challenge from '../models/Challenge.js';
import { checkAndAwardBadges } from './badgeService.js';
import { computeRiskLevel } from './scoringService.js';

export const startGameSession = async (userId, roomId = 1) => {
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
};

export const getGameProgress = async (userId) => {
  const user = await User.findById(userId).populate('badges.badgeId');
  if (!user) throw new Error('User not found');

  const attempts = await Attempt.find({ userId });
  const activeSession = await GameSession.findOne({ userId, status: 'active' });

  // Calculate room unlocks
  // Rooms 1-4 unlocked by default. Rooms 5-7 unlock progressively.
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

  return {
    user: {
      username: user.username,
      cyberScore: user.cyberScore,
      xp: user.xp,
      level: user.level,
      trustScore: user.trustScore,
      lives: user.lives,
      badges: user.badges,
      skillProfile: user.skillProfile,
      firstAttemptScore: user.firstAttemptScore,
      currentScore: user.currentScore
    },
    rooms: roomStatus,
    session: activeSession,
    totalAttempts: attempts.length,
    correctAttempts: attempts.filter(a => a.isCorrect).length
  };
};

export const completeRoom = async (userId, roomId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const rIdStr = String(roomId);
  if (!user.completedRooms.includes(rIdStr)) {
    user.completedRooms.push(rIdStr);
    user.xp += 150; // Room completion bonus XP
    await user.save();
  }

  // Update game session
  const session = await GameSession.findOne({ userId, status: 'active' });
  if (session) {
    const rProg = session.roomProgress.find(r => r.room === parseInt(roomId, 10));
    if (rProg) rProg.completed = true;
    await session.save();
  }

  const newBadges = await checkAndAwardBadges(userId, { roomCompleted: parseInt(roomId, 10) });

  return {
    success: true,
    completedRooms: user.completedRooms,
    xpGained: 150,
    newBadges
  };
};

export const getCyberDNA = async (userId) => {
  const user = await User.findById(userId).populate('badges.badgeId');
  if (!user) throw new Error('User not found');

  const attempts = await Attempt.find({ userId }).populate('challengeId');
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

  // Find strongest and weakest
  const sorted = [...categories].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const overallScore = user.cyberScore || 50;
  const riskLevel = computeRiskLevel(overallScore);
  const improvement = user.firstAttemptScore > 0
    ? Math.round(((user.currentScore - user.firstAttemptScore) / user.firstAttemptScore) * 100)
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
    totalThreatsDetected: attempts.length,
    correctDecisions: attempts.filter(a => a.isCorrect).length,
    evidenceFoundCount: attempts.reduce((acc, a) => acc + (a.evidenceFound?.length || 0), 0),
    badges: user.badges
  };
};

export const resetGame = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.trustScore = 100;
  user.lives = 5;
  user.completedRooms = [];
  await user.save();

  await GameSession.updateMany({ userId }, { status: 'abandoned' });

  return { success: true, message: 'Game progress reset to default state.' };
};

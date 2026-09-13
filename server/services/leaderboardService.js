import mongoose from 'mongoose';
import Leaderboard from '../models/Leaderboard.js';
import memoryStore from '../utils/memoryStore.js';

const isMongoConnected = () => mongoose.connection.readyState === 1;

export const getLeaderboard = async (category = 'top-score', limit = 25) => {
  if (isMongoConnected()) {
    try {
      let sortField = { totalScore: -1, cyberScore: -1 };
      switch (category) {
        case 'top-score': sortField = { totalScore: -1, cyberScore: -1 }; break;
        case 'fastest-detective': sortField = { fastestTime: 1, totalScore: -1 }; break;
        case 'best-investigator': sortField = { evidenceCount: -1, totalScore: -1 }; break;
        case 'most-improved': sortField = { improvementPct: -1, cyberScore: -1 }; break;
        case 'cyber-sentinel': sortField = { cyberScore: -1, totalScore: -1 }; break;
        default: sortField = { totalScore: -1 };
      }

      const entries = await Leaderboard.find({})
        .sort(sortField)
        .limit(limit)
        .populate('userId', 'username level badges');

      if (entries && entries.length > 0) {
        return entries.map((e, index) => ({
          rank: index + 1,
          id: e._id,
          userId: e.userId?._id || e.userId,
          username: e.username || e.userId?.username || 'Cyber Agent',
          level: e.userId?.level || 1,
          totalScore: e.totalScore || 0,
          cyberScore: e.cyberScore || 0,
          evidenceCount: e.evidenceCount || 0,
          improvementPct: e.improvementPct || 0,
          fastestTime: e.fastestTime || 0,
          badgeCount: e.userId?.badges?.length || 0
        }));
      }
    } catch (err) {
      console.warn('MongoDB leaderboard query failed, using memoryStore:', err.message);
    }
  }

  // Memory Fallback
  const allUsers = Array.from(memoryStore.users.values());
  const sorted = allUsers.sort((a, b) => (b.xp || b.cyberScore || 0) - (a.xp || a.cyberScore || 0));

  return sorted.slice(0, limit).map((u, idx) => ({
    rank: idx + 1,
    id: u._id || u.id,
    userId: u._id || u.id,
    username: u.username || 'Hero Agent',
    level: u.level || 1,
    totalScore: u.xp || 0,
    cyberScore: u.cyberScore || 50,
    evidenceCount: (u.totalCorrect || 0) * 2,
    improvementPct: u.firstAttemptScore > 0 ? Math.round((((u.currentScore || 50) - u.firstAttemptScore) / u.firstAttemptScore) * 100) : 0,
    fastestTime: 12,
    badgeCount: u.badges?.length || 0
  }));
};

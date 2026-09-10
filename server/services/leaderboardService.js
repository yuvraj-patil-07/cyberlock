import Leaderboard from '../models/Leaderboard.js';
import User from '../models/User.js';

export const getLeaderboard = async (category = 'top-score', limit = 25) => {
  let sortField = { totalScore: -1, cyberScore: -1 };

  switch (category) {
    case 'top-score':
      sortField = { totalScore: -1, cyberScore: -1 };
      break;
    case 'fastest-detective':
      sortField = { fastestTime: 1, totalScore: -1 };
      break;
    case 'best-investigator':
      sortField = { evidenceCount: -1, totalScore: -1 };
      break;
    case 'most-improved':
      sortField = { improvementPct: -1, cyberScore: -1 };
      break;
    case 'cyber-sentinel':
      sortField = { cyberScore: -1, totalScore: -1 };
      break;
    default:
      sortField = { totalScore: -1 };
  }

  const entries = await Leaderboard.find({})
    .sort(sortField)
    .limit(limit)
    .populate('userId', 'username level badges');

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
};

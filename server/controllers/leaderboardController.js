import Leaderboard from '../models/Leaderboard.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const { category = 'top-score', limit = 50, page = 1 } = req.query;
    const limitNum = Math.min(parseInt(limit) || 50, 100);
    
    let sortField = { totalScore: -1 };
    if (category === 'cyber-score') sortField = { cyberScore: -1 };
    if (category === 'most-improved') sortField = { improvementPct: -1 };
    if (category === 'fastest') sortField = { fastestTime: 1 };
    
    const entries = await Leaderboard.find({})
      .sort(sortField)
      .limit(limitNum)
      .lean();
    
    const ranked = entries.map((entry, i) => ({ ...entry, rank: i + 1 }));
    
    res.status(200).json({ leaderboard: ranked, total: ranked.length, category });
  } catch (error) {
    next(error);
  }
};

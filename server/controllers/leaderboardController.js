import * as leaderboardService from '../services/leaderboardService.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const category = req.query.category || 'top-score';
    const limit = parseInt(req.query.limit || '25', 10);
    const leaderboard = await leaderboardService.getLeaderboard(category, limit);
    res.status(200).json({ leaderboard });
  } catch (error) {
    next(error);
  }
};

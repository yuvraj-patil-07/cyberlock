import express from 'express';
import * as leaderboardController from '../controllers/leaderboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, leaderboardController.getLeaderboard);

export default router;

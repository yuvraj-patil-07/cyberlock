import express from 'express';
import * as profileController from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, profileController.getProfile);
router.get('/skills', protect, profileController.getSkills);
router.get('/badges', protect, profileController.getBadges);
router.get('/history', protect, profileController.getHistory);

export default router;

import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.get('/analytics', protect, admin, adminController.getAnalytics);
router.get('/users', protect, admin, adminController.getUsers);
router.get('/challenges', protect, admin, adminController.getChallenges);

export default router;

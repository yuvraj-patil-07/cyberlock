import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, authController.register);
router.post('/login',    authLimiter, authController.login);
router.get('/me',        protect,     authController.getMe);
router.post('/change-password', protect, authController.changePassword);

export default router;

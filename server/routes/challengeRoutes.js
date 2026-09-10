import express from 'express';
import * as challengeController from '../controllers/challengeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, challengeController.getChallenges);
router.get('/:id', protect, challengeController.getChallengeById);
router.post('/:id/attempt', protect, challengeController.submitAttempt);

export default router;

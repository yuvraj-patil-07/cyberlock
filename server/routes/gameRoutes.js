import express from 'express';
import * as gameController from '../controllers/gameController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/start', protect, gameController.startGame);
router.get('/progress', protect, gameController.getProgress);
router.post('/complete-room/:roomId', protect, gameController.completeRoom);
router.get('/cyber-dna', protect, gameController.getCyberDNA);
router.post('/reset', protect, gameController.resetGame);
router.post('/attempt', protect, gameController.submitAttempt);

export default router;

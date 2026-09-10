import express from 'express';
import * as aiController from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-challenge', protect, aiController.generateChallenge);
router.post('/challenge', protect, aiController.generateChallenge); // Alias
router.post('/explain', protect, aiController.getExplanation);
router.post('/explanation', protect, aiController.getExplanation); // Alias
router.post('/hint', protect, aiController.getHint);
router.post('/analyze-performance', protect, aiController.analyzePerformance);
router.post('/analyze', protect, aiController.analyzePerformance); // Alias
router.get('/recommend', protect, aiController.getRecommendations);
router.get('/recommendation', protect, aiController.getRecommendations); // Alias

export default router;

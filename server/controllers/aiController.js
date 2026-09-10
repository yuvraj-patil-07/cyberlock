import * as attackerService from '../services/ai/attackerService.js';
import * as coachService from '../services/ai/coachService.js';

export const generateChallenge = async (req, res, next) => {
  try {
    const { category, difficulty, playerWeakness } = req.body;
    const challenge = await attackerService.generateAttackerChallenge({
      category: category || 'phishing',
      difficulty: difficulty || 'intermediate',
      playerWeakness: playerWeakness || 'urgency',
      userLevel: req.user?.level || 1
    });
    res.status(200).json({ challenge });
  } catch (error) {
    next(error);
  }
};

export const getExplanation = async (req, res, next) => {
  try {
    const { challengeId, answer, reasoning, evidenceFound, isCorrect } = req.body;
    if (!challengeId) {
      return res.status(400).json({ message: 'challengeId is required' });
    }
    const explanation = await coachService.explainAttempt({
      challengeId,
      answer,
      reasoning,
      evidenceFound,
      isCorrect
    });
    res.status(200).json(explanation);
  } catch (error) {
    next(error);
  }
};

export const getHint = async (req, res, next) => {
  try {
    const { challengeId, hintLevel, evidenceFound } = req.body;
    if (!challengeId) {
      return res.status(400).json({ message: 'challengeId is required' });
    }
    const hint = await coachService.getDynamicHint({
      challengeId,
      hintLevel: hintLevel || 1,
      evidenceFound: evidenceFound || []
    });
    res.status(200).json(hint);
  } catch (error) {
    next(error);
  }
};

export const analyzePerformance = async (req, res, next) => {
  try {
    const analysis = await coachService.analyzePlayerPerformance(req.user.id);
    res.status(200).json(analysis);
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await coachService.analyzePlayerPerformance(req.user.id);
    res.status(200).json({
      recommendation: recommendations.recommendedMission || {
        room: 1,
        title: "PHISHING ROOM",
        reason: "Practice foundational domain identification"
      },
      analysis: recommendations
    });
  } catch (error) {
    next(error);
  }
};

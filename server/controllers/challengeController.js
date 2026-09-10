import * as challengeService from '../services/challengeService.js';

export const getChallenges = async (req, res, next) => {
  try {
    const { category, difficulty, room } = req.query;
    const challenges = await challengeService.getChallenges({ category, difficulty, room });
    res.status(200).json({ challenges });
  } catch (error) {
    next(error);
  }
};

export const getChallengeById = async (req, res, next) => {
  try {
    const challenge = await challengeService.getChallengeById(req.params.id);
    res.status(200).json({ challenge });
  } catch (error) {
    next(error);
  }
};

export const submitAttempt = async (req, res, next) => {
  try {
    const { challengeId, answer, evidenceFound, reasoning, hintsUsed, responseTime } = req.body;
    const targetChallengeId = req.params.id || challengeId;

    if (!targetChallengeId || answer === undefined) {
      return res.status(400).json({ message: 'challengeId and answer are required' });
    }

    const result = await challengeService.submitChallengeAttempt({
      userId: req.user.id,
      challengeId: targetChallengeId,
      answer,
      evidenceFound,
      reasoning,
      hintsUsed,
      responseTime
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

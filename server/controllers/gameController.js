import * as gameService from '../services/gameService.js';
import * as challengeService from '../services/challengeService.js';

export const startGame = async (req, res, next) => {
  try {
    const { room = 1 } = req.body;
    const session = await gameService.startGameSession(req.user.id, room);
    res.status(200).json({ session });
  } catch (error) {
    next(error);
  }
};

export const getProgress = async (req, res, next) => {
  try {
    const progress = await gameService.getGameProgress(req.user.id);
    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};

export const completeRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const result = await gameService.completeRoom(req.user.id, roomId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCyberDNA = async (req, res, next) => {
  try {
    const dna = await gameService.getCyberDNA(req.user.id);
    res.status(200).json(dna);
  } catch (error) {
    next(error);
  }
};

export const resetGame = async (req, res, next) => {
  try {
    const result = await gameService.resetGame(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const submitAttempt = async (req, res, next) => {
  try {
    const { challengeId, answer, evidenceFound, reasoning, hintsUsed, responseTime } = req.body;
    if (!challengeId || answer === undefined) {
      return res.status(400).json({ message: 'challengeId and answer are required' });
    }

    const result = await challengeService.submitChallengeAttempt({
      userId: req.user.id,
      challengeId,
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

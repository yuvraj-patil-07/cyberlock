import * as gameService from '../services/gameService.js';
import * as challengeService from '../services/challengeService.js';
import User from '../models/User.js';
import Leaderboard from '../models/Leaderboard.js';

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
    const { stars = 1 } = req.body;
    const result = await gameService.completeRoom(req.user.id, roomId, stars);
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


export const submitCustomScore = async (req, res) => {
  try {
    const { xpEarned = 0, coinsEarned = 0, heartsLost = 0 } = req.body;
    const userId = req.user.id || req.user._id;

    // MUST fetch real Mongoose document — req.user is a plain sanitized object with no .save()
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (xpEarned > 0)    user.xp     = (user.xp    || 0) + xpEarned;
    if (coinsEarned > 0) user.coins  = (user.coins  || 0) + coinsEarned;
    if (heartsLost  > 0) user.lives  = Math.max(0, (user.lives || 5) - heartsLost);
    if (xpEarned > 0)    user.gamesPlayed = (user.gamesPlayed || 0) + 1;

    // Always keep level in sync with xp
    user.level = user.calculateLevel();

    await user.save();

    // Sync leaderboard entry for this user
    try {
      const improvement = (user.firstAttemptScore || 0) > 0
        ? Math.round((((user.currentScore || user.cyberScore || 50) - user.firstAttemptScore) / user.firstAttemptScore) * 100)
        : 0;
      await Leaderboard.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          username: user.username,
          totalScore: user.xp || 0,
          cyberScore: user.cyberScore || 50,
          gamesCompleted: user.gamesPlayed || 0,
          evidenceCount: (user.totalCorrect || 0) * 2,
          improvementPct: improvement,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
    } catch (lbErr) {
      console.warn('Leaderboard sync failed (non-fatal):', lbErr.message);
    }

    return res.json({
      success: true,
      xpEarned,
      coinsEarned,
      newTotalXp: user.xp,
      newLevel:   user.level,
      newCoins:   user.coins,
      newLives:   user.lives,
    });
  } catch (error) {
    console.error('Submit custom score error:', error);
    return res.status(500).json({ message: 'Server error saving score' });
  }
};

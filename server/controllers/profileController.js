import User from '../models/User.js';
import SkillProfile from '../models/SkillProfile.js';
import Attempt from '../models/Attempt.js';
import Badge from '../models/Badge.js';
import { sanitizeUser } from '../services/authService.js';
import { getCyberDNA } from '../services/gameService.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('badges.badgeId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const getSkills = async (req, res, next) => {
  try {
    const skillDoc = await SkillProfile.findOne({ userId: req.user.id });
    const user = await User.findById(req.user.id);
    res.status(200).json({
      skillProfile: user?.skillProfile || {},
      detailedProfile: skillDoc
    });
  } catch (error) {
    next(error);
  }
};

export const getBadges = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('badges.badgeId');
    const allBadges = await Badge.find({});
    res.status(200).json({
      userBadges: user?.badges || [],
      allBadges
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate('challengeId', 'title category difficulty room');
    res.status(200).json({ history: attempts });
  } catch (error) {
    next(error);
  }
};

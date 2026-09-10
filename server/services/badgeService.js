import Badge from '../models/Badge.js';
import User from '../models/User.js';
import Attempt from '../models/Attempt.js';

export const checkAndAwardBadges = async (userId, context = {}) => {
  const user = await User.findById(userId).populate('badges.badgeId');
  if (!user) return [];

  const existingBadgeSlugs = new Set(
    user.badges.map(b => b.badgeId?.slug).filter(Boolean)
  );

  const allBadges = await Badge.find({});
  const newlyAwarded = [];

  // Fetch user stats
  const attempts = await Attempt.find({ userId });
  const correctAttempts = attempts.filter(a => a.isCorrect);

  for (const badge of allBadges) {
    if (existingBadgeSlugs.has(badge.slug)) continue;

    let shouldAward = false;

    switch (badge.slug) {
      case 'phish-hunter': {
        const phishCount = attempts.filter(a => a.roomId === 1 && a.isCorrect).length;
        if (phishCount >= (badge.criteria?.threshold || 3)) shouldAward = true;
        break;
      }
      case 'vault-keeper': {
        const pwCount = attempts.filter(a => a.roomId === 2 && a.isCorrect).length;
        if (pwCount >= (badge.criteria?.threshold || 3)) shouldAward = true;
        break;
      }
      case 'qr-guardian': {
        const qrCount = attempts.filter(a => a.roomId === 3 && a.isCorrect).length;
        if (qrCount >= (badge.criteria?.threshold || 3)) shouldAward = true;
        break;
      }
      case 'scam-breaker': {
        const scamCount = attempts.filter(a => a.roomId === 4 && a.isCorrect).length;
        if (scamCount >= (badge.criteria?.threshold || 3)) shouldAward = true;
        break;
      }
      case 'social-engineering-detective': {
        const seCount = attempts.filter(a => a.roomId === 5 && a.isCorrect).length;
        if (seCount >= (badge.criteria?.threshold || 3)) shouldAward = true;
        break;
      }
      case 'ai-skeptic': {
        const aiCount = attempts.filter(a => a.roomId === 6 && a.isCorrect).length;
        if (aiCount >= (badge.criteria?.threshold || 3)) shouldAward = true;
        break;
      }
      case 'cyber-sentinel': {
        if (user.completedRooms.includes('7') || context.roomCompleted === 7) {
          shouldAward = true;
        }
        break;
      }
      case 'perfect-escape': {
        if (user.trustScore >= 100 && user.completedRooms.length >= 1) {
          shouldAward = true;
        }
        break;
      }
      case 'most-improved': {
        const improvement = user.firstAttemptScore > 0
          ? ((user.currentScore - user.firstAttemptScore) / user.firstAttemptScore) * 100
          : 0;
        if (improvement >= (badge.criteria?.threshold || 25)) {
          shouldAward = true;
        }
        break;
      }
      default:
        break;
    }

    if (shouldAward) {
      user.badges.push({ badgeId: badge._id, unlockedAt: new Date() });
      newlyAwarded.push(badge);
    }
  }

  if (newlyAwarded.length > 0) {
    await user.save();
  }

  return newlyAwarded;
};

export const getAllBadges = async () => {
  return await Badge.find({}).sort({ rarity: 1 });
};

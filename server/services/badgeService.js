import mongoose from 'mongoose';
import Badge from '../models/Badge.js';
import User from '../models/User.js';
import Attempt from '../models/Attempt.js';
import memoryStore from '../utils/memoryStore.js';

const isMongoConnected = () => mongoose.connection.readyState === 1;

export const checkAndAwardBadges = async (userId, context = {}) => {
  // Skip badge checking if not connected to MongoDB and not in memory store
  if (!isMongoConnected()) {
    // Lightweight memoryStore badge check
    const memUser = memoryStore.users.get(String(userId));
    if (!memUser) return [];
    // In-memory mode: skip badge awarding (badges require DB)
    return [];
  }

  try {
    const user = await User.findById(userId).populate('badges.badgeId');
    if (!user) return [];

    const existingBadgeSlugs = new Set(
      user.badges.map(b => b.badgeId?.slug).filter(Boolean)
    );

    const allBadges = await Badge.find({});
    const newlyAwarded = [];

    // Fetch user stats using indexed query
    const attempts = await Attempt.find({ userId });
    const correctAttempts = attempts.filter(a => a.isCorrect);

    for (const badge of allBadges) {
      if (existingBadgeSlugs.has(badge.slug)) continue;

      let shouldAward = false;
      const threshold = badge.criteria?.threshold || 3;

      switch (badge.slug) {
        case 'phish-hunter': {
          const count = attempts.filter(a => a.roomId === 1 && a.isCorrect).length;
          if (count >= threshold) shouldAward = true;
          break;
        }
        case 'vault-keeper': {
          const count = attempts.filter(a => a.roomId === 2 && a.isCorrect).length;
          if (count >= threshold) shouldAward = true;
          break;
        }
        case 'qr-guardian': {
          const count = attempts.filter(a => a.roomId === 3 && a.isCorrect).length;
          if (count >= threshold) shouldAward = true;
          break;
        }
        case 'scam-breaker': {
          const count = attempts.filter(a => a.roomId === 4 && a.isCorrect).length;
          if (count >= threshold) shouldAward = true;
          break;
        }
        // Support both slug variants for compatibility
        case 'social-detective':
        case 'social-engineering-detective': {
          const count = attempts.filter(a => a.roomId === 5 && a.isCorrect).length;
          if (count >= threshold) shouldAward = true;
          break;
        }
        case 'ai-skeptic': {
          const count = attempts.filter(a => a.roomId === 6 && a.isCorrect).length;
          if (count >= threshold) shouldAward = true;
          break;
        }
        case 'cyber-sentinel': {
          if (user.completedRooms.includes('7') || context.roomCompleted === 7) {
            shouldAward = true;
          }
          break;
        }
        case 'perfect-escape': {
          // Awarded if user completed at least 1 room with trust score still at 100
          if (user.trustScore >= 95 && user.completedRooms.length >= 1) {
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
  } catch (err) {
    console.warn('Badge check failed (non-fatal):', err.message);
    return [];
  }
};

export const getAllBadges = async () => {
  if (!isMongoConnected()) return [];
  try {
    return await Badge.find({}).sort({ rarity: 1 });
  } catch {
    return [];
  }
};

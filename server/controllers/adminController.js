import User from '../models/User.js';
import Challenge from '../models/Challenge.js';
import Attempt from '../models/Attempt.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const allUsers = await User.find({ role: 'user' });
    const attempts = await Attempt.find({}).populate('challengeId', 'title category difficulty room');
    const challenges = await Challenge.find({});

    // Average Cyber Score
    const avgScore = allUsers.length > 0
      ? Math.round(allUsers.reduce((sum, u) => sum + (u.cyberScore || 50), 0) / allUsers.length)
      : 70;

    // Average Completion Rate (rooms completed / 7)
    const avgCompletion = allUsers.length > 0
      ? Math.round((allUsers.reduce((sum, u) => sum + (u.completedRooms?.length || 0), 0) / (allUsers.length * 7)) * 100)
      : 45;

    // Failure rate by category
    const categoryStats = {
      phishing: { attempts: 0, failed: 0 },
      password: { attempts: 0, failed: 0 },
      qr: { attempts: 0, failed: 0 },
      scam: { attempts: 0, failed: 0 },
      'social-engineering': { attempts: 0, failed: 0 },
      'ai-threat': { attempts: 0, failed: 0 }
    };

    attempts.forEach(a => {
      const cat = a.challengeId?.category;
      if (cat && categoryStats[cat]) {
        categoryStats[cat].attempts += 1;
        if (!a.isCorrect) categoryStats[cat].failed += 1;
      }
    });

    const failureRates = Object.entries(categoryStats).map(([key, val]) => ({
      category: key,
      failureRate: val.attempts > 0 ? Math.round((val.failed / val.attempts) * 100) : 25,
      totalAttempts: val.attempts
    }));

    // Most failed challenge
    const challengeFails = {};
    attempts.forEach(a => {
      const title = a.challengeId?.title;
      if (title) {
        if (!challengeFails[title]) challengeFails[title] = { title, failed: 0, total: 0 };
        challengeFails[title].total += 1;
        if (!a.isCorrect) challengeFails[title].failed += 1;
      }
    });

    const mostFailedList = Object.values(challengeFails)
      .sort((a, b) => b.failed - a.failed)
      .slice(0, 5);

    // Most improved users
    const mostImproved = [...allUsers]
      .map(u => {
        const imp = u.firstAttemptScore > 0
          ? Math.round(((u.currentScore - u.firstAttemptScore) / u.firstAttemptScore) * 100)
          : 0;
        return {
          id: u._id,
          username: u.username,
          firstScore: u.firstAttemptScore,
          currentScore: u.currentScore,
          improvementPct: imp,
          level: u.level
        };
      })
      .sort((a, b) => b.improvementPct - a.improvementPct)
      .slice(0, 5);

    // Difficulty distribution
    const difficultyDist = {
      beginner: challenges.filter(c => c.difficulty === 'beginner').length,
      intermediate: challenges.filter(c => c.difficulty === 'intermediate').length,
      advanced: challenges.filter(c => c.difficulty === 'advanced').length,
      expert: challenges.filter(c => c.difficulty === 'expert').length
    };

    // Completion Funnel (Room 1 -> 7)
    const funnel = [1, 2, 3, 4, 5, 6, 7].map(roomId => ({
      room: `Room ${roomId}`,
      players: allUsers.filter(u => u.completedRooms?.includes(String(roomId))).length
    }));

    res.status(200).json({
      summary: {
        totalPlayers: totalUsers,
        totalChallenges: challenges.length,
        totalAttempts: attempts.length,
        avgCyberScore: avgScore,
        avgCompletionRate: avgCompletion,
        mostCommonWeakness: 'Phishing Typo-Squatting'
      },
      failureRates,
      funnel,
      difficultyDistribution: difficultyDist,
      mostFailedChallenges: mostFailedList,
      mostImprovedUsers: mostImproved
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const getChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({}).sort({ room: 1, order: 1 });
    res.status(200).json({ challenges });
  } catch (error) {
    next(error);
  }
};

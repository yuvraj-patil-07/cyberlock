import Challenge from '../models/Challenge.js';
import Attempt from '../models/Attempt.js';
import User from '../models/User.js';
import SkillProfile from '../models/SkillProfile.js';
import RiskProfile from '../models/RiskProfile.js';
import Leaderboard from '../models/Leaderboard.js';
import { calculateAttemptScore, computeLevel, computeCyberScore, computeRiskLevel } from './scoringService.js';
import { checkAndAwardBadges } from './badgeService.js';
import { explainAttempt } from './ai/coachService.js';

export const getChallenges = async ({ category, difficulty, room }) => {
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (room) filter.room = parseInt(room, 10);

  return await Challenge.find(filter).sort({ order: 1, createdAt: 1 });
};

export const getChallengeById = async (id) => {
  const challenge = await Challenge.findById(id);
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  return challenge;
};

export const submitChallengeAttempt = async ({
  userId,
  challengeId,
  answer,
  evidenceFound = [],
  reasoning = [],
  hintsUsed = 0,
  responseTime = 15
}) => {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new Error('Challenge not found');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isCorrect = String(answer).toLowerCase().trim() === String(challenge.correctAnswer).toLowerCase().trim();

  const scoring = calculateAttemptScore({
    isCorrect,
    evidenceFound,
    reasoning,
    hintsUsed,
    responseTime,
    difficulty: challenge.difficulty
  });

  // Record Attempt
  const attempt = new Attempt({
    userId,
    challengeId,
    roomId: challenge.room,
    answer,
    isCorrect,
    evidenceFound,
    reasoning,
    hintsUsed,
    xpEarned: scoring.xpEarned,
    trustChange: scoring.trustChange,
    responseTime
  });
  await attempt.save();

  // Update User state
  user.xp += scoring.xpEarned;
  user.level = computeLevel(user.xp);
  user.trustScore = Math.max(0, Math.min(100, user.trustScore + scoring.trustChange));
  if (!isCorrect) {
    user.lives = Math.max(0, user.lives - 1);
  }
  user.totalChallengesAttempted += 1;
  if (isCorrect) user.totalCorrect += 1;

  // Update User Skill Profile
  const skillCategoryMap = {
    'phishing': 'phishing',
    'password': 'passwords',
    'qr': 'qrSafety',
    'scam': 'scamDetection',
    'social-engineering': 'socialEngineering',
    'ai-threat': 'aiThreats'
  };

  const skillKey = skillCategoryMap[challenge.category] || 'phishing';
  const currentSkillVal = user.skillProfile?.[skillKey] || 50;
  const delta = isCorrect ? 5 : -5;
  const newSkillVal = Math.max(10, Math.min(100, currentSkillVal + delta));

  if (!user.skillProfile) user.skillProfile = {};
  user.skillProfile[skillKey] = newSkillVal;

  // Recalculate CyberScore & Risk
  user.cyberScore = computeCyberScore(user.skillProfile);
  user.currentScore = user.cyberScore;
  if (!user.firstAttemptScore || user.firstAttemptScore === 0) {
    user.firstAttemptScore = user.cyberScore;
  }

  await user.save();

  // Update SkillProfile Document
  const skillDoc = await SkillProfile.findOne({ userId });
  if (skillDoc) {
    if (!skillDoc.categories[skillKey]) {
      skillDoc.categories[skillKey] = { score: 50, attempts: 0, correct: 0 };
    }
    skillDoc.categories[skillKey].attempts += 1;
    if (isCorrect) skillDoc.categories[skillKey].correct += 1;
    skillDoc.categories[skillKey].score = newSkillVal;
    await skillDoc.save();
  }

  // Update RiskProfile Document
  await RiskProfile.findOneAndUpdate(
    { userId },
    {
      overallScore: user.cyberScore,
      overallRisk: computeRiskLevel(user.cyberScore),
      categoryRisks: user.skillProfile
    },
    { upsert: true }
  );

  // Update Leaderboard Document
  const allUserAttempts = await Attempt.find({ userId });
  const totalEvidence = allUserAttempts.reduce((acc, a) => acc + (a.evidenceFound?.length || 0), 0);
  const impPct = user.firstAttemptScore > 0 ? Math.round(((user.currentScore - user.firstAttemptScore) / user.firstAttemptScore) * 100) : 0;

  await Leaderboard.findOneAndUpdate(
    { userId },
    {
      username: user.username,
      totalScore: user.xp,
      cyberScore: user.cyberScore,
      evidenceCount: totalEvidence,
      improvementPct: impPct
    },
    { upsert: true }
  );

  // Check badges
  const newBadges = await checkAndAwardBadges(userId, { roomCompleted: challenge.room });

  // Get AI Coach explanation
  let coachExplanation = null;
  try {
    coachExplanation = await explainAttempt({
      challengeId: challenge._id,
      answer,
      reasoning,
      evidenceFound,
      isCorrect
    });
  } catch (err) {
    coachExplanation = {
      analysis: challenge.explanation,
      strength: isCorrect ? "Accurate classification." : "Good attempt investigating the threat.",
      vulnerability: isCorrect ? "None" : "Pay attention to deceptive indicators.",
      actionableTip: "Verify all critical requests via trusted apps directly."
    };
  }

  return {
    attemptId: attempt._id,
    isCorrect,
    correctAnswer: challenge.correctAnswer,
    explanation: challenge.explanation,
    scoring,
    userState: {
      xp: user.xp,
      level: user.level,
      trustScore: user.trustScore,
      lives: user.lives,
      cyberScore: user.cyberScore,
      skillProfile: user.skillProfile
    },
    consequenceChain: !isCorrect ? (challenge.consequenceChain || ["Security boundary breached", "Data at risk"]) : [],
    recoverySteps: !isCorrect ? (challenge.recoverySteps || ["Change credentials", "Enable 2FA"]) : [],
    newBadges,
    coachExplanation
  };
};

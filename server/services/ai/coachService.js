import { callAI } from './aiProvider.js';
import { COACH_SYSTEM_PROMPT, sanitizePromptInput } from './promptTemplates.js';
import Challenge from '../../models/Challenge.js';
import User from '../../models/User.js';
import Attempt from '../../models/Attempt.js';

export const explainAttempt = async ({ challengeId, answer, reasoning = [], evidenceFound = [], isCorrect }) => {
  const challenge = await Challenge.findById(challengeId);
  const challengeTitle = challenge?.title || 'Cyber Threat';
  const explanation = challenge?.explanation || 'Threat indicators were present.';

  const userPrompt = `
Player Decision Analysis:
Challenge Title: "${challengeTitle}"
Player Answer: "${sanitizePromptInput(answer)}"
Decision Was: ${isCorrect ? 'CORRECT' : 'INCORRECT'}
Player Stated Reasoning: ${JSON.stringify(reasoning)}
Evidence Found by Player: ${JSON.stringify(evidenceFound)}
Actual Explanation: "${explanation}"

Analyze the player's performance. Highlight cognitive biases or good investigative reasoning.
Return ONLY valid JSON matching the schema.
`;

  try {
    const analysis = await callAI({
      systemPrompt: COACH_SYSTEM_PROMPT,
      userPrompt,
      temperature: 0.6
    });

    return {
      success: true,
      analysis: analysis.summary || explanation,
      strength: analysis.strengthIdentified || 'Good initiative in examining the scenario.',
      vulnerability: analysis.vulnerabilityIdentified || 'Keep sharpening your attention to domain suffixes.',
      actionableTip: analysis.actionableTip || 'Always verify links out-of-band on official applications.',
      recommendedMission: analysis.recommendedMission || {
        room: challenge?.room || 1,
        title: challengeTitle,
        reason: 'Reinforce this scenario type'
      }
    };
  } catch (error) {
    return {
      success: true,
      analysis: explanation,
      strength: isCorrect ? "Accurate threat classification." : "Good attempt investigating the situation.",
      vulnerability: isCorrect ? "None detected in this challenge." : "Missed key indicators in the sender address or links.",
      actionableTip: "Check sender addresses carefully and never act on urgent countdown deadlines.",
      recommendedMission: {
        room: challenge?.room || 1,
        title: challengeTitle,
        reason: "Practice similar challenges to solidify mastery."
      }
    };
  }
};

export const getDynamicHint = async ({ challengeId, hintLevel = 1, evidenceFound = [] }) => {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    return { hint: "Inspect the sender and destination URL carefully." };
  }

  // If hints exist in challenge record, return progressive level
  if (challenge.hints && challenge.hints.length >= hintLevel) {
    return {
      hint: challenge.hints[hintLevel - 1],
      hintLevel,
      maxHints: challenge.hints.length
    };
  }

  // AI Generated hint
  const userPrompt = `
Generate a level ${hintLevel} subtle hint (1-3) for challenge "${challenge.title}".
Category: ${challenge.category}.
Evidence already discovered: ${JSON.stringify(evidenceFound)}.
Do NOT give away the exact answer. Give an observational clue.
`;

  try {
    const hintData = await callAI({
      systemPrompt: "You are the AI Security Coach. Give concise, thought-provoking hints. Return JSON: { \"hint\": \"...\" }",
      userPrompt,
      temperature: 0.5
    });
    return { hint: hintData.hint, hintLevel, maxHints: 3 };
  } catch (err) {
    return {
      hint: `Hint ${hintLevel}: Look closely at the sender domain and whether any artificial urgency is being created.`,
      hintLevel,
      maxHints: 3
    };
  }
};

export const analyzePlayerPerformance = async (userId) => {
  const user = await User.findById(userId);
  const recentAttempts = await Attempt.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('challengeId', 'title category difficulty');

  const skills = user?.skillProfile || {
    phishing: 50,
    passwords: 50,
    qrSafety: 50,
    scamDetection: 50,
    socialEngineering: 50,
    aiThreats: 50
  };

  const userPrompt = `
User Performance Summary:
Username: ${user?.username || 'Player'}
Current Level: ${user?.level || 1}
Trust Score: ${user?.trustScore || 100}
Cyber Score: ${user?.cyberScore || 0}
Skill Ratings (0-100): ${JSON.stringify(skills)}
Recent 10 attempts: ${JSON.stringify(recentAttempts.map(a => ({
    title: a.challengeId?.title,
    category: a.challengeId?.category,
    isCorrect: a.isCorrect,
    trustChange: a.trustChange
  })))}

Provide full player performance analysis, weakest area, strongest area, and recommended training mission.
Return ONLY valid JSON.
`;

  try {
    const coachFeedback = await callAI({
      systemPrompt: COACH_SYSTEM_PROMPT,
      userPrompt,
      temperature: 0.6
    });
    return coachFeedback;
  } catch (err) {
    // Determine weakest skill algorithmically
    let lowestSkill = 'phishing';
    let lowestVal = 100;
    for (const [skill, val] of Object.entries(skills)) {
      if (typeof val === 'number' && val < lowestVal) {
        lowestVal = val;
        lowestSkill = skill;
      }
    }

    const roomMapping = {
      phishing: { room: 1, name: 'PHISHING ROOM' },
      passwords: { room: 2, name: 'PASSWORD VAULT' },
      qrSafety: { room: 3, name: 'QR TRAP' },
      scamDetection: { room: 4, name: 'SCAM INBOX' },
      socialEngineering: { room: 5, name: 'SOCIAL ENGINEERING' },
      aiThreats: { room: 6, name: 'AI THREAT LAB' }
    };

    const target = roomMapping[lowestSkill] || { room: 1, name: 'PHISHING ROOM' };

    return {
      summary: `Your cybersecurity instincts are progressing well. Your weakest area is currently ${lowestSkill.toUpperCase()} (${lowestVal}% accuracy).`,
      strengthIdentified: "Active engagement with digital evidence.",
      vulnerabilityIdentified: `Vulnerabilities observed in ${lowestSkill} manipulation vectors.`,
      actionableTip: "Take extra time to verify sender identities before clicking or approving prompts.",
      recommendedMission: {
        room: target.room,
        title: `${target.name} — Skill Boost`,
        reason: `Your ${lowestSkill} skill profile is at ${lowestVal}%. Complete this mission to improve your Cyber DNA.`
      }
    };
  }
};

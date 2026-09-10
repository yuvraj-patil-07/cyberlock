import { callAI } from './aiProvider.js';
import { ATTACKER_SYSTEM_PROMPT, sanitizePromptInput } from './promptTemplates.js';
import Challenge from '../../models/Challenge.js';

export const generateAttackerChallenge = async ({ category = 'phishing', difficulty = 'intermediate', playerWeakness = 'urgency', userLevel = 1 }) => {
  const sanitizedCategory = sanitizePromptInput(category);
  const sanitizedDifficulty = sanitizePromptInput(difficulty);
  const sanitizedWeakness = sanitizePromptInput(playerWeakness);

  const userPrompt = `
Generate a new, educational cybersecurity challenge.
Category: ${sanitizedCategory}
Difficulty: ${sanitizedDifficulty}
Player Level: ${userLevel}
Player Weakness Focus: ${sanitizedWeakness}

Create a realistic scenario where the attacker employs subtle techniques (urgency, lookalike domain, social authority, or QR redirect).
Ensure all domains (.invalid / .example) and phone numbers (555-01XX) are strictly fictional.
Return ONLY valid JSON matching the schema.
`;

  try {
    const generatedData = await callAI({
      systemPrompt: ATTACKER_SYSTEM_PROMPT,
      userPrompt,
      temperature: 0.75
    });

    // Save generated challenge into MongoDB
    const roomMap = {
      'phishing': 1,
      'password': 2,
      'qr': 3,
      'scam': 4,
      'social-engineering': 5,
      'ai-threat': 6
    };

    const challenge = new Challenge({
      category: generatedData.category || sanitizedCategory,
      difficulty: generatedData.difficulty || sanitizedDifficulty,
      room: roomMap[sanitizedCategory] || 6,
      title: generatedData.title || `AI Mission: ${sanitizedCategory.toUpperCase()}`,
      scenario: generatedData.scenario,
      options: generatedData.options || [
        { text: "SAFE", value: "safe" },
        { text: "SUSPICIOUS", value: "suspicious" },
        { text: "THREAT", value: "threat" }
      ],
      correctAnswer: generatedData.correctAnswer || "suspicious",
      indicators: generatedData.indicators || [],
      explanation: generatedData.explanation || "Always verify credentials through official channels.",
      hints: generatedData.hints || ["Inspect the sender domain.", "Check the destination URL."],
      learningObjective: generatedData.learningObjective || "Identify social engineering indicators.",
      consequenceChain: generatedData.consequenceChain || ["Traps triggered", "Account compromised"],
      recoverySteps: generatedData.recoverySteps || ["Reset credentials", "Enable MFA"],
      isAIGenerated: true,
      isActive: true
    });

    await challenge.save();
    return challenge;
  } catch (error) {
    console.error('Error generating AI challenge:', error.message);
    // Fallback: return a pre-existing challenge from DB
    const existing = await Challenge.findOne({ category: sanitizedCategory, difficulty: sanitizedDifficulty })
      || await Challenge.findOne({ category: sanitizedCategory });
    return existing;
  }
};

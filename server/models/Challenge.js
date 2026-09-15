import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['phishing', 'password', 'qr', 'scam', 'social-engineering', 'ai-threat'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  room: { type: Number, required: true, min: 1, max: 7 },
  title: { type: String, required: true },
  scenario: {
    type: { type: String },
    sender: String,
    senderAddress: String,
    subject: String,
    timestamp: String,
    body: String,
    links: [String],
    attachments: [String],
    urgencyLevel: String,
    context: String,
    qrDestination: String,
    passwordList: [String],
    image: String
  },
  options: [{
    text: String,
    value: String
  }],
  correctAnswer: { type: String, required: true },
  indicators: [{
    type: { type: String },
    description: String,
    points: Number
  }],
  explanation: { type: String, required: true },
  hints: [{ type: String }],
  learningObjective: String,
  consequenceChain: [{ type: String }],
  recoverySteps: [{ type: String }],
  isAIGenerated: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: Number
}, { timestamps: true });

ChallengeSchema.index({ category: 1, difficulty: 1, room: 1 });

const Challenge = mongoose.model('Challenge', ChallengeSchema);
export default Challenge;

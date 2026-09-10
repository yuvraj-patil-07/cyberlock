import mongoose from 'mongoose';

const AttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  roomId: { type: Number },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  evidenceFound: [{
    type: { type: String },
    description: String,
    points: Number
  }],
  reasoning: [{ type: String }],
  hintsUsed: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  trustChange: { type: Number, default: 0 },
  responseTime: { type: Number },
}, { timestamps: true });

AttemptSchema.index({ userId: 1, challengeId: 1 });

const Attempt = mongoose.model('Attempt', AttemptSchema);
export default Attempt;

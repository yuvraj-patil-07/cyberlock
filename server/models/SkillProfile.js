import mongoose from 'mongoose';

const CategoryScoreSchema = new mongoose.Schema({
  score: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
  avgResponseTime: { type: Number, default: 0 }
}, { _id: false });

const SkillProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  categories: {
    phishing: CategoryScoreSchema,
    passwords: CategoryScoreSchema,
    qrSafety: CategoryScoreSchema,
    scamDetection: CategoryScoreSchema,
    socialEngineering: CategoryScoreSchema,
    aiThreats: CategoryScoreSchema,
    digitalPrivacy: CategoryScoreSchema
  },
  improvementHistory: [{
    date: Date,
    overallScore: Number,
    categoryScores: mongoose.Schema.Types.Mixed
  }],
  strongestSkill: String,
  weakestSkill: String,
  mostImprovedSkill: String
}, { timestamps: true });

const SkillProfile = mongoose.model('SkillProfile', SkillProfileSchema);
export default SkillProfile;

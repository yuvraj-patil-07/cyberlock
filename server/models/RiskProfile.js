import mongoose from 'mongoose';

const RiskProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  overallRisk: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical']
  },
  overallScore: Number,
  categoryRisks: {
    phishing: Number,
    passwords: Number,
    qrSafety: Number,
    scamDetection: Number,
    socialEngineering: Number,
    aiThreats: Number
  },
  calculatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const RiskProfile = mongoose.model('RiskProfile', RiskProfileSchema);
export default RiskProfile;

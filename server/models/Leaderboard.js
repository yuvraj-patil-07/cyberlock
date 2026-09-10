import mongoose from 'mongoose';

const LeaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  username: { type: String, required: true },
  totalScore: { type: Number, default: 0 },
  cyberScore: { type: Number, default: 0 },
  fastestTime: { type: Number, default: 0 },
  evidenceCount: { type: Number, default: 0 },
  improvementPct: { type: Number, default: 0 },
  gamesCompleted: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

LeaderboardSchema.index({ totalScore: -1, cyberScore: -1 });

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);
export default Leaderboard;

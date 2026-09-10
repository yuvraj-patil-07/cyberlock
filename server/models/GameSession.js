import mongoose from 'mongoose';

const RoomProgressSchema = new mongoose.Schema({
  room: Number,
  completed: Boolean,
  score: Number,
  challenges: Number
}, { _id: false });

const GameSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentRoom: { type: Number, default: 1 },
  currentChallengeIndex: { type: Number, default: 0 },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  trustScore: { type: Number, default: 100 },
  livesRemaining: { type: Number, default: 5 },
  xpEarned: { type: Number, default: 0 },
  challengesCompleted: { type: Number, default: 0 },
  challengesCorrect: { type: Number, default: 0 },
  evidenceCollected: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  roomProgress: [RoomProgressSchema]
}, { timestamps: true });

const GameSession = mongoose.model('GameSession', GameSessionSchema);
export default GameSession;

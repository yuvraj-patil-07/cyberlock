import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  cyberScore: { type: Number, default: 50, min: 0, max: 100 },
  trustScore: { type: Number, default: 100, min: 0, max: 100 },
  lives: { type: Number, default: 5 },
  badges: [{
    badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
    unlockedAt: { type: Date, default: Date.now }
  }],
  completedRooms: [{ type: String }],
  skillProfile: {
    phishing: { type: Number, default: 50 },
    passwords: { type: Number, default: 50 },
    qrSafety: { type: Number, default: 50 },
    scamDetection: { type: Number, default: 50 },
    socialEngineering: { type: Number, default: 50 },
    aiThreats: { type: Number, default: 50 },
    digitalPrivacy: { type: Number, default: 50 }
  },
  firstAttemptScore: { type: Number, default: 50 },
  currentScore: { type: Number, default: 50 },
  gamesPlayed: { type: Number, default: 0 },
  totalChallengesAttempted: { type: Number, default: 0 },
  totalCorrect: { type: Number, default: 0 }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.calculateLevel = function () {
  return Math.floor(Math.sqrt(this.xp / 100)) + 1;
};

const User = mongoose.model('User', UserSchema);
export default User;

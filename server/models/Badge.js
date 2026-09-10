import mongoose from 'mongoose';

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  icon: String,
  category: String,
  criteria: {
    type: { type: String },
    threshold: Number,
    category: String
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary']
  }
}, { timestamps: true });

const Badge = mongoose.model('Badge', BadgeSchema);
export default Badge;

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Challenge from '../models/Challenge.js';
import Badge from '../models/Badge.js';
import User from '../models/User.js';
import { config } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDatabase = async () => {
  try {
    console.log('🔄 Checking database seed status...');

    // Load Badges
    const badgesPath = path.join(__dirname, 'badges.json');
    if (fs.existsSync(badgesPath)) {
      const badgesData = JSON.parse(fs.readFileSync(badgesPath, 'utf8'));
      for (const badge of badgesData) {
        await Badge.findOneAndUpdate({ slug: badge.slug }, badge, { upsert: true, new: true });
      }
      console.log(`✅ Loaded ${badgesData.length} Badges`);
    }

    // Load Challenges
    const challengesDir = path.join(__dirname, 'challenges');
    const challengeFiles = fs.readdirSync(challengesDir).filter(f => f.endsWith('.json'));
    let totalChallenges = 0;

    for (const file of challengeFiles) {
      const filePath = path.join(challengesDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      for (const item of data) {
        await Challenge.findOneAndUpdate(
          { title: item.title, category: item.category },
          item,
          { upsert: true, new: true }
        );
        totalChallenges++;
      }
    }
    console.log(`✅ Loaded ${totalChallenges} Challenges across ${challengeFiles.length} categories`);

    // Ensure default admin user exists
    const existingAdmin = await User.findOne({ email: config.adminEmail });
    if (!existingAdmin) {
      const adminUser = new User({
        username: 'cyberadmin',
        email: config.adminEmail,
        password: config.adminPassword,
        role: 'admin',
        cyberScore: 98,
        level: 10,
        xp: 9500,
        trustScore: 100,
        completedRooms: ['1', '2', '3', '4', '5', '6', '7']
      });
      await adminUser.save();
      console.log(`✅ Default Admin user created: ${config.adminEmail}`);
    }

    // Ensure default test user exists for instant play/demo
    const existingDemo = await User.findOne({ email: 'player@cyberlock.example' });
    if (!existingDemo) {
      const demoUser = new User({
        username: 'CyberPlayer',
        email: 'player@cyberlock.example',
        password: 'Password123!',
        role: 'user',
        cyberScore: 72,
        level: 3,
        xp: 1250,
        trustScore: 85,
        skillProfile: {
          phishing: 75,
          passwords: 85,
          qrSafety: 60,
          scamDetection: 70,
          socialEngineering: 65,
          aiThreats: 50,
          digitalPrivacy: 70
        }
      });
      await demoUser.save();
      console.log('✅ Default demo player created (player@cyberlock.example / Password123!)');
    }

    console.log('🚀 Database seeding completed successfully.');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
};

// If run directly via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mongoose.connect(config.mongoUri)
    .then(async () => {
      console.log('Connected to MongoDB for standalone seed');
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      process.exit(1);
    });
}

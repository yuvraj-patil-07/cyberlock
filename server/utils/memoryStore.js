import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database Store for environments without MongoDB or during offline fallback
const memoryStore = {
  users: new Map(),
  challenges: [],
  attempts: [],
  gameSessions: new Map(),
  leaderboard: []
};

// Initialize with default seed data
const initMemoryStore = () => {
  if (memoryStore.users.size > 0) return;

  // 1. Default Demo Player
  const demoUserId = 'demo-user-id-001';
  const demoUser = {
    _id: demoUserId,
    id: demoUserId,
    username: 'CyberPlayer',
    email: 'player@cyberlock.example',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    role: 'user',
    xp: 1250,
    level: 3,
    cyberScore: 75,
    trustScore: 85,
    lives: 5,
    badges: [],
    completedRooms: ['1'],
    skillProfile: {
      phishing: 75,
      passwords: 85,
      qrSafety: 60,
      scamDetection: 70,
      socialEngineering: 65,
      aiThreats: 50,
      digitalPrivacy: 70
    },
    firstAttemptScore: 50,
    currentScore: 75,
    gamesPlayed: 3,
    totalChallengesAttempted: 10,
    totalCorrect: 8
  };
  memoryStore.users.set(demoUserId, demoUser);

  // 2. Default Admin User
  const adminUserId = 'admin-user-id-002';
  const adminUser = {
    _id: adminUserId,
    id: adminUserId,
    username: 'cyberadmin',
    email: 'admin@cyberlock.example',
    passwordHash: bcrypt.hashSync('CyberL0ck!Admin2024', 10),
    role: 'admin',
    xp: 9500,
    level: 10,
    cyberScore: 98,
    trustScore: 100,
    lives: 5,
    badges: [],
    completedRooms: ['1', '2', '3', '4', '5', '6', '7'],
    skillProfile: {
      phishing: 95,
      passwords: 100,
      qrSafety: 90,
      scamDetection: 95,
      socialEngineering: 90,
      aiThreats: 95,
      digitalPrivacy: 95
    },
    firstAttemptScore: 90,
    currentScore: 98,
    gamesPlayed: 25,
    totalChallengesAttempted: 100,
    totalCorrect: 98
  };
  memoryStore.users.set(adminUserId, adminUser);

  // 3. Load Challenges from JSON files into memory
  try {
    const challengesDir = path.resolve(__dirname, '../seeds/challenges');
    if (fs.existsSync(challengesDir)) {
      const files = fs.readdirSync(challengesDir).filter(f => f.endsWith('.json'));
      let idCounter = 1;
      for (const file of files) {
        const filePath = path.join(challengesDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        for (const item of data) {
          memoryStore.challenges.push({
            _id: `mem-chal-${idCounter++}`,
            id: `mem-chal-${idCounter}`,
            ...item
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to load in-memory challenges:', err.message);
  }
};

initMemoryStore();

export default memoryStore;

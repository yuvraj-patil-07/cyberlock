import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/cyberlock',
  jwtSecret: process.env.JWT_SECRET || 'cyberlock-jwt-secret-key-2024-secure',
  jwtExpiresIn: process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '24h',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  aiProvider: process.env.AI_PROVIDER || 'gemini',
  aiApiKey: process.env.AI_API_KEY || '',
  aiModel: process.env.AI_MODEL || 'gemini-2.0-flash',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@cyberlock.example',
  adminPassword: process.env.ADMIN_PASSWORD || 'CyberL0ck!Admin2024'
};

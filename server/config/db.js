import mongoose from 'mongoose';
import { config } from './env.js';
import { seedDatabase } from '../seeds/seed.js';

let cachedConnection = null;

export const connectDB = async () => {
  // Disable Mongoose command buffering so queries fail fast if DB is offline instead of hanging 10s
  mongoose.set('bufferCommands', false);

  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    cachedConnection = conn;
    console.log(`🛡️ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    
    // Auto-seed initial content if needed
    await seedDatabase();
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.warn('⚠️ Server running with In-Memory fallback store enabled.');
    return null;
  }
};

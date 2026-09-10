import mongoose from 'mongoose';
import { config } from './env.js';
import { seedDatabase } from '../seeds/seed.js';

let cachedConnection = null;

export const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    cachedConnection = conn;
    console.log(`🛡️ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    
    // Auto-seed initial content if needed
    await seedDatabase();
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.warn('⚠️ Server will run. Ensure MongoDB service (mongod or Mongo Atlas) is active on URI: ' + config.mongoUri);
    return null;
  }
};

import app from '../server/server.js';
import { connectDB } from '../server/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('Error connecting to database in serverless function:', err);
  }
  return app(req, res);
}

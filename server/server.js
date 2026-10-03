import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Database Connection
connectDB();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    // Allow localhost (development)
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    // Allow any Vercel deployment for this project
    if (origin.includes('vercel.app') || origin.includes('cyberlock')) {
      return callback(null, true);
    }
    // Allow explicitly configured CLIENT_URL
    if (config.clientUrl && origin === config.clientUrl) {
      return callback(null, true);
    }
    callback(null, true); // Permissive in dev — tighten in prod if needed
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting
app.use(generalLimiter);

// Logging & Body Parsing
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'CYBERLOCK Engine',
    timestamp: new Date().toISOString(),
    aiProvider: config.aiProvider,
    environment: config.nodeEnv
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/games', gameRoutes); // Alias
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = config.port || 5000;
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🛡️  CYBERLOCK SERVER ONLINE`);
    console.log(`🌐  PORT: ${PORT} | Mode: ${config.nodeEnv}`);
    console.log(`🤖  AI Provider: ${config.aiProvider} (${config.aiApiKey ? 'Active' : 'Fallback Engine Active'})`);
    console.log(`======================================================\n`);
  });
}

export default app;

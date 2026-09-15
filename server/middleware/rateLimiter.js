import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

// In development, use very generous limits so testing never hits the ceiling.
// In production, tighten them appropriately.
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,                   // 15 minutes
  max: isDev ? 10000 : 300,                    // dev: effectively unlimited
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,                           // completely skip in development
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,                   // 15 minutes
  max: isDev ? 1000 : 20,                      // dev: no blocking; prod: 20 attempts
  message: { message: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,                           // completely skip in development
});

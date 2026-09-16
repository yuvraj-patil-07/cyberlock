import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

// express-rate-limit v7+ requires `validate: { trustProxy: false }` when behind a proxy
// (like Vercel) to suppress the X-Forwarded-For ValidationError that causes 500s.
// We set trustProxy: false so the limiter doesn't validate the proxy trust chain.
const rateLimitOptions = {
  validate: { trustProxy: false, xForwardedForHeader: false },
  skip: () => isDev,  // completely skip in development
  standardHeaders: true,
  legacyHeaders: false,
};

// In development, use very generous limits so testing never hits the ceiling.
// In production, tighten them appropriately.
export const generalLimiter = rateLimit({
  ...rateLimitOptions,
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: isDev ? 10000 : 500,
  message: { message: 'Too many requests from this IP, please try again later.' },
});

export const authLimiter = rateLimit({
  ...rateLimitOptions,
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: isDev ? 1000 : 50,
  message: { message: 'Too many authentication attempts, please try again later.' },
});

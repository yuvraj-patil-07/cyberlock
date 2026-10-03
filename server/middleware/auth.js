import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { getCurrentUser } from '../services/authService.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    // getCurrentUser now returns null instead of throwing — keeps the 401 clean
    const user = await getCurrentUser(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User account not found. Please log in again.' });
    }

    req.user = {
      _id: user.id || user._id,
      id:  user.id || user._id,
      ...user
    };
    return next();
  } catch (error) {
    // jwt.verify throws JsonWebTokenError / TokenExpiredError
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid session token. Please log in again.' });
    }
    console.error('Auth protect unexpected error:', error.message);
    return res.status(401).json({ message: 'Not authorized. Please log in again.' });
  }
};

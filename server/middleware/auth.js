import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { getCurrentUser } from '../services/authService.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);

      const user = await getCurrentUser(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found or session invalid' });
      }

      req.user = {
        _id: user.id || user._id,
        id: user.id || user._id,
        ...user
      };
      return next();
    } catch (error) {
      console.warn('Auth protect error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no authorization token provided' });
  }
};

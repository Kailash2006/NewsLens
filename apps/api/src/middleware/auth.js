import jwt from 'jsonwebtoken';
import { config, isMock } from '../config.js';
import { getUserById, getDemoUser } from '../repositories/userRepo.js';

// Attaches req.user. In mock mode, we transparently resolve the demo user so
// the whole app is explorable without signing in. In live mode, a valid
// Google-OAuth-issued JWT is required (see routes/auth.js).
export function attachUser(req, _res, next) {
  if (isMock) {
    req.user = getDemoUser();
    return next();
  }
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      req.user = getUserById(payload.sub);
    } catch {
      req.user = null;
    }
  }
  next();
}

export function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  next();
}

export function signToken(userId) {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: '7d' });
}

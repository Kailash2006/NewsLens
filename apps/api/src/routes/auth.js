import { Router } from 'express';
import { isMock } from '../config.js';
import { signToken } from '../middleware/auth.js';
import { DEMO_USER_ID, getDemoUser } from '../repositories/userRepo.js';

const router = Router();

// Mock auth: hands back a demo session so the frontend flow can be built and
// tested without Google OAuth. In live mode this is replaced by the real
// Google OAuth handshake below.
router.post('/demo', (_req, res) => {
  if (!isMock) return res.status(404).json({ error: 'Demo login disabled in live mode' });
  const user = getDemoUser();
  res.json({ token: signToken(DEMO_USER_ID), user: { id: user.id, name: user.name, email: user.email } });
});

// --- Live mode (DATA_MODE=live) ---------------------------------------------
// Wire these up with `passport-google-oauth20` or Google's OAuth client:
//   GET  /api/auth/google           -> redirect to Google consent screen
//   GET  /api/auth/google/callback  -> exchange code, upsert user, issue JWT
router.get('/google', (_req, res) => {
  res.status(501).json({ error: 'Google OAuth not implemented in scaffold. See routes/auth.js.' });
});

router.get('/google/callback', (_req, res) => {
  res.status(501).json({ error: 'Google OAuth callback not implemented in scaffold.' });
});

export default router;

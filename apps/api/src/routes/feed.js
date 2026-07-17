import { Router } from 'express';
import { buildFeed } from '../services/feedService.js';
import { recordSignal } from '../repositories/userRepo.js';
import { cache } from '../services/cache.js';

const router = Router();

// GET /api/feed?mode=personalized|trending|latest&bias=all|left|center|...
router.get('/', async (req, res, next) => {
  try {
    const mode = ['personalized', 'trending', 'latest'].includes(req.query.mode)
      ? req.query.mode
      : 'personalized';
    const biasFilter = req.query.bias || undefined;
    const feed = await buildFeed({ mode, user: req.user, biasFilter });
    res.json(feed);
  } catch (err) {
    next(err);
  }
});

// POST /api/feed/signal  { articleId, signal: 'up'|'down'|'bookmark'|'skip' }
// Records a tuning signal and busts the cached feed so the change shows up.
router.post('/signal', async (req, res, next) => {
  try {
    const { articleId, signal } = req.body || {};
    if (!articleId || !signal) {
      return res.status(400).json({ error: 'articleId and signal are required' });
    }
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    recordSignal(req.user.id, articleId, signal);
    // Invalidate this user's personalized feed cache.
    await cache.del(`feed:personalized:${req.user.id}:${req.user.preferences?.biasFilter || 'all'}`);
    res.json({ ok: true, articleId, signal });
  } catch (err) {
    next(err);
  }
});

export default router;

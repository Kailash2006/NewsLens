import { Router } from 'express';
import { search } from '../services/search.js';

const router = Router();

// GET /api/search?q=... — full-text article search (Elasticsearch in live mode)
router.get('/', async (req, res, next) => {
  try {
    const results = await search(req.query.q, { limit: Number(req.query.limit) || 20 });
    res.json({ query: req.query.q || '', count: results.length, items: results });
  } catch (err) {
    next(err);
  }
});

export default router;

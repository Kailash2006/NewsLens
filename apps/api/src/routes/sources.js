import { Router } from 'express';
import { getAllSources } from '../repositories/sourceRepo.js';

const router = Router();

// GET /api/sources — outlets with bias + trust metadata
router.get('/', (_req, res) => {
  res.json({ items: getAllSources() });
});

export default router;

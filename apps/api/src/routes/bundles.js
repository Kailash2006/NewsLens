import { Router } from 'express';
import { getAllBundles, getBundleBySlug, getBundleArticles } from '../repositories/bundleRepo.js';

const router = Router();

// GET /api/bundles — all topic bundles
router.get('/', (_req, res) => {
  res.json({ items: getAllBundles() });
});

// GET /api/bundles/:slug — one bundle with its top stories
router.get('/:slug', (req, res) => {
  const bundle = getBundleBySlug(req.params.slug);
  if (!bundle) return res.status(404).json({ error: 'Bundle not found' });
  const articles = getBundleArticles(bundle);
  const activeSources = [...new Set(articles.map((a) => a.source?.name).filter(Boolean))];
  res.json({ ...bundle, articleCount: articles.length, activeSources, articles });
});

export default router;

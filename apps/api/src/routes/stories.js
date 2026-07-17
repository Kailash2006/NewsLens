import { Router } from 'express';
import { getAllClusters, getClusterById } from '../repositories/clusterRepo.js';
import { getArticleById } from '../repositories/articleRepo.js';

const router = Router();

// GET /api/stories  — multi-source clusters (the side-by-side story view)
router.get('/', (_req, res) => {
  const clusters = getAllClusters();
  res.json({ count: clusters.length, items: clusters });
});

// GET /api/stories/:id — one cluster with all its sourced articles
router.get('/:id', (req, res) => {
  const cluster = getClusterById(req.params.id);
  if (!cluster) return res.status(404).json({ error: 'Story not found' });
  res.json(cluster);
});

// GET /api/articles/:id — single enriched article (summary, bias, fact-checks)
router.get('/articles/:id', (req, res) => {
  const article = getArticleById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

export default router;

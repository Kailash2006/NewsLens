import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config.js';
import { attachUser } from './middleware/auth.js';

import healthRoutes from './routes/health.js';
import feedRoutes from './routes/feed.js';
import storyRoutes from './routes/stories.js';
import bundleRoutes from './routes/bundles.js';
import sourceRoutes from './routes/sources.js';
import searchRoutes from './routes/search.js';
import meRoutes from './routes/me.js';
import authRoutes from './routes/auth.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(attachUser);

  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/feed', feedRoutes);
  app.use('/api/stories', storyRoutes);
  app.use('/api/bundles', bundleRoutes);
  app.use('/api/me', meRoutes);
  app.use('/api/sources', sourceRoutes);
  app.use('/api/search', searchRoutes);

  app.get('/api', (_req, res) => {
    res.json({
      name: 'NewsLens API',
      endpoints: [
        'GET  /api/health',
        'POST /api/auth/demo',
        'GET  /api/feed?mode=personalized|trending|latest&bias=all|centrist|left|center-left|center|center-right|right',
        'POST /api/feed/signal   { articleId, signal: up|down|bookmark|skip }',
        'GET  /api/stories',
        'GET  /api/stories/:id',
        'GET  /api/bundles',
        'GET  /api/bundles/:slug',
        'GET  /api/sources',
        'GET  /api/search?q=',
        'GET  /api/me',
        'GET  /api/me/dashboard',
        'GET  /api/me/bookmarks',
      ],
    });
  });

  // 404 + error handlers
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error', detail: err.message });
  });

  return app;
}

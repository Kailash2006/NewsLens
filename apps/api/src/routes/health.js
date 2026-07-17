import { Router } from 'express';
import { config } from '../config.js';
import { cacheBackend } from '../services/cache.js';
import { searchBackend } from '../services/search.js';
import { summarizerBackend } from '../services/openai.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'newslens-api',
    dataMode: config.dataMode,
    backends: {
      cache: cacheBackend,
      search: searchBackend,
      summarizer: summarizerBackend,
    },
    time: new Date().toISOString(),
  });
});

export default router;

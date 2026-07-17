import { Router } from 'express';
import { requireUser } from '../middleware/auth.js';
import { readingBiasDistribution } from '../services/biasService.js';
import { getArticleById } from '../repositories/articleRepo.js';

const router = Router();

router.use(requireUser);

// GET /api/me — current user + preferences
router.get('/', (req, res) => {
  const { id, name, email, avatarColor, plan, onboarded, preferences } = req.user;
  res.json({ id, name, email, avatarColor, plan, onboarded, preferences });
});

// GET /api/me/dashboard — reading stats + bias distribution
router.get('/dashboard', (req, res) => {
  const user = req.user;
  const bias = readingBiasDistribution(user);
  const history = user.readingHistory || [];
  const totalMinutes = history.reduce((s, h) => s + (h.minutes || 0), 0);
  const goal = user.preferences?.dailyGoalMinutes || 30;

  res.json({
    articlesRead: history.length,
    totalMinutes,
    dailyGoalMinutes: goal,
    goalProgressPercent: Math.min(100, Math.round((totalMinutes / goal) * 100)),
    bias,
    recent: history.slice(0, 5).map((h) => {
      const a = getArticleById(h.articleId);
      return a && { id: a.id, title: a.title, source: a.source?.name, bias: a.source?.bias, readAt: h.readAt };
    }).filter(Boolean),
  });
});

// GET /api/me/bookmarks — saved reading list
router.get('/bookmarks', (req, res) => {
  const ids = req.user.signals?.bookmarked || [];
  res.json({ items: ids.map(getArticleById).filter(Boolean) });
});

export default router;

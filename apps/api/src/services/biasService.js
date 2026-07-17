import { getArticleById } from '../repositories/articleRepo.js';

export const BIAS_ORDER = ['left', 'center-left', 'center', 'center-right', 'right'];

export const BIAS_LABELS = {
  left: 'Left',
  'center-left': 'Center-Left',
  center: 'Center',
  'center-right': 'Center-Right',
  right: 'Right',
};

// Given a user's reading history, compute the political distribution of what
// they've actually consumed — the "organizer dashboard" view from the spec.
export function readingBiasDistribution(user) {
  const counts = Object.fromEntries(BIAS_ORDER.map((b) => [b, 0]));
  let total = 0;
  for (const entry of user?.readingHistory || []) {
    const article = getArticleById(entry.articleId);
    const bias = article?.source?.bias;
    if (bias && bias in counts) {
      counts[bias] += 1;
      total += 1;
    }
  }
  const distribution = BIAS_ORDER.map((bias) => ({
    bias,
    label: BIAS_LABELS[bias],
    count: counts[bias],
    percent: total ? Math.round((counts[bias] / total) * 100) : 0,
  }));

  // A simple lean score in [-1, 1]: left = -1 ... right = +1.
  const leanIndex = { left: -1, 'center-left': -0.5, center: 0, 'center-right': 0.5, right: 1 };
  const leanScore = total
    ? Math.round((distribution.reduce((s, d) => s + leanIndex[d.bias] * d.count, 0) / total) * 100) / 100
    : 0;

  return { total, distribution, leanScore };
}

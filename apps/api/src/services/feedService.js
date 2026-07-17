import { getAllArticles } from '../repositories/articleRepo.js';
import { getClusterForArticle } from '../repositories/clusterRepo.js';
import { cache } from './cache.js';

// Personalized relevance scoring. This is a transparent, explainable stand-in
// for the ML ranker described in the spec — good enough to demo real behavior
// (topics, followed sources, thumbs up/down, recency) and easy to reason about.

const WEIGHTS = {
  followedTopic: 5,
  followedSource: 4,
  followedJournalist: 3,
  thumbsUp: 8,
  thumbsDown: -12,
  bookmarked: 4,
  skipped: -6,
  recencyPerHour: -0.05, // gentle decay
  trustBonusPer10: 0.6,
};

function hoursSince(iso) {
  return (Date.now() - new Date(iso).getTime()) / 36e5;
}

export function scoreArticle(article, user) {
  const prefs = user?.preferences || {};
  const signals = user?.signals || {};
  let score = 10; // base

  const reasons = [];
  for (const topic of article.topics) {
    if (prefs.topics?.includes(topic)) {
      score += WEIGHTS.followedTopic;
      reasons.push(`topic:${topic}`);
    }
  }
  if (prefs.followedSourceIds?.includes(article.sourceId)) {
    score += WEIGHTS.followedSource;
    reasons.push('followed-source');
  }
  if (prefs.followedJournalistIds?.includes(article.journalistId)) {
    score += WEIGHTS.followedJournalist;
    reasons.push('followed-journalist');
  }
  if (signals.thumbsUp?.includes(article.id)) score += WEIGHTS.thumbsUp;
  if (signals.thumbsDown?.includes(article.id)) score += WEIGHTS.thumbsDown;
  if (signals.bookmarked?.includes(article.id)) score += WEIGHTS.bookmarked;
  if (signals.skipped?.includes(article.id)) score += WEIGHTS.skipped;

  score += hoursSince(article.publishedAt) * WEIGHTS.recencyPerHour;
  score += ((article.source?.trustScore || 50) / 10) * WEIGHTS.trustBonusPer10;

  return { score: Math.round(score * 100) / 100, reasons };
}

const CENTRIST_BAND = ['center-left', 'center', 'center-right'];

// 'all' = everything, 'centrist' = the middle band, anything else = that exact lean.
function applyBiasFilter(articles, biasFilter) {
  if (!biasFilter || biasFilter === 'all') return articles;
  if (biasFilter === 'centrist') {
    return articles.filter((a) => CENTRIST_BAND.includes(a.source?.bias));
  }
  return articles.filter((a) => a.source?.bias === biasFilter);
}

/**
 * @param {'personalized'|'trending'|'latest'} mode
 */
export async function buildFeed({ mode = 'personalized', user, biasFilter } = {}) {
  const cacheKey = `feed:${mode}:${user?.id || 'anon'}:${biasFilter || 'all'}`;
  const cached = await cache.get(cacheKey);
  if (cached) return { ...cached, cached: true };

  let articles = getAllArticles();
  articles = applyBiasFilter(articles, biasFilter ?? user?.preferences?.biasFilter);

  let ranked;
  if (mode === 'latest') {
    ranked = articles
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .map((a) => ({ ...a, relevance: null }));
  } else if (mode === 'trending') {
    // Trending ~ recency + trust, ignoring personal signals.
    ranked = articles
      .map((a) => {
        const recency = -hoursSince(a.publishedAt);
        const trust = (a.source?.trustScore || 50) / 20;
        return { ...a, relevance: Math.round((recency + trust) * 100) / 100 };
      })
      .sort((a, b) => b.relevance - a.relevance);
  } else {
    ranked = articles
      .map((a) => {
        const { score, reasons } = scoreArticle(a, user);
        return { ...a, relevance: score, relevanceReasons: reasons };
      })
      .sort((a, b) => b.relevance - a.relevance);
  }

  // Attach cluster info so the client can flag multi-source stories inline.
  const items = ranked.map((a) => {
    const cluster = getClusterForArticle(a.id);
    return {
      ...a,
      cluster: cluster
        ? { id: cluster.id, headline: cluster.headline, sourceCount: cluster.sourceCount }
        : null,
    };
  });

  const result = { mode, count: items.length, items };
  await cache.set(cacheKey, result, 60 * 30); // 30-min feed refresh window
  return result;
}

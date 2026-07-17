import { db } from '../data/store.js';
import { isMock, config } from '../config.js';

// Full-text search abstraction. Mock mode = naive in-memory scoring over the
// seed articles. Live mode = Elasticsearch (`articles` index).
//
// To go live, replace `search()` with an ES query, e.g.:
//   const { hits } = await esClient.search({ index, query: { multi_match: {
//     query, fields: ['title^3', 'summary', 'excerpt'] } } });

function scoreArticle(article, terms) {
  const haystack = `${article.title} ${article.summary} ${article.excerpt} ${article.topics.join(' ')}`.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (article.title.toLowerCase().includes(term)) score += 3;
    if (haystack.includes(term)) score += 1;
  }
  return score;
}

export async function search(query, { limit = 20 } = {}) {
  const terms = String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (!terms.length) return [];

  return db.articles
    .map((article) => ({ article, score: scoreArticle(article, terms) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.article);
}

export const searchBackend = isMock
  ? 'memory'
  : `elasticsearch(${config.elasticsearchUrl || 'unconfigured'})`;

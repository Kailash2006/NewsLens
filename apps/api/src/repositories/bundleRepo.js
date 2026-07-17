import { db } from '../data/store.js';
import { enrichArticle } from './articleRepo.js';

export function getAllBundles() {
  return db.bundles;
}

export function getBundleBySlug(slug) {
  return db.bundles.find((b) => b.slug === slug) || null;
}

// Articles that match a bundle's topics or keywords, most recent first.
export function getBundleArticles(bundle) {
  if (!bundle) return [];
  const keywords = (bundle.keywords || []).map((k) => k.toLowerCase());
  return db.articles
    .filter((a) => {
      const topicMatch = a.topics.some((t) => bundle.topics.includes(t));
      const text = `${a.title} ${a.summary}`.toLowerCase();
      const keywordMatch = keywords.some((k) => text.includes(k));
      return topicMatch || keywordMatch;
    })
    .map(enrichArticle)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

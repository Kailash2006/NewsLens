import { db } from '../data/store.js';
import { enrichArticle } from './articleRepo.js';

// A cluster = one real-world event covered by multiple outlets. We attach the
// member articles (enriched) plus a computed bias spread so the UI can show
// how the political lean is distributed across coverage.
export function enrichCluster(cluster) {
  if (!cluster) return null;
  const articles = cluster.articleIds
    .map((id) => db.articles.find((a) => a.id === id))
    .filter(Boolean)
    .map(enrichArticle)
    .sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));

  const biasSpread = {};
  for (const a of articles) {
    const lean = a.source?.bias || 'unknown';
    biasSpread[lean] = (biasSpread[lean] || 0) + 1;
  }

  return {
    ...cluster,
    sourceCount: articles.length,
    biasSpread,
    articles,
  };
}

export function getAllClusters() {
  return db.clusters
    .map(enrichCluster)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function getClusterById(id) {
  const cluster = db.clusters.find((c) => c.id === id);
  return cluster ? enrichCluster(cluster) : null;
}

export function getClusterForArticle(articleId) {
  const cluster = db.clusters.find((c) => c.articleIds.includes(articleId));
  return cluster ? enrichCluster(cluster) : null;
}

import { db } from '../data/store.js';
import { getSourceById } from './sourceRepo.js';

// Joins the denormalized bits a client card needs: source (bias/trust),
// journalist, and any fact-checks. In live mode this becomes a SQL JOIN.
export function enrichArticle(article) {
  if (!article) return null;
  const source = getSourceById(article.sourceId);
  const journalist = db.journalists.find((j) => j.id === article.journalistId) || null;
  const factChecks = (article.factCheckIds || [])
    .map((id) => db.factChecks.find((f) => f.id === id))
    .filter(Boolean);
  return {
    ...article,
    source: source && {
      id: source.id,
      name: source.name,
      slug: source.slug,
      bias: source.bias,
      biasSource: source.biasSource,
      trustScore: source.trustScore,
      brandColor: source.brandColor,
      homepage: source.homepage,
    },
    journalist,
    factChecks,
  };
}

export function getAllArticles() {
  return db.articles.map(enrichArticle);
}

export function getArticleById(id) {
  const article = db.articles.find((a) => a.id === id);
  return article ? enrichArticle(article) : null;
}

export function getArticlesByTopic(topic) {
  return db.articles.filter((a) => a.topics.includes(topic)).map(enrichArticle);
}

export function getArticlesBySource(sourceId) {
  return db.articles.filter((a) => a.sourceId === sourceId).map(enrichArticle);
}

export function getArticlesByJournalist(journalistId) {
  return db.articles.filter((a) => a.journalistId === journalistId).map(enrichArticle);
}

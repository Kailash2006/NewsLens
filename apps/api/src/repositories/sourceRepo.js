import { db } from '../data/store.js';

export function getAllSources() {
  return db.sources;
}

export function getSourceById(id) {
  return db.sources.find((s) => s.id === id) || null;
}

export function getSourceBySlug(slug) {
  return db.sources.find((s) => s.slug === slug) || null;
}

import { db } from '../data/store.js';

// Single demo user in mock mode. In live mode these become row lookups keyed
// by the authenticated user id from the JWT.

export const DEMO_USER_ID = 'usr_demo';

export function getUserById(id) {
  return db.users.find((u) => u.id === id) || null;
}

export function getDemoUser() {
  return getUserById(DEMO_USER_ID);
}

// Records a lightweight tuning signal. Mutates the in-memory seed; a real
// implementation writes to the `signals` / `reading_history` tables.
export function recordSignal(userId, articleId, signal) {
  const user = getUserById(userId);
  if (!user) return null;
  const buckets = {
    up: 'thumbsUp',
    down: 'thumbsDown',
    bookmark: 'bookmarked',
    skip: 'skipped',
  };
  const bucket = buckets[signal];
  if (!bucket) return user;
  user.signals[bucket] = user.signals[bucket] || [];
  if (!user.signals[bucket].includes(articleId)) {
    user.signals[bucket].push(articleId);
  }
  return user;
}

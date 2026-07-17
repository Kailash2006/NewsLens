import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// In DATA_MODE=mock this is the single source of truth. When you wire up
// Postgres (DATA_MODE=live), replace the repository layer with real queries
// and leave the route/service layers untouched.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedDir = path.resolve(__dirname, 'seed');

function load(name) {
  const raw = readFileSync(path.join(seedDir, `${name}.json`), 'utf-8');
  return JSON.parse(raw);
}

export const db = {
  sources: load('sources'),
  journalists: load('journalists'),
  articles: load('articles'),
  clusters: load('clusters'),
  bundles: load('bundles'),
  factChecks: load('factchecks'),
  users: load('users'),
};

export function reload() {
  db.sources = load('sources');
  db.journalists = load('journalists');
  db.articles = load('articles');
  db.clusters = load('clusters');
  db.bundles = load('bundles');
  db.factChecks = load('factchecks');
  db.users = load('users');
}

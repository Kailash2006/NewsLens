-- NewsLens PostgreSQL schema (DATA_MODE=live)
-- Loaded automatically by docker-compose on first boot.

CREATE TYPE bias_lean AS ENUM ('left', 'center-left', 'center', 'center-right', 'right');
CREATE TYPE feed_signal AS ENUM ('up', 'down', 'bookmark', 'skip');

-- Outlets, with editorial lean + reliability metadata.
CREATE TABLE sources (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  homepage      TEXT,
  bias          bias_lean NOT NULL DEFAULT 'center',
  bias_source   TEXT,                 -- AllSides / Ad Fontes Media
  trust_score   INT NOT NULL DEFAULT 50 CHECK (trust_score BETWEEN 0 AND 100),
  country       TEXT,
  brand_color   TEXT
);

CREATE TABLE journalists (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  beat          TEXT,
  lean_profile  bias_lean
);

-- A cluster = one real-world event covered by multiple sources.
CREATE TABLE clusters (
  id              TEXT PRIMARY KEY,
  headline        TEXT NOT NULL,
  neutral_summary TEXT,
  topics          TEXT[] NOT NULL DEFAULT '{}',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE articles (
  id              TEXT PRIMARY KEY,
  source_id       TEXT NOT NULL REFERENCES sources(id),
  cluster_id      TEXT REFERENCES clusters(id) ON DELETE SET NULL,
  journalist_id   TEXT REFERENCES journalists(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  url             TEXT NOT NULL,
  published_at    TIMESTAMPTZ NOT NULL,
  topics          TEXT[] NOT NULL DEFAULT '{}',
  reading_minutes INT DEFAULT 3,
  summary         TEXT,               -- AI TL;DR
  excerpt         TEXT,
  body            TEXT,               -- scraped reader-mode text
  image_color     TEXT
);
CREATE INDEX idx_articles_cluster ON articles(cluster_id);
CREATE INDEX idx_articles_source ON articles(source_id);
CREATE INDEX idx_articles_published ON articles(published_at DESC);
CREATE INDEX idx_articles_topics ON articles USING GIN (topics);

CREATE TABLE fact_checks (
  id          TEXT PRIMARY KEY,
  article_id  TEXT REFERENCES articles(id) ON DELETE CASCADE,
  claim       TEXT NOT NULL,
  verdict     TEXT,                   -- true / false / unsupported / mixture
  source      TEXT,                   -- PolitiFact / Snopes
  url         TEXT,
  explanation TEXT
);

CREATE TABLE bundles (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  slug           TEXT UNIQUE NOT NULL,
  description    TEXT,
  topics         TEXT[] NOT NULL DEFAULT '{}',
  keywords       TEXT[] NOT NULL DEFAULT '{}',
  color          TEXT,
  follower_count INT DEFAULT 0
);

CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  avatar_color  TEXT,
  plan          TEXT NOT NULL DEFAULT 'free',   -- free / reader / pro
  onboarded     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per user; arrays/enum keep the demo simple. Normalize further as needed.
CREATE TABLE user_preferences (
  user_id               TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  topics                TEXT[] NOT NULL DEFAULT '{}',
  followed_source_ids   TEXT[] NOT NULL DEFAULT '{}',
  followed_bundle_ids   TEXT[] NOT NULL DEFAULT '{}',
  followed_journalist_ids TEXT[] NOT NULL DEFAULT '{}',
  bias_filter           TEXT NOT NULL DEFAULT 'all',
  daily_goal_minutes    INT NOT NULL DEFAULT 30,
  digest_cadence        TEXT NOT NULL DEFAULT 'weekly'
);

CREATE TABLE reading_history (
  id          BIGSERIAL PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id  TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  read_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  minutes     INT DEFAULT 0
);
CREATE INDEX idx_history_user ON reading_history(user_id, read_at DESC);

CREATE TABLE user_signals (
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id  TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  signal      feed_signal NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, article_id, signal)
);

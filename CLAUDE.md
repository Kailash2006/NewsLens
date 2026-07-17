# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

NewsLens is a bias-aware, multi-source news aggregator: it clusters coverage of the
same event from multiple outlets and shows them side by side with AI summaries,
political-bias labels, and source trust scores.

The repo is a **full-stack scaffold**. The web app and API run end-to-end today on
seed data with no API keys. Every external service (Postgres, Redis, Elasticsearch,
OpenAI, Google OAuth, NewsAPI, SendGrid) sits behind a seam that is currently a mock
implementation with a documented `TODO(live)`.

## Commands

```bash
npm install            # installs the apps/api + apps/web workspaces
npm run dev            # API (:4000) + web (:5173) together
npm run dev:api        # API only
npm run dev:web        # web only
npm run build:web      # production build of the frontend

cd services && python -m pipeline.run   # NLP clustering demo over the seed articles
```

There is **no test suite and no linter configured** — do not invent commands for
them. `npm run build:web` and the pipeline run are the available correctness checks.
Verify API behavior by curling endpoints; `GET /api/` returns the live endpoint list.

## The mock/live seam — the central design idea

`DATA_MODE` in the repo-root `.env` (default `mock`) drives everything. `config.js`
exports `isMock`, and each service branches on it or on the presence of a key:

| Concern | Mock (now) | Live seam |
|---|---|---|
| Database | seed JSON via `apps/api/src/data/store.js` | `repositories/*` → Postgres (`infra/db/schema.sql`) |
| Cache | in-memory Map w/ TTL (`services/cache.js`) | Redis |
| Search | naive scoring (`services/search.js`) | Elasticsearch |
| AI | returns pre-written seed summaries (`services/openai.js`) | OpenAI GPT-4o |
| Auth | `attachUser` auto-resolves the demo user | Google OAuth + JWT |

**When adding a feature, keep routes and services unaware of the mode.** The mode
should only be visible inside the service/repository implementation.

The seed data in `apps/api/src/data/seed/*.json` is the source of truth in mock mode.
The Python pipeline reads that **same directory** (`config.SEED_DIR`), so the two
sides stay consistent.

## Request flow

```
seed JSON → store.js → repositories (join/enrich) → services (rank/score) → routes → web
```

The repository layer does what SQL joins will do in live mode, and this is the part
that requires reading several files to grasp:

- `articleRepo.enrichArticle()` attaches `source` (bias, trust, brand color),
  `journalist`, and `factChecks` onto a raw article. **Almost every endpoint returns
  enriched articles** — the web app assumes `article.source.bias` exists.
- `clusterRepo.enrichCluster()` attaches the member articles and computes
  `biasSpread` (a lean→count map) that powers the coverage-spread bar.

`services/feedService.js` holds the ranking. `WEIGHTS` at the top is the tuning
surface (topics, followed sources/journalists, thumbs, recency decay, trust bonus).
Three modes: `personalized` (uses signals), `trending` (recency + trust, ignores the
user), `latest` (pure recency). Feeds are cached per user+mode+filter for 30 min;
`POST /api/feed/signal` busts that key, and the key format must match on both sides.

## Bias vocabulary is duplicated in four places

The five leans (`left`, `center-left`, `center`, `center-right`, `right`) are declared
independently in:

1. `apps/api/src/services/biasService.js` (`BIAS_ORDER`, `BIAS_LABELS`)
2. `apps/web/src/lib/bias.js` (`BIAS_ORDER`, `BIAS_META` + colors)
3. `services/pipeline/config.py` (`SOURCE_RATINGS`)
4. `infra/db/schema.sql` (`bias_lean` enum)

Changing the vocabulary means touching all four. Bias/trust ratings come from
AllSides and Ad Fontes Media.

**Filter values are not the same as leans:** `?bias=` accepts `all`, `centrist` (the
Center-Left→Center-Right *band*), or one exact lean. `centrist` and `center` are
deliberately different — do not collapse them.

## Gotchas

- **Mock state is in-memory.** Signals (thumbs/saves) mutate the loaded seed objects
  and reset on every API restart, including the `node --watch` reload on file save.
  A signal that "doesn't stick" is usually this, not a logic bug.
- **Clustering threshold is tuned, not arbitrary.** `cluster_articles(threshold=0.10)`
  in `services/pipeline/nlp/cluster.py` was fitted against the seed set's known
  clusters; higher over-splits coverage of one event, lower merges unrelated stories.
  `cluster.py` falls back to pure-Python cosine if scikit-learn is missing.
- The web dev server **proxies `/api` → `:4000`** (see `vite.config.js`), so the
  frontend uses relative paths and CORS is not involved in dev.
- Seed article timestamps are dated **July 2026**; relative times ("2h ago") assume a
  current date around then.

## Adding to the frontend

React + Vite + Tailwind, dark-mode only (`class="dark"` is hardcoded on `<html>`).
Shared styling lives in `@layer components` in `src/index.css` (`.card`, `.chip`,
`.btn-*`) — prefer those over re-deriving styles. Data fetching goes through
`src/api/client.js` and the `useAsync` hook; pages render `Loading`/`ErrorBlock` from
`components/StateBlocks.jsx`.

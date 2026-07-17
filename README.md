# NewsLens

> A bias-aware, multi-source news aggregator with an AI personalization layer.
> Instead of trapping you in a filter bubble, NewsLens shows the same story from
> multiple outlets side by side — with AI summaries, political-bias labels, and
> source trust scores — so you always get the full picture.

This repository is a **full-stack architecture scaffold**. Every part of the
system in the product spec has a home here, and the web app + API **run today on
realistic mock/seed data with zero external accounts or API keys**. Each
external service (Postgres, Redis, Elasticsearch, OpenAI, Google OAuth, NewsAPI,
SendGrid) sits behind a clean seam you can wire up incrementally by flipping
`DATA_MODE=mock` → `live`.

---

## Monorepo layout

```
newslens/
├── apps/
│   ├── web/                 React + Vite + TailwindCSS frontend
│   │   └── src/
│   │       ├── pages/         Feed, Stories, Bundles, Sources, Dashboard
│   │       ├── components/    ArticleCard, StoryCluster, BiasBadge, TrustScore…
│   │       ├── api/           typed fetch client
│   │       └── lib/           bias colors, formatting
│   └── api/                 Node + Express API layer
│       └── src/
│           ├── routes/        feed, stories, bundles, sources, search, me, auth
│           ├── services/      feed ranking, bias stats, cache, search, openai
│           ├── repositories/  data access (swap mock JSON → Postgres)
│           └── data/seed/     the mock dataset (sources, articles, clusters…)
├── services/
│   └── pipeline/            Python ingestion + NLP (BeautifulSoup, TF-IDF, OpenAI)
├── infra/
│   └── db/                  PostgreSQL schema + seed
├── docker-compose.yml       Postgres, Redis, Elasticsearch (for live mode)
└── .env.example             all configuration, documented
```

## Tech stack (per the spec)

| Layer            | Technology                                   | Status in scaffold |
|------------------|----------------------------------------------|--------------------|
| Frontend         | React, TailwindCSS, Vite, React Router       | ✅ working          |
| API              | Node.js, Express                             | ✅ working (mock)   |
| Pipeline / NLP   | Python, BeautifulSoup, scikit-learn, NewsAPI | ✅ mock demo, live wired |
| AI               | OpenAI GPT-4o (summaries, bias, clustering)  | 🔌 stubbed seam     |
| Database         | PostgreSQL                                   | 🔌 schema + seam    |
| Search           | Elasticsearch                                | 🔌 in-memory seam   |
| Cache            | Redis                                        | 🔌 in-memory seam   |
| Auth             | Google OAuth + JWT                           | 🔌 mock login + seam |
| Email            | SendGrid (weekly digest)                     | 🔌 seam             |
| Deployment       | Docker, AWS EC2, cron                        | ✅ docker-compose   |

`✅` runs now · `🔌` clean seam with a documented TODO for live mode

---

## Quick start (mock mode — nothing to install but Node)

```bash
# from the repo root
npm install            # installs api + web workspaces
cp .env.example .env   # optional; mock mode works without it
npm run dev            # starts API (:4000) and web (:5173) together
```

Then open **http://localhost:5173**.

Run just one side if you prefer:

```bash
npm run dev:api        # http://localhost:4000/api
npm run dev:web        # http://localhost:5173
```

### Run the NLP pipeline demo (no keys needed)

```bash
cd services
pip install -r pipeline/requirements.txt   # scikit-learn etc. (optional; has a fallback)
python -m pipeline.run                      # re-clusters the seed articles and prints the groups
```

---

## What actually works in mock mode

- **Personalized feed** with `For You` / `Trending` / `Latest` modes and a live
  relevance score computed from topics, followed sources, thumbs, and recency.
- **Thumbs up/down/save** signals that re-rank the personalized feed in real time
  (and bust the feed cache).
- **Multi-source story view** — articles clustered by event, shown side by side,
  with a color-coded **bias-spread bar**.
- **Bias labels + trust scores** on every card, sourced from AllSides / Ad Fontes.
- **Bias filter** — `centrist` for the Center-Left→Center-Right band, or any single lean.
- **Topic bundles** with follower counts and keyword chips.
- **Reading dashboard** — articles/minutes read, a daily-goal progress ring, and a
  distribution chart of how your reading leans (with a −1…+1 lean score).
- **Fact-check flags** on articles with disputed claims.

> **Note:** in mock mode, signals (thumbs/saves) mutate the seed data **in
> memory only** — they reset whenever the API restarts, including on the
> file-watcher reload during development. That's expected; persistence arrives
> with Postgres in live mode.

## Going live (incrementally)

1. `docker compose up -d` to start Postgres, Redis, Elasticsearch.
2. Fill in `.env` (`DATABASE_URL`, `REDIS_URL`, `OPENAI_API_KEY`, Google OAuth…).
3. Set `DATA_MODE=live`.
4. Implement the seams marked `TODO(live)` — each service file
   (`apps/api/src/services/*.js`) documents exactly what to swap in.

See [apps/api](apps/api) route/service files and
[services/pipeline/README.md](services/pipeline/README.md) for the details.

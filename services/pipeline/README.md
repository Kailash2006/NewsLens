# NewsLens Pipeline

Python ingestion + NLP pipeline: scrape/ingest → summarize → label bias → cluster.

## Layout

```
pipeline/
├── config.py            # env + source bias/trust reference table
├── ingest/
│   ├── newsapi_client.py  # NewsAPI headlines (live mode)
│   └── scraper.py         # BeautifulSoup article-body extraction (live mode)
├── nlp/
│   ├── cluster.py         # TF-IDF + cosine similarity multi-source clustering
│   ├── summarize.py       # OpenAI GPT-4o TL;DR (mock stub without a key)
│   └── bias.py            # AllSides / Ad Fontes bias + trust labeling
└── run.py               # orchestrator (mock demo / live pipeline)
```

## Run (mock mode — no keys needed)

```bash
cd services
python -m pipeline.run
```

This re-clusters the seed articles and prints the discovered multi-source
stories, proving the NLP core works. In **live mode** (`DATA_MODE=live` +
`NEWSAPI_KEY` / `OPENAI_API_KEY` in the repo-root `.env`) it ingests real
articles and is wired to write into Postgres (write path stubbed).

Install deps first: `pip install -r requirements.txt`

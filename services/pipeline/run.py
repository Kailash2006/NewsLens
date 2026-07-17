"""Pipeline orchestrator.

Mock mode (default): loads the existing seed articles, re-runs the clustering
algorithm over them, and prints the discovered multi-source groups — a live
demonstration that the NLP core works end-to-end without any API keys.

Live mode: ingest (NewsAPI) -> scrape bodies (BeautifulSoup) -> summarize
(OpenAI) -> label bias -> cluster -> write to Postgres. Those write paths are
stubbed where they need real credentials; the flow is wired and documented.

Run:
    cd services/pipeline
    python -m pipeline.run          # from the repo root: python -m services.pipeline.run
"""
from __future__ import annotations

import json

from .config import IS_MOCK, SEED_DIR
from .nlp.cluster import cluster_articles
from .nlp.summarize import summarize
from .nlp.bias import label_for_source
from .ingest.newsapi_client import fetch_articles
from .ingest.scraper import scrape_body


def load_seed_articles() -> list[dict]:
    with open(SEED_DIR / "articles.json", encoding="utf-8") as fh:
        return json.load(fh)


def run_mock() -> None:
    print("NewsLens pipeline — MOCK mode\n" + "-" * 40)
    articles = load_seed_articles()
    print(f"Loaded {len(articles)} seed articles.")

    clusters = cluster_articles(articles)
    multi = {k: v for k, v in clusters.items() if len(v) > 1}
    print(f"Discovered {len(clusters)} clusters ({len(multi)} multi-source):\n")

    for idx, group in sorted(clusters.items()):
        tag = "MULTI-SOURCE" if len(group) > 1 else "single"
        print(f"  [cluster {idx}] {tag} · {len(group)} article(s)")
        for a in group:
            print(f"      - {a['title']}")
    print("\nClustering core verified. In live mode this writes to Postgres.")


def run_live() -> None:
    print("NewsLens pipeline — LIVE mode\n" + "-" * 40)
    raw = fetch_articles(query="top news", sources=None)
    print(f"Fetched {len(raw)} articles from NewsAPI.")

    processed = []
    for item in raw:
        body = scrape_body(item.get("url", ""), fallback=item.get("description", ""))
        summary = summarize(item.get("title", ""), body)
        source_slug = (item.get("source", {}) or {}).get("id", "unrated")
        label = label_for_source(source_slug)
        processed.append({**item, "summary": summary, **label})

    clusters = cluster_articles(processed)
    print(f"Clustered into {len(clusters)} stories.")
    # TODO(live): upsert sources/articles/clusters into Postgres via psycopg.
    print("Live write path not yet implemented — see run.py.")


if __name__ == "__main__":
    run_mock() if IS_MOCK else run_live()

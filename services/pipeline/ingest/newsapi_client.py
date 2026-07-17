"""NewsAPI ingestion. In mock mode, returns nothing (the pipeline uses the
existing seed articles). In live mode, pulls recent headlines per source."""
from __future__ import annotations

import requests

from ..config import NEWSAPI_KEY, IS_MOCK

NEWSAPI_URL = "https://newsapi.org/v2/everything"


def fetch_articles(query: str, sources: list[str] | None = None, page_size: int = 50):
    """Return a list of raw article dicts from NewsAPI (live mode only)."""
    if IS_MOCK or not NEWSAPI_KEY:
        return []

    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": page_size,
        "apiKey": NEWSAPI_KEY,
    }
    if sources:
        params["sources"] = ",".join(sources)

    resp = requests.get(NEWSAPI_URL, params=params, timeout=20)
    resp.raise_for_status()
    return resp.json().get("articles", [])

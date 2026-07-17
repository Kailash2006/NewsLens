"""Article body scraper (BeautifulSoup). Live mode fetches and cleans the
full article text; mock mode is a no-op that returns the provided excerpt."""
from __future__ import annotations

import requests
from bs4 import BeautifulSoup

from ..config import IS_MOCK

HEADERS = {"User-Agent": "NewsLensBot/0.1 (+https://newslens.app)"}


def scrape_body(url: str, fallback: str = "") -> str:
    """Return clean reader-mode text for an article URL."""
    if IS_MOCK:
        return fallback

    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        resp.raise_for_status()
    except requests.RequestException:
        return fallback

    soup = BeautifulSoup(resp.text, "lxml")
    for tag in soup(["script", "style", "nav", "footer", "aside"]):
        tag.decompose()

    paragraphs = [p.get_text(" ", strip=True) for p in soup.find_all("p")]
    text = "\n\n".join(p for p in paragraphs if len(p) > 40)
    return text or fallback

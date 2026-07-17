"""Pipeline configuration. Reads from the repo-root .env; mock mode needs none."""
from __future__ import annotations

import os
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

DATA_MODE = os.getenv("DATA_MODE", "mock")           # mock | live
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_SUMMARY_MODEL", "gpt-4o")
DATABASE_URL = os.getenv("DATABASE_URL", "")

# In mock mode the pipeline writes seed JSON that the API already consumes.
SEED_DIR = ROOT / "apps" / "api" / "src" / "data" / "seed"
OUT_DIR = Path(__file__).resolve().parent / "out"

IS_MOCK = DATA_MODE != "live"

# Editorial bias + trust reference (AllSides / Ad Fontes). In live mode this
# would be loaded from a maintained ratings table.
SOURCE_RATINGS = {
    "reuters": {"bias": "center", "trust": 94, "rated_by": "AllSides"},
    "ap": {"bias": "center", "trust": 93, "rated_by": "AllSides"},
    "bbc": {"bias": "center-left", "trust": 88, "rated_by": "Ad Fontes Media"},
    "guardian": {"bias": "left", "trust": 80, "rated_by": "AllSides"},
    "wsj": {"bias": "center-right", "trust": 85, "rated_by": "AllSides"},
    "fox-business": {"bias": "right", "trust": 62, "rated_by": "AllSides"},
    "the-hindu": {"bias": "center-left", "trust": 82, "rated_by": "Ad Fontes Media"},
    "times-of-india": {"bias": "center", "trust": 71, "rated_by": "Ad Fontes Media"},
}

"""Bias labeling. Primary signal is the source's editorial lean from the
AllSides / Ad Fontes reference table; OpenAI can refine per-article tone in
live mode."""
from __future__ import annotations

from ..config import SOURCE_RATINGS


def label_for_source(source_slug: str) -> dict:
    rating = SOURCE_RATINGS.get(source_slug)
    if not rating:
        return {"bias": "center", "trust": 50, "rated_by": "unrated"}
    return {
        "bias": rating["bias"],
        "trust": rating["trust"],
        "rated_by": rating["rated_by"],
    }

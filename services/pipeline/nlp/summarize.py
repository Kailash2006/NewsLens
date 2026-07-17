"""OpenAI summarization. Mock mode returns a deterministic TL;DR from the
excerpt; live mode calls GPT-4o with a who/what/when/where/why prompt."""
from __future__ import annotations

from ..config import OPENAI_API_KEY, OPENAI_MODEL, IS_MOCK

SYSTEM_PROMPT = (
    "You are a neutral news summarizer. Produce a single paragraph TL;DR under "
    "100 words covering who, what, when, where, and why. Do not editorialize."
)


def summarize(title: str, body: str) -> str:
    if IS_MOCK or not OPENAI_API_KEY:
        snippet = (body or title).strip().replace("\n", " ")
        return (snippet[:280] + "…") if len(snippet) > 280 else snippet

    from openai import OpenAI

    client = OpenAI(api_key=OPENAI_API_KEY)
    resp = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Title: {title}\n\nArticle:\n{body}"},
        ],
        temperature=0.3,
        max_tokens=200,
    )
    return resp.choices[0].message.content.strip()

"""Multi-source story clustering via TF-IDF + cosine similarity.

This is the ML core of the "same story, every angle" feature: group articles
that cover the same real-world event even when the headlines differ. Uses
scikit-learn's TF-IDF vectorizer and agglomerative clustering on cosine
distance. Falls back to a pure-Python cosine grouping if scikit-learn is absent
(so the scaffold runs in minimal environments)."""
from __future__ import annotations

from collections import defaultdict


def _text(article: dict) -> str:
    return f"{article.get('title', '')} {article.get('summary', '')} {article.get('excerpt', '')}"


def cluster_articles(articles: list[dict], threshold: float = 0.10) -> dict[int, list[dict]]:
    """Group articles into clusters. Returns {cluster_index: [articles]}.

    `threshold` is the minimum cosine similarity for two articles to land in the
    same story. Tuned against the seed set's known clusters: 0.10 recovers them
    cleanly, while higher values over-split coverage of the same event (outlets
    reuse surprisingly little vocabulary) and lower values start merging
    unrelated stories that share generic news terms.
    """
    if not articles:
        return {}

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.cluster import AgglomerativeClustering

        texts = [_text(a) for a in articles]
        tfidf = TfidfVectorizer(stop_words="english").fit_transform(texts)
        model = AgglomerativeClustering(
            n_clusters=None,
            metric="cosine",
            linkage="average",
            distance_threshold=1 - threshold,
        )
        labels = model.fit_predict(tfidf.toarray())
    except Exception:  # scikit-learn unavailable — naive fallback
        labels = _naive_labels(articles, threshold)

    clusters: dict[int, list[dict]] = defaultdict(list)
    for article, label in zip(articles, labels):
        clusters[int(label)].append(article)
    return dict(clusters)


def _naive_labels(articles: list[dict], threshold: float) -> list[int]:
    """Greedy cosine grouping without external deps."""
    labels = [-1] * len(articles)
    next_label = 0
    for i, a in enumerate(articles):
        if labels[i] != -1:
            continue
        labels[i] = next_label
        for j in range(i + 1, len(articles)):
            if labels[j] == -1 and _cosine(_text(a), _text(articles[j])) >= threshold:
                labels[j] = next_label
        next_label += 1
    return labels


def _cosine(a: str, b: str) -> float:
    ta, tb = _bag(a), _bag(b)
    dot = sum(ta[w] * tb.get(w, 0) for w in ta)
    mag = (sum(v * v for v in ta.values()) ** 0.5) * (sum(v * v for v in tb.values()) ** 0.5)
    return dot / mag if mag else 0.0


def _bag(text: str) -> dict[str, int]:
    bag: dict[str, int] = defaultdict(int)
    for w in text.lower().split():
        w = "".join(c for c in w if c.isalnum())
        if len(w) > 2:
            bag[w] += 1
    return bag

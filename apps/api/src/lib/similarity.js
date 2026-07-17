// Lightweight TF cosine similarity used by the clustering demo. The Python
// pipeline (services/pipeline) does the heavy clustering; this mirrors the
// idea in JS so the API can cluster on the fly if needed.

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function termFreq(tokens) {
  const tf = new Map();
  for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
  return tf;
}

export function cosineSimilarity(a, b) {
  const tfA = termFreq(tokenize(a));
  const tfB = termFreq(tokenize(b));
  let dot = 0;
  for (const [term, freq] of tfA) {
    if (tfB.has(term)) dot += freq * tfB.get(term);
  }
  const magA = Math.sqrt([...tfA.values()].reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt([...tfB.values()].reduce((s, v) => s + v * v, 0));
  if (!magA || !magB) return 0;
  return dot / (magA * magB);
}

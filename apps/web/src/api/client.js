// Tiny fetch wrapper. Uses relative /api paths (Vite proxies to the API in dev).
const BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  health: () => request('/api/health'),
  feed: (mode = 'personalized', bias = 'all') =>
    request(`/api/feed?mode=${mode}&bias=${bias}`),
  signal: (articleId, signal) =>
    request('/api/feed/signal', { method: 'POST', body: JSON.stringify({ articleId, signal }) }),
  stories: () => request('/api/stories'),
  story: (id) => request(`/api/stories/${id}`),
  bundles: () => request('/api/bundles'),
  bundle: (slug) => request(`/api/bundles/${slug}`),
  sources: () => request('/api/sources'),
  search: (q) => request(`/api/search?q=${encodeURIComponent(q)}`),
  me: () => request('/api/me'),
  dashboard: () => request('/api/me/dashboard'),
  bookmarks: () => request('/api/me/bookmarks'),
};

export const BIAS_ORDER = ['left', 'center-left', 'center', 'center-right', 'right'];

export const BIAS_META = {
  left: { label: 'Left', color: '#3b82f6' },
  'center-left': { label: 'Center-Left', color: '#60a5fa' },
  center: { label: 'Center', color: '#a855f7' },
  'center-right': { label: 'Center-Right', color: '#f59e0b' },
  right: { label: 'Right', color: '#ef4444' },
};

export function biasColor(bias) {
  return BIAS_META[bias]?.color || '#94a3b8';
}

export function biasLabel(bias) {
  return BIAS_META[bias]?.label || 'Unrated';
}

export function trustTone(score) {
  if (score >= 88) return { label: 'Very high', color: '#22c55e' };
  if (score >= 78) return { label: 'High', color: '#84cc16' };
  if (score >= 68) return { label: 'Moderate', color: '#eab308' };
  return { label: 'Mixed', color: '#f97316' };
}

// Outlet initials for the square logo chip. Skips a leading "The" and uses the
// first letter of each significant word, so "The Guardian" -> GU and
// "The Wall Street Journal" -> WSJ rather than both collapsing to "TH".
export function sourceInitials(name = '') {
  const words = name.split(/\s+/).filter((w) => w && !/^(the|of|and)$/i.test(w));
  if (words.length === 0) return name.slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.map((w) => w[0]).join('').slice(0, 3).toUpperCase();
}

export function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.max(1, Math.round(diff / 60))}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

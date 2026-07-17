import { useState } from 'react';
import { api } from '../api/client.js';
import { useAsync } from '../hooks/useAsync.js';
import ArticleCard from '../components/ArticleCard.jsx';
import { Loading, ErrorBlock, SectionTitle } from '../components/StateBlocks.jsx';
import { BIAS_ORDER, biasLabel } from '../lib/bias.js';

const MODES = [
  { id: 'personalized', label: 'For You' },
  { id: 'trending', label: 'Trending' },
  { id: 'latest', label: 'Latest' },
];

export default function FeedPage() {
  const [mode, setMode] = useState('personalized');
  const [bias, setBias] = useState('all');
  const { data, error, loading, reload } = useAsync(() => api.feed(mode, bias), [mode, bias]);

  const onSignal = async (articleId, signal) => {
    try {
      await api.signal(articleId, signal);
      if (mode === 'personalized') reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <SectionTitle eyebrow="Your feed" title="The full picture, ranked for you">
        <div className="text-xs text-slate-500">
          {data ? `${data.count} articles` : ''}
        </div>
      </SectionTitle>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl border border-white/10 bg-ink-900 p-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                mode === m.id ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <select
          value={bias}
          onChange={(e) => setBias(e.target.value)}
          className="rounded-xl border border-white/10 bg-ink-900 px-3 py-2 text-sm text-slate-300"
        >
          <option value="all">All perspectives</option>
          <option value="centrist">Centrist only (C-L → C-R)</option>
          {BIAS_ORDER.map((b) => (
            <option key={b} value={b}>{biasLabel(b)} only</option>
          ))}
        </select>
      </div>

      {loading && <Loading label="Ranking your feed…" />}
      {error && <ErrorBlock error={error} />}
      {data && (
        <div className="grid gap-4 md:grid-cols-2">
          {data.items.map((article) => (
            <ArticleCard key={article.id} article={article} onSignal={onSignal} />
          ))}
        </div>
      )}
    </div>
  );
}

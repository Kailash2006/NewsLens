import { Link } from 'react-router-dom';
import BiasBadge from './BiasBadge.jsx';
import TrustScore from './TrustScore.jsx';
import { timeAgo, sourceInitials } from '../lib/bias.js';

export default function ArticleCard({ article, onSignal }) {
  const s = article.source || {};
  return (
    <article className="card p-5 transition hover:border-white/10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="grid h-7 w-7 place-items-center rounded-lg text-[11px] font-bold text-white"
            style={{ backgroundColor: s.brandColor || '#334155' }}
          >
            {sourceInitials(s.name)}
          </span>
          <div className="leading-tight">
            <div className="text-sm font-medium text-slate-200">{s.name}</div>
            <div className="text-[11px] text-slate-500">{timeAgo(article.publishedAt)} · {article.readingMinutes} min read</div>
          </div>
        </div>
        <BiasBadge bias={s.bias} source={s.name} />
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-100">{article.title}</h3>

      <div className="mt-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-soft">
          <SparkIcon /> AI summary
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{article.summary}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {article.topics.slice(0, 3).map((t) => (
          <span key={t} className="chip bg-white/5 text-slate-400">#{t}</span>
        ))}
        {article.factChecks?.length > 0 && (
          <span className="chip bg-amber-500/15 text-amber-300" title={article.factChecks[0].claim}>
            ⚑ {article.factChecks.length} fact-check
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex items-center gap-3">
          <TrustScore score={s.trustScore} />
          {article.cluster && (
            <Link
              to={`/stories#${article.cluster.id}`}
              className="text-[11px] font-medium text-brand-soft hover:underline"
            >
              ⧉ {article.cluster.sourceCount} sources on this story
            </Link>
          )}
        </div>
        <div className="flex items-center gap-1">
          <SignalButton label="Good pick" onClick={() => onSignal?.(article.id, 'up')}>👍</SignalButton>
          <SignalButton label="Less like this" onClick={() => onSignal?.(article.id, 'down')}>👎</SignalButton>
          <SignalButton label="Save" onClick={() => onSignal?.(article.id, 'bookmark')}>🔖</SignalButton>
        </div>
      </div>
    </article>
  );
}

function SignalButton({ children, label, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-lg text-sm transition hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function SparkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.9 5.8L20 9.6l-4.9 3.6L17 19l-5-3.4L7 19l1.9-5.8L4 9.6l6.1-1.8z" />
    </svg>
  );
}

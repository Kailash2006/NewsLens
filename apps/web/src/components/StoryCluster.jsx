import BiasBadge from './BiasBadge.jsx';
import TrustScore from './TrustScore.jsx';
import { BIAS_ORDER, biasColor, sourceInitials } from '../lib/bias.js';

// The signature NewsLens view: one event, every outlet, side by side, with a
// bias-spread bar so you can see the shape of the coverage at a glance.
export default function StoryCluster({ cluster }) {
  return (
    <section id={cluster.id} className="card p-5 scroll-mt-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-1.5">
            {cluster.topics.map((t) => (
              <span key={t} className="chip bg-white/5 text-slate-400">#{t}</span>
            ))}
          </div>
          <h2 className="mt-2 text-xl font-bold leading-snug text-slate-100">{cluster.headline}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">{cluster.neutralSummary}</p>
        </div>
        <BiasSpread spread={cluster.biasSpread} total={cluster.sourceCount} />
      </div>

      <div className="scroll-x mt-4 flex snap-x gap-3 overflow-x-auto pb-2">
        {cluster.articles.map((a) => (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noreferrer"
            className="group w-72 shrink-0 snap-start rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/15"
          >
            <div className="flex items-center justify-between">
              <span
                className="grid h-6 w-6 place-items-center rounded text-[10px] font-bold text-white"
                style={{ backgroundColor: a.source?.brandColor || '#334155' }}
              >
                {sourceInitials(a.source?.name)}
              </span>
              <BiasBadge bias={a.source?.bias} />
            </div>
            <h4 className="mt-2 text-sm font-semibold leading-snug text-slate-200 group-hover:text-white">
              {a.title}
            </h4>
            <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-slate-400">{a.summary}</p>
            <div className="mt-3 flex items-center justify-between">
              <TrustScore score={a.source?.trustScore} />
              <span className="text-[11px] text-brand-soft group-hover:underline">Read →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function BiasSpread({ spread, total }) {
  return (
    <div className="w-52">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        Coverage spread · {total} outlets
      </div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-white/5">
        {BIAS_ORDER.map((bias) => {
          const n = spread[bias] || 0;
          if (!n) return null;
          return (
            <div
              key={bias}
              style={{ flex: n, backgroundColor: biasColor(bias) }}
              title={`${bias}: ${n}`}
            />
          );
        })}
      </div>
    </div>
  );
}

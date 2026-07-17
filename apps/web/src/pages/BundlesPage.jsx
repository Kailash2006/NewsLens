import { api } from '../api/client.js';
import { useAsync } from '../hooks/useAsync.js';
import { Loading, ErrorBlock, SectionTitle } from '../components/StateBlocks.jsx';

export default function BundlesPage() {
  const { data, error, loading } = useAsync(() => api.bundles(), []);

  return (
    <div>
      <SectionTitle eyebrow="Topic bundles" title="Follow the topics you care about" />

      {loading && <Loading label="Loading bundles…" />}
      {error && <ErrorBlock error={error} />}
      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((b) => (
            <div key={b.id} className="card overflow-hidden">
              <div className="h-1.5" style={{ backgroundColor: b.color }} />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{b.name}</h3>
                  <span className="chip bg-white/5 text-slate-400">
                    {b.followerCount.toLocaleString()} followers
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{b.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {b.keywords.slice(0, 4).map((k) => (
                    <span key={k} className="chip bg-white/5 text-[11px] text-slate-500">{k}</span>
                  ))}
                </div>
                <button
                  className="btn-ghost mt-4 w-full"
                  style={{ borderColor: `${b.color}55`, color: b.color }}
                >
                  + Follow bundle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

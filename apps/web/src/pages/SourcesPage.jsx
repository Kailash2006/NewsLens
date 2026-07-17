import { api } from '../api/client.js';
import { useAsync } from '../hooks/useAsync.js';
import BiasBadge from '../components/BiasBadge.jsx';
import TrustScore from '../components/TrustScore.jsx';
import { Loading, ErrorBlock, SectionTitle } from '../components/StateBlocks.jsx';
import { sourceInitials } from '../lib/bias.js';

export default function SourcesPage() {
  const { data, error, loading } = useAsync(() => api.sources(), []);

  return (
    <div>
      <SectionTitle eyebrow="Transparency" title="Sources, rated" />
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-slate-400">
        Bias labels are sourced from AllSides and Ad Fontes Media. Trust scores reflect media
        reliability databases. Both appear on every article card across NewsLens.
      </p>

      {loading && <Loading label="Loading sources…" />}
      {error && <ErrorBlock error={error} />}
      {data && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Outlet</th>
                <th className="px-5 py-3">Bias</th>
                <th className="px-5 py-3">Rated by</th>
                <th className="px-5 py-3">Trust</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((s) => (
                <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="grid h-6 w-6 place-items-center rounded text-[10px] font-bold text-white"
                        style={{ backgroundColor: s.brandColor }}
                      >
                        {sourceInitials(s.name)}
                      </span>
                      <span className="font-medium text-slate-200">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><BiasBadge bias={s.bias} /></td>
                  <td className="px-5 py-3 text-slate-400">{s.biasSource}</td>
                  <td className="px-5 py-3"><TrustScore score={s.trustScore} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

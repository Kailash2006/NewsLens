import { api } from '../api/client.js';
import { useAsync } from '../hooks/useAsync.js';
import { Loading, ErrorBlock, SectionTitle } from '../components/StateBlocks.jsx';
import { biasColor } from '../lib/bias.js';

export default function DashboardPage() {
  const { data, error, loading } = useAsync(() => api.dashboard(), []);

  return (
    <div>
      <SectionTitle eyebrow="Your reading" title="Bias & reading dashboard" />

      {loading && <Loading label="Crunching your reading history…" />}
      {error && <ErrorBlock error={error} />}
      {data && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Stat label="Articles read" value={data.articlesRead} />
          <Stat label="Minutes read" value={data.totalMinutes} suffix="min" />
          <GoalRing percent={data.goalProgressPercent} goal={data.dailyGoalMinutes} minutes={data.totalMinutes} />

          <div className="card p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-200">Where your reading leans</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Distribution across {data.bias.total} articles ·
              lean score {data.bias.leanScore} (−1 left → +1 right)
            </p>
            <div className="mt-4 space-y-2.5">
              {data.bias.distribution.map((d) => (
                <div key={d.bias} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-slate-400">{d.label}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.max(d.percent, d.count ? 4 : 0)}%`, backgroundColor: biasColor(d.bias) }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs tabular-nums text-slate-400">{d.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-200">Recently read</h3>
            <ul className="mt-3 space-y-3">
              {data.recent.map((r) => (
                <li key={r.id} className="text-sm">
                  <div className="line-clamp-2 text-slate-300">{r.title}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: biasColor(r.bias) }} />
                    {r.source}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, suffix }) {
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-3xl font-bold text-white">
        {value}
        {suffix && <span className="ml-1 text-base font-medium text-slate-500">{suffix}</span>}
      </div>
    </div>
  );
}

function GoalRing({ percent, goal, minutes }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(percent, 100) / 100) * c;
  return (
    <div className="card flex items-center gap-4 p-5">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="44" cy="44" r={r} fill="none" stroke="#6366f1" strokeWidth="8"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        />
      </svg>
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500">Daily goal</div>
        <div className="text-2xl font-bold text-white">{percent}%</div>
        <div className="text-[11px] text-slate-500">{minutes} / {goal} min</div>
      </div>
    </div>
  );
}

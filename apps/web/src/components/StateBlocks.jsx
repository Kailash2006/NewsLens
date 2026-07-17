export function Loading({ label = 'Loading…' }) {
  return (
    <div className="grid place-items-center py-24 text-slate-500">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-brand" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}

export function ErrorBlock({ error }) {
  return (
    <div className="card mx-auto max-w-lg p-6 text-center">
      <p className="text-sm font-semibold text-red-300">Couldn't reach the API</p>
      <p className="mt-1 text-xs text-slate-400">{String(error?.message || error)}</p>
      <p className="mt-3 text-xs text-slate-500">
        Start it with <code className="rounded bg-white/10 px-1">npm run dev:api</code> from the repo root.
      </p>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="text-xs font-semibold uppercase tracking-wide text-brand-soft">{eyebrow}</div>}
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      {children}
    </div>
  );
}

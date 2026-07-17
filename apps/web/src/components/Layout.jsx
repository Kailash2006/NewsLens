import { NavLink, Link } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Feed', end: true },
  { to: '/stories', label: 'Stories' },
  { to: '/bundles', label: 'Bundles' },
  { to: '/sources', label: 'Sources' },
  { to: '/dashboard', label: 'Dashboard' },
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-ink-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-white">
              <LensIcon />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              News<span className="text-brand-soft">Lens</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-slate-500 sm:block">Demo Reader</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/30 text-sm font-bold text-brand-soft">
              D
            </span>
          </div>
        </div>

        {/* mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-t border-white/5 px-3 py-2 md:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1 text-sm ${
                  isActive ? 'bg-white/10 text-white' : 'text-slate-400'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-slate-600">
        NewsLens — bias-aware, multi-source news. Running on mock seed data.
      </footer>
    </div>
  );
}

function LensIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

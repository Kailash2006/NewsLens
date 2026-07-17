import { biasColor, biasLabel } from '../lib/bias.js';

export default function BiasBadge({ bias, source, size = 'sm' }) {
  const color = biasColor(bias);
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`chip ${pad} font-semibold`}
      style={{ backgroundColor: `${color}22`, color }}
      title={source ? `${source} — rated ${biasLabel(bias)}` : biasLabel(bias)}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {biasLabel(bias)}
    </span>
  );
}

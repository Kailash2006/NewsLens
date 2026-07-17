import { trustTone } from '../lib/bias.js';

export default function TrustScore({ score }) {
  const tone = trustTone(score);
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400" title={`Source trust: ${tone.label}`}>
      <span className="relative inline-block h-1.5 w-10 overflow-hidden rounded-full bg-white/10">
        <span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${score}%`, backgroundColor: tone.color }}
        />
      </span>
      <span className="tabular-nums text-slate-300">{score}</span>
    </span>
  );
}

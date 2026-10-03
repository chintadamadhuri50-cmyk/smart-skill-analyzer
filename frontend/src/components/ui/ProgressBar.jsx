export default function ProgressBar({ value = 0, max = 100, color = 'brand', size = 'md', showLabel = false, label = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    brand:   'bg-brand-grad',
    green:   'bg-emerald-500',
    yellow:  'bg-amber-400',
    red:     'bg-red-500',
    purple:  'bg-violet-500',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs font-medium text-slate-600">{label}</span>}
          {showLabel && <span className="text-xs font-semibold text-slate-700">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-700 ease-out ${colors[color] || colors.brand}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

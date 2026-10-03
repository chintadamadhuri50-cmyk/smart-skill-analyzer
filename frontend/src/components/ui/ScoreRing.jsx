export default function ScoreRing({ value = 0, size = 120, strokeWidth = 10, label = '', sublabel = '' }) {
  const r = (size - strokeWidth * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, Math.max(0, value)) / 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${value}%`}>
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#e0e7ff" strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        <text x={size / 2} y={size / 2 + 2} textAnchor="middle" dominantBaseline="middle"
          fontSize={size / 5} fontWeight="800" fill="#1e293b">
          {value}%
        </text>
      </svg>
      {label && <p className="text-sm font-semibold text-slate-700">{label}</p>}
      {sublabel && <p className="text-xs text-slate-500">{sublabel}</p>}
    </div>
  );
}

export function Card({ className = '', hover = false, children, ...props }) {
  return (
    <div
      className={[
        'bg-white rounded-2xl border border-slate-100 shadow-card p-5',
        hover ? 'transition-shadow duration-200 hover:shadow-card-hover cursor-pointer' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children }) {
  return (
    <h3 className={`font-bold text-slate-800 text-base ${className}`}>{children}</h3>
  );
}

const variants = {
  blue:   'bg-brand-100 text-brand-700',
  green:  'bg-emerald-100 text-emerald-700',
  yellow: 'bg-amber-100 text-amber-700',
  red:    'bg-red-100 text-red-700',
  purple: 'bg-violet-100 text-violet-700',
  gray:   'bg-slate-100 text-slate-600',
  indigo: 'bg-indigo-100 text-indigo-700',
  orange: 'bg-orange-100 text-orange-700',
};

export default function Badge({ variant = 'blue', className = '', children }) {
  return (
    <span className={[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      variants[variant] || variants.blue,
      className,
    ].join(' ')}>
      {children}
    </span>
  );
}

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-3', lg: 'h-12 w-12 border-4', xl: 'h-16 w-16 border-4' };
  return (
    <div
      className={`animate-spin rounded-full border-brand-200 border-t-brand-600 ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <p className="text-slate-500 text-sm font-medium">Loading…</p>
    </div>
  );
}

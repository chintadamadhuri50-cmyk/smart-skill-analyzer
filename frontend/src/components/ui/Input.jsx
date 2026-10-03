import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, className = '', icon: Icon, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          className={[
            'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900',
            'placeholder:text-slate-400 transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400',
            error ? 'border-red-400' : 'border-slate-200 hover:border-slate-300',
            Icon ? 'pl-9' : '',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
});

export default Input;

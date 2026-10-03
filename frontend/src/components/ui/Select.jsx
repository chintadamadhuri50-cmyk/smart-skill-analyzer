import { forwardRef } from 'react';

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = 'Select…', className = '', ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      )}
      <select
        ref={ref}
        className={[
          'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900',
          'transition-colors duration-150 appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400',
          error ? 'border-red-400' : 'border-slate-200 hover:border-slate-300',
          className,
        ].join(' ')}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Select;

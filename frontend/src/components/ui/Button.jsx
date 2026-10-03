import { forwardRef } from 'react';

const variants = {
  primary:  'bg-brand-grad text-white shadow-sm hover:shadow-glow hover:brightness-105 active:scale-[.98]',
  secondary:'bg-white text-brand-600 border border-brand-200 hover:bg-brand-50 active:scale-[.98]',
  ghost:    'bg-transparent text-brand-600 hover:bg-brand-50 active:scale-[.98]',
  danger:   'bg-red-500 text-white hover:bg-red-600 active:scale-[.98]',
  outline:  'bg-transparent text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-[.98]',
  success:  'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[.98]',
};

const sizes = {
  sm:  'px-3 py-1.5 text-sm rounded-lg',
  md:  'px-4 py-2.5 text-sm rounded-xl',
  lg:  'px-6 py-3 text-base rounded-xl',
  xl:  'px-8 py-4 text-base rounded-2xl',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', disabled, loading, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;

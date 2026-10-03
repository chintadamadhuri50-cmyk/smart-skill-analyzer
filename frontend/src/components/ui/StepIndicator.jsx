import { Check } from 'lucide-react';

export default function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center w-full mb-8">
      {steps.map((step, i) => {
        const done    = i < current;
        const active  = i === current;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={[
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200',
                done   ? 'bg-brand-grad text-white' : '',
                active ? 'bg-brand-grad text-white shadow-glow' : '',
                !done && !active ? 'bg-slate-100 text-slate-400' : '',
              ].join(' ')}>
                {done ? <Check size={16} /> : <span>{i + 1}</span>}
              </div>
              <span className={`mt-1 text-[10px] font-medium hidden sm:block whitespace-nowrap ${active ? 'text-brand-600' : done ? 'text-brand-400' : 'text-slate-400'}`}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all duration-200 ${i < current ? 'bg-brand-400' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const config = {
  success: { icon: CheckCircle, bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon_color: 'text-emerald-500' },
  error:   { icon: XCircle,     bg: 'bg-red-50 border-red-200',         text: 'text-red-800',     icon_color: 'text-red-500'     },
  info:    { icon: AlertCircle, bg: 'bg-brand-50 border-brand-200',      text: 'text-brand-800',   icon_color: 'text-brand-500'   },
};

export default function Toast() {
  const { toast, showToast } = useApp();
  if (!toast) return null;

  const c = config[toast.type] || config.info;
  const Icon = c.icon;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm ${c.bg}`}>
        <Icon size={18} className={`mt-0.5 shrink-0 ${c.icon_color}`} />
        <p className={`text-sm font-medium flex-1 ${c.text}`}>{toast.message}</p>
        <button
          onClick={() => showToast(null)}
          className={`shrink-0 ${c.icon_color} hover:opacity-70`}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

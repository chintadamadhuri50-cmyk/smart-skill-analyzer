import { useState } from 'react';
import { Bell, Shield, Palette, Trash2, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { Card } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { ConfirmModal } from '../components/ui/Modal.jsx';

function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={[
          'w-11 h-6 rounded-full transition-colors duration-200 relative',
          checked ? 'bg-brand-600' : 'bg-slate-200',
        ].join(' ')}
        role="switch"
        aria-checked={checked}
      >
        <span className={[
          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')} />
      </button>
    </div>
  );
}

export default function Settings() {
  const { logout } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);
  const [prefs, setPrefs] = useState({
    emailNotifs:    true,
    streakReminder: true,
    weeklyReport:   false,
    darkMode:       false,
    compactSidebar: false,
  });

  const set = (k) => (v) => {
    setPrefs(p => ({ ...p, [k]: v }));
    showToast('Setting saved.');
  };

  const handleReset = () => {
    localStorage.removeItem('skillsnap_profile');
    setConfirmReset(false);
    showToast('Profile data cleared. Reload to start fresh.', 'info');
    setTimeout(() => { logout(); navigate('/'); }, 1500);
  };

  const sections = [
    {
      icon: Bell, title: 'Notifications', color: 'text-brand-600 bg-brand-50',
      items: [
        { key: 'emailNotifs',    label: 'Email notifications',     desc: 'Receive weekly skill tips and updates.'         },
        { key: 'streakReminder', label: 'Daily streak reminder',   desc: 'Get reminded to keep your learning streak.'     },
        { key: 'weeklyReport',   label: 'Weekly progress report',  desc: 'Receive a summary of your weekly achievements.' },
      ],
    },
    {
      icon: Palette, title: 'Appearance', color: 'text-violet-600 bg-violet-50',
      items: [
        { key: 'darkMode',       label: 'Dark mode',       desc: 'Coming soon — switch to a dark theme.'    },
        { key: 'compactSidebar', label: 'Compact sidebar', desc: 'Show icons only in the navigation sidebar.' },
      ],
    },
  ];

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your preferences and account options.</p>
      </div>

      {sections.map(sec => (
        <Card key={sec.title}>
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${sec.color}`}>
              <sec.icon size={16} />
            </div>
            <h3 className="font-bold text-slate-800">{sec.title}</h3>
          </div>
          {sec.items.map(item => (
            <Toggle
              key={item.key}
              checked={prefs[item.key]}
              onChange={set(item.key)}
              label={item.label}
              desc={item.desc}
            />
          ))}
        </Card>
      ))}

      {/* Account */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-red-600 bg-red-50">
            <Shield size={16} />
          </div>
          <h3 className="font-bold text-slate-800">Account</h3>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <LogOut size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Log out</span>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </button>

          <button
            onClick={() => setConfirmReset(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={16} className="text-red-500" />
              <div>
                <span className="text-sm font-medium text-red-600">Reset all data</span>
                <p className="text-xs text-slate-400">Clears your skill profile and progress.</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </button>
        </div>
      </Card>

      {/* Version */}
      <p className="text-center text-xs text-slate-400">SkillSnap AI v2.0 · AI-powered career guidance for students</p>

      <ConfirmModal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleReset}
        title="Reset all data?"
        message="This will clear your skill profile, roadmap progress, and assessment history. This action cannot be undone."
        confirmLabel="Yes, reset everything"
      />
    </div>
  );
}

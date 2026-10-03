import { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Zap, BookOpen, TrendingUp, Map, FileText,
  MessageSquare, BarChart2, User, Settings, LogOut, Menu, X,
  ChevronRight, Sparkles, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import Toast from './ui/Toast.jsx';

const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard'          },
  { to: '/assessment',   icon: Zap,             label: 'Skill Assessment'   },
  { to: '/skills',       icon: BookOpen,        label: 'My Skills'          },
  { to: '/gaps',         icon: TrendingUp,      label: 'Skill Gaps'         },
  { to: '/careers',      icon: Sparkles,        label: 'Career Paths'       },
  { to: '/roadmap',      icon: Map,             label: 'Learning Roadmap'   },
  { to: '/resume',       icon: FileText,        label: 'Resume Analyzer'    },
  { to: '/assistant',    icon: MessageSquare,   label: 'AI Assistant'       },
  { to: '/progress',     icon: BarChart2,       label: 'Progress'           },
];

const BOTTOM_NAV = [
  { to: '/profile',  icon: User,     label: 'Profile'  },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

// Pages that use the full-screen layout (no sidebar)
const FULL_SCREEN_ROUTES = ['/', '/login', '/signup', '/onboarding'];

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { profile } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose?.();
  };

  return (
    <>
      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside className={[
        'fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 shadow-xl z-40',
        'flex flex-col transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:shadow-none',
      ].join(' ')}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 rounded-xl bg-brand-grad flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-base gradient-text">SkillSnap AI</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-slate-100 text-slate-500">
            <X size={18} />
          </button>
        </div>

        {/* User chip */}
        {user && (
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-3 px-3 py-2 bg-brand-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-brand-grad flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {(user.name || 'U')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{profile?.careerGoal || 'Set career goal'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin space-y-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={13} className="opacity-30" />
            </NavLink>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 py-3 border-t border-slate-100 space-y-0.5">
          {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="nav-item w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();

  // Get page title from route
  const allNav = [...NAV, ...BOTTOM_NAV];
  const current = allNav.find(n => location.pathname.startsWith(n.to));
  const pageTitle = current?.label || 'SkillSnap AI';

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-bold text-slate-800 text-base">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>
        {user && (
          <Link to="/profile" className="w-8 h-8 rounded-full bg-brand-grad flex items-center justify-center text-white font-bold text-sm">
            {(user.name || 'U')[0].toUpperCase()}
          </Link>
        )}
      </div>
    </header>
  );
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isFullScreen = FULL_SCREEN_ROUTES.includes(location.pathname);

  // Full-screen layout for landing, auth, onboarding
  if (isFullScreen || !user) {
    return (
      <>
        {children}
        <Toast />
      </>
    );
  }

  // App layout with sidebar
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
          {children}
        </main>
      </div>
      <Toast />
    </div>
  );
}

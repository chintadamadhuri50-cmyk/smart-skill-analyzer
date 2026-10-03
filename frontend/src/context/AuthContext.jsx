import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'demo-001',
  name: 'Alex Kumar',
  email: 'alex@example.com',
  avatar: null,
  education: "Bachelor's",
  branch: 'Computer Science',
  year: '3rd Year',
  careerGoal: 'Full Stack Developer',
  interests: ['Web Development', 'App Development', 'UI/UX'],
  onboardingComplete: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const stored = localStorage.getItem('skillsnap_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('skillsnap_user'); }
    }
    setLoading(false);
  }, []);

  const login = (email, _password) => {
    // Mock auth — in production this calls POST /api/auth/login
    const u = { ...DEMO_USER, email };
    setUser(u);
    localStorage.setItem('skillsnap_user', JSON.stringify(u));
    return u;
  };

  const signup = (name, email, _password) => {
    const u = { ...DEMO_USER, name, email, onboardingComplete: false };
    setUser(u);
    localStorage.setItem('skillsnap_user', JSON.stringify(u));
    return u;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillsnap_user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('skillsnap_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

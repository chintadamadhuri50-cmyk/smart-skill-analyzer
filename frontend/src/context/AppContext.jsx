import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

// Demo data — used when user has not generated their own analysis yet
export const DEMO_PROFILE = {
  name: 'Alex Kumar',
  careerGoal: 'Full Stack Developer',
  overallScore: 68,
  skills: [
    { name: 'Python',     level: 'Intermediate', score: 72 },
    { name: 'JavaScript', level: 'Beginner',      score: 38 },
    { name: 'HTML',       level: 'Advanced',      score: 90 },
    { name: 'CSS',        level: 'Intermediate',  score: 68 },
    { name: 'SQL',        level: 'Intermediate',  score: 62 },
    { name: 'Git',        level: 'Beginner',      score: 42 },
    { name: 'React',      level: 'Beginner',      score: 30 },
  ],
  skillGaps: [
    { skill: 'React',      currentLevel: 'Beginner',      requiredLevel: 'Intermediate', priority: 'High'   },
    { skill: 'JavaScript', currentLevel: 'Beginner',      requiredLevel: 'Advanced',     priority: 'High'   },
    { skill: 'Node.js',    currentLevel: 'None',          requiredLevel: 'Intermediate', priority: 'High'   },
    { skill: 'DSA',        currentLevel: 'Beginner',      requiredLevel: 'Intermediate', priority: 'Medium' },
    { skill: 'SQL',        currentLevel: 'Intermediate',  requiredLevel: 'Intermediate', priority: 'Low'    },
    { skill: 'REST APIs',  currentLevel: 'None',          requiredLevel: 'Intermediate', priority: 'Medium' },
  ],
  careerPaths: [
    { name: 'Full Stack Developer', match: 82, reason: 'Strong HTML/CSS foundation. JavaScript and React need leveling up.', roles: ['Frontend Dev', 'Web Engineer', 'Software Engineer'] },
    { name: 'Frontend Developer',   match: 74, reason: 'Solid HTML/CSS. Growing JavaScript skills are key next step.',        roles: ['UI Developer', 'React Developer', 'Web Designer'] },
    { name: 'Data Analyst',         match: 67, reason: 'Good SQL and Python base. Needs more data visualization skills.',      roles: ['Data Analyst', 'BI Analyst', 'Reporting Analyst'] },
    { name: 'Backend Developer',    match: 58, reason: 'Python is a plus. Node.js and API design skills need attention.',     roles: ['API Developer', 'Node.js Dev', 'Python Dev'] },
    { name: 'AI/ML Engineer',       match: 51, reason: 'Python is a great start. Math and ML frameworks are the gap.',        roles: ['ML Engineer', 'AI Researcher', 'Data Scientist'] },
  ],
  roadmap: [
    { phase: 1, title: 'Fundamentals', items: [
        { id: 'r1', title: 'HTML5 & Semantic Markup', done: true },
        { id: 'r2', title: 'CSS3, Flexbox & Grid',    done: true },
        { id: 'r3', title: 'JavaScript Basics',       done: false },
      ]},
    { phase: 2, title: 'JavaScript Deep Dive', items: [
        { id: 'r4', title: 'ES6+ Features',          done: false },
        { id: 'r5', title: 'DOM Manipulation',       done: false },
        { id: 'r6', title: 'Async JS & Fetch API',   done: false },
      ]},
    { phase: 3, title: 'React Frontend', items: [
        { id: 'r7', title: 'React Components & JSX', done: false },
        { id: 'r8', title: 'State & Props',          done: false },
        { id: 'r9', title: 'React Router',           done: false },
      ]},
    { phase: 4, title: 'Backend with Node.js', items: [
        { id: 'r10', title: 'Node.js Fundamentals',   done: false },
        { id: 'r11', title: 'Express & REST APIs',    done: false },
        { id: 'r12', title: 'Authentication (JWT)',   done: false },
      ]},
    { phase: 5, title: 'Database', items: [
        { id: 'r13', title: 'SQL & PostgreSQL',       done: false },
        { id: 'r14', title: 'MongoDB Basics',         done: false },
      ]},
    { phase: 6, title: 'Projects & Portfolio', items: [
        { id: 'r15', title: 'Portfolio Website',      done: false },
        { id: 'r16', title: 'Task Manager App',       done: false },
        { id: 'r17', title: 'Full Stack E-Commerce',  done: false },
      ]},
  ],
  assessmentHistory: [
    { date: '2026-07-01', score: 52 },
    { date: '2026-08-01', score: 61 },
    { date: '2026-09-01', score: 68 },
  ],
  weeklyHours: [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 3 },
    { day: 'Wed', hours: 1 },
    { day: 'Thu', hours: 4 },
    { day: 'Fri', hours: 2 },
    { day: 'Sat', hours: 5 },
    { day: 'Sun', hours: 1 },
  ],
  badges: [
    { id: 'b1', icon: '🏆', title: 'First Assessment', earned: true,  desc: 'Completed your first skill assessment' },
    { id: 'b2', icon: '🔥', title: '7-Day Streak',     earned: true,  desc: 'Studied 7 days in a row' },
    { id: 'b3', icon: '🎯', title: 'Gap Crusher',      earned: false, desc: 'Close 3 skill gaps' },
    { id: 'b4', icon: '🚀', title: 'Roadmap Starter',  earned: true,  desc: 'Started your learning roadmap' },
    { id: 'b5', icon: '💼', title: 'Job Ready',        earned: false, desc: 'Reach 85% overall score' },
    { id: 'b6', icon: '📄', title: 'Resume Pro',       earned: false, desc: 'Analyze your resume' },
  ],
  xp: 340,
  streak: 7,
};

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('skillsnap_profile');
    if (stored) {
      try { setProfile(JSON.parse(stored)); }
      catch { setProfile(DEMO_PROFILE); }
    } else {
      setProfile(DEMO_PROFILE);
    }
  }, []);

  const updateProfile = (updates) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem('skillsnap_profile', JSON.stringify(updated));
  };

  const toggleRoadmapItem = (itemId) => {
    const updated = {
      ...profile,
      roadmap: profile.roadmap.map(phase => ({
        ...phase,
        items: phase.items.map(item =>
          item.id === itemId ? { ...item, done: !item.done } : item
        ),
      })),
    };
    setProfile(updated);
    localStorage.setItem('skillsnap_profile', JSON.stringify(updated));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  // Computed values
  const roadmapProgress = profile
    ? Math.round(
        (profile.roadmap.flatMap(p => p.items).filter(i => i.done).length /
          profile.roadmap.flatMap(p => p.items).length) * 100
      )
    : 0;

  return (
    <AppContext.Provider value={{ profile, updateProfile, toggleRoadmapItem, roadmapProgress, toast, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

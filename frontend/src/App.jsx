import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';

// Public pages
import Home             from './pages/Home.jsx';
import Login            from './pages/Login.jsx';
import Signup           from './pages/Signup.jsx';
import Onboarding       from './pages/Onboarding.jsx';

// App pages
import Dashboard        from './pages/Dashboard.jsx';
import Assessment       from './pages/Assessment.jsx';
import AssessmentResults from './pages/AssessmentResults.jsx';
import MySkills         from './pages/MySkills.jsx';
import SkillGaps        from './pages/SkillGaps.jsx';
import CareerPaths      from './pages/CareerPaths.jsx';
import Roadmap          from './pages/Roadmap.jsx';
import ResumeAnalyzer   from './pages/ResumeAnalyzer.jsx';
import AIAssistant      from './pages/AIAssistant.jsx';
import Progress         from './pages/Progress.jsx';
import Profile          from './pages/Profile.jsx';
import Settings         from './pages/Settings.jsx';

// Protected route wrapper
function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// 404 page
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="text-6xl">🔍</div>
      <h1 className="text-2xl font-black text-slate-900">Page not found</h1>
      <p className="text-slate-500">The page you're looking for doesn't exist.</p>
      <a href="/dashboard" className="text-brand-600 font-semibold hover:underline">Go to Dashboard →</a>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Home />}       />
        <Route path="/login"     element={<Login />}      />
        <Route path="/signup"    element={<Signup />}     />
        <Route path="/onboarding" element={<Protected><Onboarding /></Protected>} />

        {/* Protected app routes */}
        <Route path="/dashboard"          element={<Protected><Dashboard /></Protected>}        />
        <Route path="/assessment"         element={<Protected><Assessment /></Protected>}        />
        <Route path="/assessment/results" element={<Protected><AssessmentResults /></Protected>} />
        <Route path="/skills"             element={<Protected><MySkills /></Protected>}          />
        <Route path="/gaps"               element={<Protected><SkillGaps /></Protected>}         />
        <Route path="/careers"            element={<Protected><CareerPaths /></Protected>}       />
        <Route path="/roadmap"            element={<Protected><Roadmap /></Protected>}           />
        <Route path="/resume"             element={<Protected><ResumeAnalyzer /></Protected>}    />
        <Route path="/assistant"          element={<Protected><AIAssistant /></Protected>}       />
        <Route path="/progress"           element={<Protected><Progress /></Protected>}          />
        <Route path="/profile"            element={<Protected><Profile /></Protected>}           />
        <Route path="/settings"           element={<Protected><Settings /></Protected>}          />

        {/* Legacy routes from old codebase — redirect gracefully */}
        <Route path="/analyze"            element={<Navigate to="/assessment" replace />}  />
        <Route path="/history"            element={<Navigate to="/progress"   replace />}  />
        <Route path="/history/:id"        element={<Navigate to="/dashboard"  replace />}  />
        <Route path="/dashboard/:id"      element={<Navigate to="/dashboard"  replace />}  />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

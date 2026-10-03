import { Link } from 'react-router-dom';
import {
  Zap, TrendingUp, Map, FileText, MessageSquare, BarChart2,
  Star, ArrowRight, CheckCircle, Target, BookOpen, Sparkles, ChevronRight
} from 'lucide-react';
import Button from '../components/ui/Button.jsx';

const FEATURES = [
  { icon: Zap,           title: 'AI Skill Assessment',        desc: 'Take smart quizzes that evaluate your real knowledge level across technical domains.',        color: 'bg-brand-50 text-brand-600' },
  { icon: TrendingUp,    title: 'Skill Gap Analysis',         desc: 'See exactly what skills you need for your target career and how far you are from it.',       color: 'bg-amber-50 text-amber-600' },
  { icon: Sparkles,      title: 'Career Recommendations',     desc: 'AI matches your profile to the best-fit career roles with clear explanations why.',           color: 'bg-violet-50 text-violet-600' },
  { icon: Map,           title: 'Personalized Roadmap',       desc: 'A step-by-step learning plan built around your gaps, timeline, and career goal.',             color: 'bg-emerald-50 text-emerald-600' },
  { icon: FileText,      title: 'Resume Analyzer',            desc: 'Upload your resume and get an AI-powered score with actionable improvement suggestions.',     color: 'bg-rose-50 text-rose-600' },
  { icon: BarChart2,     title: 'Progress Tracking',          desc: 'Track how far you have come with charts, streaks, XP, and achievement badges.',              color: 'bg-sky-50 text-sky-600' },
  { icon: MessageSquare, title: 'AI Career Assistant',        desc: 'Chat with an AI that knows your profile and answers career, skills, and learning questions.', color: 'bg-orange-50 text-orange-600' },
  { icon: BookOpen,      title: 'Job-Ready Skills',           desc: 'Every recommendation is tied to real job requirements so you learn what employers want.',    color: 'bg-teal-50 text-teal-600' },
];

const STEPS = [
  { n: '01', title: 'Assess Your Skills',     desc: 'Answer targeted questions across your tech stack. Takes about 10 minutes.' },
  { n: '02', title: 'Discover Your Gaps',     desc: 'See which skills you are missing for your target role — with priority rankings.' },
  { n: '03', title: 'Get Your Career Path',   desc: 'AI recommends the best-fit careers and explains exactly why each one matches.' },
  { n: '04', title: 'Follow Your Roadmap',    desc: 'Get a phased learning plan. Mark topics as done and track your progress.' },
];

const WHY = [
  { icon: Target,      title: 'Personalized Guidance',    desc: 'Every recommendation is built around your unique skill profile, not a one-size-fits-all template.' },
  { icon: Zap,         title: 'AI-Powered Analysis',      desc: 'Gemini AI analyzes your profile in seconds and generates structured, actionable career insights.' },
  { icon: Map,         title: 'Career-Focused Learning',  desc: 'You only learn what matters for your specific career goal — no wasted effort.' },
  { icon: BarChart2,   title: 'Progress Monitoring',      desc: 'Track improvement over time with scores, streaks, and visual progress dashboards.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-grad flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-lg gradient-text">SkillSnap AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-slate-900 via-brand-900 to-violet-900 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-600 opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-violet-600 opacity-15 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6">
              <Sparkles size={14} className="text-brand-300" />
              Powered by Google Gemini AI
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Turn Your Skills<br />
              <span className="bg-gradient-to-r from-brand-300 to-violet-300 bg-clip-text text-transparent">
                Into Your Career.
              </span>
            </h1>
            <p className="text-xl text-white/75 max-w-2xl mb-8 leading-relaxed">
              SkillSnap AI analyzes your skills, identifies gaps, and creates a personalized roadmap to help you become job-ready — in minutes, not months.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/signup">
                <Button size="xl" className="bg-white text-brand-700 hover:bg-brand-50 shadow-lg hover:shadow-xl">
                  Start Your Skill Assessment
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="ghost" size="xl" className="text-white border border-white/30 hover:bg-white/10">
                  Explore Features
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-white/60 text-sm">
              {['Free to get started', 'AI-powered analysis', 'No credit card required'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-400" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Hero dashboard mockup */}
          <div className="mt-14 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-white/50 text-xs">SkillSnap AI Dashboard</span>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[['68%', 'Skill Score'], ['82%', 'Top Match'], ['7', 'Skills'], ['4', 'Gaps']].map(([v, l]) => (
                <div key={l} className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-white font-black text-lg">{v}</p>
                  <p className="text-white/60 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[['JavaScript', 38], ['React', 30], ['Python', 72], ['SQL', 62]].map(([s, v]) => (
                <div key={s} className="flex items-center gap-3">
                  <span className="text-white/70 text-xs w-24 shrink-0">{s}</span>
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-400 to-violet-400 rounded-full" style={{ width: `${v}%` }} />
                  </div>
                  <span className="text-white/60 text-xs w-8 text-right">{v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Four simple steps from where you are to where you want to be.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 h-full">
                  <div className="text-4xl font-black gradient-text mb-4">{s.n}</div>
                  <h3 className="font-bold text-slate-800 text-base mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute top-8 -right-3 z-10">
                    <ChevronRight size={20} className="text-brand-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Everything You Need to Get Job-Ready</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">One platform that connects your skills to your career — with AI doing the heavy lifting.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 hover:shadow-card-hover transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${f.color}`}>
                  <f.icon size={20} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1.5">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SkillSnap */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-4">
                <Star size={14} />
                Why SkillSnap AI?
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-5 leading-tight">
                "Discover your skills.<br />Close your gaps.<br />
                <span className="gradient-text">Build your future."</span>
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Unlike generic course platforms, SkillSnap AI gives you a complete picture of where you stand and a personalized path to get to where you want to be.
              </p>
              <Link to="/signup">
                <Button size="lg">
                  Start for Free <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {WHY.map(w => (
                <div key={w.title} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3 text-brand-600">
                    <w.icon size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{w.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-brand-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Discover Your Potential?</h2>
          <p className="text-white/75 text-lg mb-8">Join students who are using SkillSnap AI to find their career path and become job-ready.</p>
          <Link to="/signup">
            <Button size="xl" className="bg-white text-brand-700 hover:bg-brand-50 shadow-lg">
              Get Started Free <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-slate-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-brand-grad flex items-center justify-center">
            <Zap size={12} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">SkillSnap AI</span>
        </div>
        <p className="text-slate-500 text-sm">
          AI-powered career guidance for students. Match scores are AI-generated guidance, not guaranteed predictions.
        </p>
      </footer>
    </div>
  );
}

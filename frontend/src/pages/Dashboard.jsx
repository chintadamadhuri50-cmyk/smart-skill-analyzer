import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import {
  Zap, TrendingUp, Map, ArrowRight, Target, Flame,
  BookOpen, Star, ChevronRight, BarChart2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { Card } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import ScoreRing from '../components/ui/ScoreRing.jsx';
import Button from '../components/ui/Button.jsx';

function StatCard({ icon: Icon, label, value, sub, color = 'text-brand-600', bg = 'bg-brand-50' }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-black text-slate-900">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user } = useAuth();
  const { profile, roadmapProgress } = useApp();
  if (!profile) return null;

  const topCareer = [...profile.careerPaths].sort((a, b) => b.match - a.match)[0];
  const topGaps   = profile.skillGaps.filter(g => g.priority === 'High').slice(0, 3);
  const allItems  = profile.roadmap.flatMap(p => p.items);
  const nextItem  = allItems.find(i => !i.done);
  const earnedBadges = profile.badges.filter(b => b.earned).length;

  // Weekly chart data
  const weekData = profile.weeklyHours;
  // Score history
  const scoreData = profile.assessmentHistory.map(h => ({ date: h.date.slice(5), score: h.score }));

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {getGreeting()}, {(user?.name || profile.name).split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Career goal: <span className="font-semibold text-brand-600">{profile.careerGoal}</span>
          </p>
        </div>
        <Link to="/assessment">
          <Button size="sm">
            <Zap size={14} /> Take Assessment
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BarChart2} label="Skill Score"     value={`${profile.overallScore}%`} sub="Overall level"         color="text-brand-600"   bg="bg-brand-50" />
        <StatCard icon={Target}    label="Top Career Match" value={`${topCareer.match}%`}      sub={topCareer.name}        color="text-violet-600"  bg="bg-violet-50" />
        <StatCard icon={Flame}     label="Day Streak"      value={profile.streak}              sub="Keep it up!"          color="text-orange-500"  bg="bg-orange-50" />
        <StatCard icon={Star}      label="Badges Earned"   value={`${earnedBadges}/${profile.badges.length}`} sub="Achievements" color="text-amber-500" bg="bg-amber-50" />
      </div>

      {/* Score ring + next step */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center justify-center text-center py-6">
          <ScoreRing value={profile.overallScore} size={120} />
          <p className="text-xs text-slate-500 mt-3 max-w-[140px]">
            Based on your latest assessment
          </p>
          <Link to="/assessment" className="mt-3">
            <Button variant="ghost" size="sm">Improve score →</Button>
          </Link>
        </Card>

        <Card className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Assessment History</h3>
            <Link to="/progress"><Button variant="ghost" size="sm">Full report <ChevronRight size={13}/></Button></Link>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={scoreData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
              <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ r: 4, fill: '#4f46e5' }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Skill progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <BookOpen size={16} className="text-brand-500" /> Skill Progress
          </h3>
          <Link to="/skills"><Button variant="ghost" size="sm">View all <ChevronRight size={13}/></Button></Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          {profile.skills.slice(0, 6).map(s => (
            <div key={s.name}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">{s.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={s.level === 'Advanced' ? 'green' : s.level === 'Intermediate' ? 'blue' : 'gray'} className="text-xs">
                    {s.level}
                  </Badge>
                  <span className="font-bold text-slate-800">{s.score}%</span>
                </div>
              </div>
              <ProgressBar value={s.score} color={s.score >= 70 ? 'green' : s.score >= 45 ? 'brand' : 'yellow'} size="md" />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Skill gaps */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={16} className="text-amber-500" /> Top Skill Gaps
            </h3>
            <Link to="/gaps"><Button variant="ghost" size="sm">View all <ChevronRight size={13}/></Button></Link>
          </div>
          <div className="space-y-3">
            {topGaps.map(g => (
              <div key={g.skill} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{g.skill}</p>
                  <p className="text-xs text-slate-500">{g.currentLevel} → {g.requiredLevel}</p>
                </div>
                <Badge variant="red">High Priority</Badge>
              </div>
            ))}
            {topGaps.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No critical gaps 🎉</p>}
          </div>
        </Card>

        {/* Weekly activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Weekly Activity</h3>
            <Badge variant="blue">{weekData.reduce((s, d) => s + d.hours, 0)}h this week</Badge>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={weekData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip formatter={(v) => [`${v}h`, 'Hours']} />
              <Bar dataKey="hours" fill="url(#barGrad)" radius={[6, 6, 0, 0]}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Roadmap progress + next step */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Map size={16} className="text-emerald-500" /> Roadmap Progress
            </h3>
            <Link to="/roadmap"><Button variant="ghost" size="sm">View roadmap <ChevronRight size={13}/></Button></Link>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="text-3xl font-black gradient-text">{roadmapProgress}%</div>
            <div className="flex-1">
              <ProgressBar value={roadmapProgress} size="lg" />
              <p className="text-xs text-slate-400 mt-1">
                {allItems.filter(i => i.done).length} / {allItems.length} topics completed
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-brand-50 to-violet-50 border-brand-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-grad flex items-center justify-center shrink-0">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-500 uppercase tracking-wide mb-1">Recommended Next Step</p>
              <h3 className="font-bold text-slate-900 mb-1">{nextItem?.title || 'All caught up!'}</h3>
              <p className="text-sm text-slate-600 mb-3">
                {nextItem
                  ? 'Complete this to move forward on your roadmap.'
                  : 'You have completed your current roadmap. Start the next assessment!'}
              </p>
              <Link to="/roadmap">
                <Button size="sm">
                  Go to Roadmap <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

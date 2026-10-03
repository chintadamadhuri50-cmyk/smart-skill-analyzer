import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Flame, Star, Zap, Trophy, Target } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Card } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import ScoreRing from '../components/ui/ScoreRing.jsx';

function XPBar({ xp, maxXp = 500 }) {
  const level = Math.floor(xp / maxXp) + 1;
  const progress = (xp % maxXp) / maxXp * 100;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-bold text-slate-700">Level {level}</span>
        <span className="text-slate-500">{xp % maxXp} / {maxXp} XP to next level</span>
      </div>
      <ProgressBar value={progress} color="purple" size="lg" />
    </div>
  );
}

export default function Progress() {
  const { profile, roadmapProgress } = useApp();
  if (!profile) return null;

  const { assessmentHistory, weeklyHours, badges, xp, streak, skills } = profile;
  const allItems   = profile.roadmap.flatMap(p => p.items);
  const doneCount  = allItems.filter(i => i.done).length;
  const earnedBadges = badges.filter(b => b.earned);
  const latestScore  = assessmentHistory[assessmentHistory.length - 1]?.score || 0;
  const firstScore   = assessmentHistory[0]?.score || 0;
  const improvement  = latestScore - firstScore;

  // Skill comparison data for bar chart
  const skillBarData = skills.slice(0, 6).map(s => ({ name: s.name, score: s.score }));

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Progress Tracking</h2>
        <p className="text-slate-500 text-sm mt-1">Track how far you've come and what you've achieved.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Target,  label: 'Overall Score',     value: `${latestScore}%`,        bg: 'bg-brand-50',   color: 'text-brand-600'  },
          { icon: Flame,   label: 'Day Streak',        value: `${streak} days`,         bg: 'bg-orange-50',  color: 'text-orange-500' },
          { icon: Zap,     label: 'Learning XP',       value: `${xp} XP`,              bg: 'bg-violet-50',  color: 'text-violet-600' },
          { icon: Star,    label: 'Badges Earned',     value: `${earnedBadges.length}`, bg: 'bg-amber-50',   color: 'text-amber-500'  },
        ].map(s => (
          <Card key={s.label}>
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-2`}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* XP + improvement */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap size={16} className="text-violet-500"/>Learning XP</h3>
          <XPBar xp={xp} />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-lg font-black text-slate-900">{doneCount}</p>
              <p className="text-xs text-slate-500">Topics done</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-lg font-black text-slate-900">{roadmapProgress}%</p>
              <p className="text-xs text-slate-500">Roadmap</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-lg font-black gradient-text">{improvement > 0 ? `+${improvement}` : improvement}%</p>
              <p className="text-xs text-slate-500">Improvement</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Flame size={16} className="text-orange-500"/>Streak & Activity</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl font-black text-orange-500">{streak}</div>
            <div>
              <p className="font-bold text-slate-800">Day Streak 🔥</p>
              <p className="text-xs text-slate-500">Keep going! Don't break the chain.</p>
            </div>
          </div>
          <div className="space-y-2">
            {weeklyHours.map(d => (
              <div key={d.day} className="flex items-center gap-3">
                <span className="w-8 text-xs font-medium text-slate-500">{d.day}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-grad rounded-full" style={{ width: `${(d.hours / 6) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-500 w-8">{d.hours}h</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Assessment history chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Assessment Score History</h3>
          {improvement > 0 && <Badge variant="green">+{improvement}% improvement</Badge>}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={assessmentHistory.map(h => ({ ...h, date: h.date.slice(5) }))} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
            <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2.5} fill="url(#histGrad)" dot={{ r: 5, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-between text-xs text-slate-500 mt-2 px-1">
          <span>Initial: <strong className="text-slate-700">{firstScore}%</strong></span>
          <span>Latest: <strong className="text-brand-600">{latestScore}%</strong></span>
          <span>Change: <strong className={improvement >= 0 ? 'text-emerald-600' : 'text-red-500'}>{improvement > 0 ? '+' : ''}{improvement}%</strong></span>
        </div>
      </Card>

      {/* Skill scores bar */}
      <Card>
        <h3 className="font-bold text-slate-800 mb-4">Skill Score Breakdown</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={skillBarData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="url(#skillBarGrad)">
              <defs>
                <linearGradient id="skillBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Badges */}
      <Card>
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" /> Achievement Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map(b => (
            <div key={b.id} className={[
              'rounded-2xl border p-4 text-center transition-all',
              b.earned ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-50',
            ].join(' ')}>
              <div className="text-3xl mb-2">{b.icon}</div>
              <p className="font-bold text-slate-800 text-sm">{b.title}</p>
              <p className="text-xs text-slate-500 mt-1">{b.desc}</p>
              {b.earned && <Badge variant="yellow" className="mt-2">Earned ✓</Badge>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

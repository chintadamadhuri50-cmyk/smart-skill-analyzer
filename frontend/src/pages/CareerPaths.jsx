import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Briefcase, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Card } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import Button from '../components/ui/Button.jsx';
import ScoreRing from '../components/ui/ScoreRing.jsx';

const WHY_ICONS = ['🧠', '💡', '🔥', '⚡', '🎯'];

export default function CareerPaths() {
  const { profile } = useApp();
  if (!profile) return null;

  const sorted = [...profile.careerPaths].sort((a, b) => b.match - a.match);
  const [top, ...rest] = sorted;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Career Recommendations</h2>
        <p className="text-slate-500 text-sm mt-1">AI-matched career paths based on your skills, interests, and goals.</p>
      </div>

      {/* Top match — featured card */}
      <div className="bg-gradient-to-br from-brand-600 to-violet-700 rounded-3xl p-6 text-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <Badge variant="blue" className="bg-white/20 text-white border-0 mb-3">🏆 Best Match</Badge>
            <h2 className="text-2xl font-black mb-2">{top.name}</h2>
            <p className="text-white/80 text-sm leading-relaxed mb-4">{top.reason}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {top.roles.map(r => (
                <span key={r} className="px-2.5 py-1 rounded-xl bg-white/15 text-white text-xs font-medium">{r}</span>
              ))}
            </div>
            <Link to="/roadmap">
              <Button className="bg-white text-brand-700 hover:bg-brand-50" size="sm">
                View Roadmap for this career <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
          <ScoreRing value={top.match} size={110} label="Match Score" />
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-white/60 mb-2 font-semibold uppercase tracking-wide">Why this matches you</p>
          <div className="flex flex-wrap gap-3">
            {['Your skill profile aligns well', 'Matches your stated interests', 'Achievable with your current level'].map((w, i) => (
              <span key={w} className="flex items-center gap-1.5 text-xs text-white/80">
                <CheckCircle size={13} className="text-green-300" /> {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Other matches */}
      <h3 className="font-bold text-slate-700 text-sm">Other strong matches</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {rest.map((p, idx) => (
          <Card key={p.name} hover>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center text-lg">{WHY_ICONS[idx] || '💼'}</div>
                <h3 className="font-bold text-slate-900">{p.name}</h3>
              </div>
              <span className="text-xl font-black gradient-text">{p.match}%</span>
            </div>

            <ProgressBar
              value={p.match}
              color={p.match >= 70 ? 'green' : p.match >= 50 ? 'brand' : 'yellow'}
              size="sm"
            />

            <p className="text-slate-500 text-sm mt-3 mb-3 leading-relaxed">{p.reason}</p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {p.roles.slice(0, 3).map(r => (
                <Badge key={r} variant="blue" className="text-xs">{r}</Badge>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-50">
              <Badge variant={p.match >= 70 ? 'green' : p.match >= 55 ? 'yellow' : 'gray'}>
                {p.match >= 70 ? 'Strong match' : p.match >= 55 ? 'Good match' : 'Possible with growth'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white border-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-lg mb-1">Ready to pursue {top.name}?</h3>
            <p className="text-slate-400 text-sm">Your personalized roadmap is already built for this career.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/gaps"><Button variant="secondary" size="sm">See Skill Gaps</Button></Link>
            <Link to="/roadmap"><Button size="sm">View Roadmap <ArrowRight size={14} /></Button></Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

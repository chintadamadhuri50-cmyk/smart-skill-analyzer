import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Card } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';

const PRIORITY_META = {
  High:   { color: 'red',    icon: AlertTriangle, label: 'High Priority',   bg: 'bg-red-50 border-red-100'     },
  Medium: { color: 'yellow', icon: TrendingUp,    label: 'Medium Priority', bg: 'bg-amber-50 border-amber-100' },
  Low:    { color: 'green',  icon: CheckCircle,   label: 'Low / None',      bg: 'bg-emerald-50 border-emerald-100' },
};

const LEVEL_ORDER = { None: 0, Beginner: 1, Intermediate: 2, Advanced: 3 };

function GapBar({ current, required }) {
  const levels = ['None', 'Beginner', 'Intermediate', 'Advanced'];
  const currentIdx  = levels.indexOf(current);
  const requiredIdx = levels.indexOf(required);
  return (
    <div className="mt-3">
      <div className="flex gap-1">
        {levels.map((l, i) => (
          <div key={l} className="flex-1">
            <div className={[
              'h-2 rounded-full transition-all',
              i <= currentIdx  ? 'bg-brand-500' :
              i <= requiredIdx ? 'bg-red-200'   : 'bg-slate-100',
            ].join(' ')} />
            <p className="text-[9px] text-slate-400 mt-1 text-center hidden sm:block">{l}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500 mt-1.5">
        <span>Current: <strong className="text-slate-700">{current}</strong></span>
        <span>Required: <strong className="text-brand-600">{required}</strong></span>
      </div>
    </div>
  );
}

export default function SkillGaps() {
  const { profile } = useApp();
  const { user }    = useAuth();
  if (!profile) return null;

  const { skillGaps, careerGoal } = profile;
  const high   = skillGaps.filter(g => g.priority === 'High');
  const medium = skillGaps.filter(g => g.priority === 'Medium');
  const low    = skillGaps.filter(g => g.priority === 'Low');

  const groups = [
    { label: 'High Priority — Fix These First', items: high,   ...PRIORITY_META.High   },
    { label: 'Medium Priority — Work on These Next', items: medium, ...PRIORITY_META.Medium },
    { label: 'Low Priority — You\'re Almost There', items: low,    ...PRIORITY_META.Low    },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Skill Gap Analysis</h2>
          <p className="text-slate-500 text-sm mt-1">
            Target career: <span className="font-semibold text-brand-600">{careerGoal}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="red">{high.length} High</Badge>
          <Badge variant="yellow">{medium.length} Medium</Badge>
          <Badge variant="green">{low.length} Low</Badge>
        </div>
      </div>

      {/* Summary banner */}
      <Card className="bg-gradient-to-r from-brand-50 to-violet-50 border-brand-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-grad flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              You have {high.length} critical skill gap{high.length !== 1 ? 's' : ''} for {careerGoal}
            </h3>
            <p className="text-slate-600 text-sm">
              Closing your high-priority gaps will significantly increase your job-readiness.
              Start with <strong>{high[0]?.skill}</strong> — it's your biggest gap right now.
            </p>
          </div>
        </div>
      </Card>

      {/* Gap groups */}
      {groups.map(group => group.items.length > 0 && (
        <div key={group.label}>
          <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
            <group.icon size={15} className={`text-${group.color === 'red' ? 'red' : group.color === 'yellow' ? 'amber' : 'emerald'}-500`} />
            {group.label}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {group.items.map(gap => (
              <div key={gap.skill} className={`rounded-2xl border p-4 ${group.bg}`}>
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-bold text-slate-900">{gap.skill}</h4>
                  <Badge variant={group.color}>{group.label.split('—')[0].trim()}</Badge>
                </div>
                <GapBar current={gap.currentLevel} required={gap.requiredLevel} />
                <p className="text-xs text-slate-500 mt-2">
                  {gap.currentLevel === 'None'
                    ? `You haven't started ${gap.skill} yet. Required level is ${gap.requiredLevel}.`
                    : `You're at ${gap.currentLevel}. You need to reach ${gap.requiredLevel}.`
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* CTA */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50">
        <div>
          <h3 className="font-bold text-slate-900">Ready to close these gaps?</h3>
          <p className="text-slate-500 text-sm">Your learning roadmap is already tailored to fix them.</p>
        </div>
        <Link to="/roadmap">
          <Button>
            View My Roadmap <ArrowRight size={15} />
          </Button>
        </Link>
      </Card>
    </div>
  );
}

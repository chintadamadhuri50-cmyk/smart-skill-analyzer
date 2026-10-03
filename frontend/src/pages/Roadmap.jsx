import { CheckCircle, Circle, ChevronDown, ChevronUp, Map } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Card } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import ScoreRing from '../components/ui/ScoreRing.jsx';

const PHASE_COLORS = [
  'bg-brand-500', 'bg-violet-500', 'bg-emerald-500',
  'bg-amber-500',  'bg-sky-500',   'bg-rose-500',
];

export default function Roadmap() {
  const { profile, toggleRoadmapItem, roadmapProgress, showToast } = useApp();
  const [expanded, setExpanded] = useState({ 0: true, 1: true });

  if (!profile) return null;
  const { roadmap, careerGoal } = profile;
  const allItems   = roadmap.flatMap(p => p.items);
  const doneCount  = allItems.filter(i => i.done).length;

  const toggle = (id, title, wasDone) => {
    toggleRoadmapItem(id);
    showToast(wasDone ? `"${title}" marked incomplete.` : `"${title}" completed! 🎉`);
  };

  const togglePhase = (idx) => setExpanded(p => ({ ...p, [idx]: !p[idx] }));

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Learning Roadmap</h2>
          <p className="text-slate-500 text-sm mt-1">
            Personalized for: <span className="font-semibold text-brand-600">{careerGoal}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ScoreRing value={roadmapProgress} size={70} label="" />
          <div>
            <p className="text-2xl font-black gradient-text">{roadmapProgress}%</p>
            <p className="text-xs text-slate-500">{doneCount}/{allItems.length} done</p>
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">Overall completion</span>
          <span className="text-sm font-bold text-brand-600">{roadmapProgress}%</span>
        </div>
        <ProgressBar value={roadmapProgress} size="lg" />
        <p className="text-xs text-slate-400 mt-2">
          {doneCount === allItems.length
            ? '🎉 Roadmap complete! Start the next assessment to level up.'
            : `${allItems.length - doneCount} topics remaining`
          }
        </p>
      </Card>

      {/* Phase cards */}
      {roadmap.map((phase, phaseIdx) => {
        const phaseItems = phase.items;
        const phaseDone  = phaseItems.filter(i => i.done).length;
        const phasePct   = Math.round((phaseDone / phaseItems.length) * 100);
        const isOpen     = expanded[phaseIdx] !== false;

        return (
          <div key={phase.phase} className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            {/* Phase header */}
            <button
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              onClick={() => togglePhase(phaseIdx)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${PHASE_COLORS[phaseIdx % PHASE_COLORS.length]} flex items-center justify-center text-white font-black text-sm`}>
                  {phase.phase}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900">{phase.title}</h3>
                  <p className="text-xs text-slate-400">{phaseDone}/{phaseItems.length} completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${phasePct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-500">{phasePct}%</span>
                </div>
                <Badge variant={phasePct === 100 ? 'green' : phasePct > 0 ? 'blue' : 'gray'}>
                  {phasePct === 100 ? '✓ Done' : phasePct > 0 ? 'In Progress' : 'Not Started'}
                </Badge>
                {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </div>
            </button>

            {/* Phase items */}
            {isOpen && (
              <div className="border-t border-slate-100 divide-y divide-slate-50">
                {phaseItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id, item.title, item.done)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className={[
                      'shrink-0 transition-colors',
                      item.done ? 'text-emerald-500' : 'text-slate-300 group-hover:text-brand-400',
                    ].join(' ')}>
                      {item.done ? <CheckCircle size={20} /> : <Circle size={20} />}
                    </div>
                    <span className={[
                      'text-sm font-medium flex-1',
                      item.done ? 'line-through text-slate-400' : 'text-slate-800',
                    ].join(' ')}>
                      {item.title}
                    </span>
                    {item.done && <Badge variant="green" className="text-xs">Done</Badge>}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Tip */}
      <Card className="bg-brand-50 border-brand-100">
        <p className="text-sm text-brand-800">
          <strong>Tip:</strong> Click any topic to mark it as complete or incomplete. Your progress updates automatically and is saved to your profile.
        </p>
      </Card>
    </div>
  );
}

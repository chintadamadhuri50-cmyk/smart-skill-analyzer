import { useState } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Card } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';

const LEVEL_META = {
  Beginner:     { color: 'gray',   score: 30, next: 'Intermediate' },
  Intermediate: { color: 'blue',   score: 60, next: 'Advanced'     },
  Advanced:     { color: 'green',  score: 90, next: null            },
};

const SUGGESTIONS = ['React', 'Node.js', 'TypeScript', 'Docker', 'AWS', 'GraphQL', 'MongoDB', 'PostgreSQL', 'Vue.js', 'Next.js', 'Flutter', 'Kotlin'];

export default function MySkills() {
  const { profile, updateProfile, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState('Beginner');
  const [filter, setFilter] = useState('All');

  if (!profile) return null;
  const { skills } = profile;

  const filtered = skills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || s.level === filter;
    return matchSearch && matchFilter;
  });

  const addSkill = () => {
    const name = newSkill.trim();
    if (!name) return;
    if (skills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      showToast('That skill already exists.', 'error'); return;
    }
    const meta = LEVEL_META[newLevel];
    updateProfile({ skills: [...skills, { name, level: newLevel, score: meta.score }] });
    setNewSkill('');
    showToast(`${name} added to your skills!`);
  };

  const removeSkill = (name) => {
    updateProfile({ skills: skills.filter(s => s.name !== name) });
    showToast(`${name} removed.`, 'info');
  };

  const upgradeLevel = (skillName) => {
    const skill = skills.find(s => s.name === skillName);
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    const idx = levels.indexOf(skill.level);
    if (idx >= levels.length - 1) return;
    const newLevelName = levels[idx + 1];
    updateProfile({
      skills: skills.map(s =>
        s.name === skillName
          ? { ...s, level: newLevelName, score: LEVEL_META[newLevelName].score }
          : s
      ),
    });
    showToast(`${skillName} upgraded to ${newLevelName}!`);
  };

  const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">My Skills</h2>
          <p className="text-slate-500 text-sm">{skills.length} skills in your profile</p>
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                filter === f ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300',
              ].join(' ')}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search skills…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        icon={Search}
      />

      {/* Skill cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => {
          const meta = LEVEL_META[s.level];
          return (
            <Card key={s.name} className="relative group">
              <button
                onClick={() => removeSkill(s.name)}
                className="absolute top-3 right-3 p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Remove ${s.name}`}
              >
                <X size={14} />
              </button>
              <div className="flex items-start justify-between mb-2 pr-6">
                <h3 className="font-bold text-slate-800">{s.name}</h3>
                <Badge variant={meta.color}>{s.level}</Badge>
              </div>
              <ProgressBar value={s.score} color={s.score >= 70 ? 'green' : s.score >= 45 ? 'brand' : 'yellow'} size="md" showLabel />
              {meta.next && (
                <button
                  onClick={() => upgradeLevel(s.name)}
                  className="mt-3 w-full text-xs text-brand-600 font-semibold hover:underline text-left"
                >
                  ↑ Mark as {meta.next}
                </button>
              )}
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-400">
            <p className="font-medium">No skills match your filter.</p>
          </div>
        )}
      </div>

      {/* Add skill */}
      <Card>
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus size={16} className="text-brand-500" /> Add a Skill</h3>
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-48">
            <Input
              placeholder="Skill name (e.g. TypeScript)"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
            />
          </div>
          <select
            value={newLevel}
            onChange={e => setNewLevel(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            {Object.keys(LEVEL_META).map(l => <option key={l}>{l}</option>)}
          </select>
          <Button onClick={addSkill}><Plus size={15} /> Add</Button>
        </div>

        {/* Quick suggestions */}
        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-2 font-medium">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.filter(s => !skills.some(sk => sk.name === s)).slice(0, 8).map(s => (
              <button
                key={s}
                onClick={() => { setNewSkill(s); }}
                className="px-3 py-1 rounded-xl border border-dashed border-slate-300 text-xs text-slate-600 hover:border-brand-400 hover:text-brand-600 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

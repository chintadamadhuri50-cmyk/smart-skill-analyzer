import { useLocation, useNavigate, Link } from 'react-router-dom';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, BarChart2, ArrowRight, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import Button from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import ScoreRing from '../components/ui/ScoreRing.jsx';
import Badge from '../components/ui/Badge.jsx';

function levelFromScore(score) {
  if (score >= 75) return { label: 'Advanced',     color: 'green' };
  if (score >= 50) return { label: 'Intermediate', color: 'blue'  };
  if (score >= 25) return { label: 'Developing',   color: 'yellow' };
  return                  { label: 'Beginner',      color: 'red'   };
}

export default function AssessmentResults() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const { updateProfile } = useApp();

  // Fallback demo data if navigated directly
  const results = state?.results || [
    { skill: 'JavaScript', score: 38,  correct: 1, total: 3 },
    { skill: 'Python',     score: 72,  correct: 2, total: 3 },
    { skill: 'SQL',        score: 58,  correct: 1, total: 2 },
    { skill: 'DSA',        score: 42,  correct: 1, total: 3 },
    { skill: 'Git',        score: 65,  correct: 1, total: 2 },
    { skill: 'Web Dev',    score: 55,  correct: 1, total: 2 },
  ];
  const overall = state?.overall || 55;

  const radarData = results.map(r => ({ subject: r.skill, score: r.score, fullMark: 100 }));
  const strong  = results.filter(r => r.score >= 65).sort((a, b) => b.score - a.score);
  const improve = results.filter(r => r.score < 65).sort((a, b) => a.score - b.score);

  const saveAndContinue = () => {
    updateProfile({
      overallScore: overall,
      skills: results.map(r => ({
        name: r.skill,
        level: levelFromScore(r.score).label,
        score: r.score,
      })),
      assessmentHistory: [
        { date: new Date().toISOString().slice(0, 10), score: overall },
      ],
    });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Overall score */}
      <Card className="flex flex-col sm:flex-row items-center gap-6">
        <ScoreRing value={overall} size={130} label="Overall Score" sublabel={levelFromScore(overall).label} />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-black text-slate-900 mb-1">Assessment Complete!</h2>
          <p className="text-slate-500 mb-4">
            Here's a detailed breakdown of how you performed across each skill area.
            Use this to guide your learning roadmap.
          </p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <Badge variant={overall >= 65 ? 'green' : overall >= 40 ? 'yellow' : 'red'}>
              {levelFromScore(overall).label}
            </Badge>
            <Badge variant="blue">{results.length} skills evaluated</Badge>
            <Badge variant="purple">{strong.length} strengths identified</Badge>
          </div>
        </div>
      </Card>

      {/* Radar + bars */}
      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart2 size={17} className="text-brand-500" /> Skill Radar
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
              <Radar dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} strokeWidth={2} dot={{ r: 4, fill: '#4f46e5' }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-bold text-slate-800 mb-4">Skill Breakdown</h3>
          <div className="space-y-4">
            {results.sort((a, b) => b.score - a.score).map(r => {
              const lv = levelFromScore(r.score);
              return (
                <div key={r.skill}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-slate-700">{r.skill}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={lv.color}>{lv.label}</Badge>
                      <span className="text-sm font-bold text-slate-900">{r.score}%</span>
                    </div>
                  </div>
                  <ProgressBar
                    value={r.score}
                    color={r.score >= 65 ? 'green' : r.score >= 40 ? 'brand' : 'red'}
                    size="md"
                  />
                  <p className="text-xs text-slate-400 mt-1">{r.correct} / {r.total} correct</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Strong / Improve */}
      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <TrendingUp size={17} className="text-emerald-500" /> Strong Skills
          </h3>
          {strong.length > 0
            ? <ul className="space-y-2">
                {strong.map(r => (
                  <li key={r.skill} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm font-medium text-slate-700">✅ {r.skill}</span>
                    <span className="text-sm font-bold text-emerald-600">{r.score}%</span>
                  </li>
                ))}
              </ul>
            : <p className="text-slate-400 text-sm">Keep practicing — you'll build strengths soon!</p>
          }
        </Card>
        <Card>
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <TrendingDown size={17} className="text-amber-500" /> Skills to Improve
          </h3>
          {improve.length > 0
            ? <ul className="space-y-2">
                {improve.map(r => (
                  <li key={r.skill} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm font-medium text-slate-700">📈 {r.skill}</span>
                    <span className="text-sm font-bold text-amber-600">{r.score}%</span>
                  </li>
                ))}
              </ul>
            : <p className="text-slate-400 text-sm">Great job — no major weaknesses found!</p>
          }
        </Card>
      </div>

      {/* AI Analysis note */}
      <Card className="bg-gradient-to-r from-brand-50 to-violet-50 border-brand-100">
        <h3 className="font-bold text-slate-800 mb-2">📊 What this means for you</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Your overall score of <strong>{overall}%</strong> places you at the <strong>{levelFromScore(overall).label}</strong> level.
          {strong.length > 0 && ` Your strongest areas are ${strong.slice(0, 2).map(r => r.skill).join(' and ')}.`}
          {improve.length > 0 && ` Focus your learning on ${improve.slice(0, 2).map(r => r.skill).join(' and ')} to level up quickly.`}
          {' '}Your personalized roadmap has been updated to reflect these results.
        </p>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-between">
        <Button variant="outline" onClick={() => navigate('/assessment')}>
          <RotateCcw size={15} /> Retake Assessment
        </Button>
        <div className="flex gap-3">
          <Link to="/gaps"><Button variant="secondary">View Skill Gaps</Button></Link>
          <Button onClick={saveAndContinue}>
            Go to Dashboard <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}

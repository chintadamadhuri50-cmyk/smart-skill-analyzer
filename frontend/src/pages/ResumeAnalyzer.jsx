import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, X, Sparkles, Target } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Card } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import Button from '../components/ui/Button.jsx';
import ScoreRing from '../components/ui/ScoreRing.jsx';

const DEMO_RESULT = {
  score: 72,
  sections: [
    { name: 'Technical Skills', score: 85, status: 'good',    note: 'Well-listed with relevant keywords.' },
    { name: 'Education',        score: 90, status: 'good',    note: 'Education section is clear and complete.' },
    { name: 'Projects',         score: 75, status: 'good',    note: 'Projects included but lack measurable results.' },
    { name: 'Experience',       score: 50, status: 'warning', note: 'Limited work experience. Add internships or freelance work.' },
    { name: 'Keywords',         score: 60, status: 'warning', note: 'Missing keywords: REST APIs, Agile, CI/CD.' },
    { name: 'Formatting',       score: 80, status: 'good',    note: 'Clean layout, good use of white space.' },
    { name: 'Achievements',     score: 40, status: 'bad',     note: 'No quantified achievements. Add numbers and impact.' },
  ],
  strengths: [
    'Strong technical skills section with relevant technologies',
    'Projects section demonstrates hands-on experience',
    'Clean, ATS-friendly formatting',
    'Education section is complete and well-structured',
  ],
  missing: [
    'No quantified achievements (e.g., "Improved performance by 30%")',
    'Missing Git/GitHub profile link',
    'No summary/objective statement at the top',
    'REST APIs and Agile keywords absent',
    'Internship or work experience is sparse',
  ],
  suggestions: [
    'Add a 2-3 line professional summary at the top of your resume.',
    'Quantify your project outcomes: users, performance gains, lines of code.',
    'Include your GitHub URL and LinkedIn profile prominently.',
    'Add REST APIs, Agile, and CI/CD to your skills — these appear in most JDs.',
    'Consider adding a relevant internship or open-source contribution.',
    'Use action verbs: Built, Developed, Optimized, Implemented.',
  ],
  jobMatch: {
    role: 'Full Stack Developer',
    matchScore: 68,
    missingKeywords: ['Node.js', 'REST APIs', 'PostgreSQL', 'Docker', 'CI/CD'],
  },
};

const STATUS_META = {
  good:    { color: 'green',  icon: CheckCircle,   label: 'Good'    },
  warning: { color: 'yellow', icon: AlertTriangle, label: 'Improve' },
  bad:     { color: 'red',    icon: AlertTriangle, label: 'Missing' },
};

export default function ResumeAnalyzer() {
  const { profile, showToast } = useApp();
  const [file, setFile]         = useState(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult]     = useState(null);
  const inputRef = useRef();

  const accept = (f) => {
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      showToast('Only PDF and DOCX files are supported.', 'error'); return;
    }
    if (f.size > 5 * 1024 * 1024) {
      showToast('File must be under 5 MB.', 'error'); return;
    }
    setFile(f);
    setResult(null);
  };

  const analyze = async () => {
    setAnalyzing(true);
    // Simulate AI analysis delay
    await new Promise(r => setTimeout(r, 2200));
    setResult(DEMO_RESULT);
    setAnalyzing(false);
    showToast('Resume analysis complete!');
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Resume Analyzer</h2>
        <p className="text-slate-500 text-sm mt-1">Upload your resume and get an AI-powered score with actionable suggestions.</p>
      </div>

      {/* Upload zone */}
      {!result && (
        <Card>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files[0]); }}
            onClick={() => !file && inputRef.current?.click()}
            className={[
              'border-2 border-dashed rounded-2xl p-10 text-center transition-all',
              dragging ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50',
              !file ? 'cursor-pointer' : '',
            ].join(' ')}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={e => accept(e.target.files[0])}
            />

            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center">
                  <FileText size={28} className="text-brand-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{file.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={analyze} loading={analyzing}>
                    <Sparkles size={15} /> {analyzing ? 'Analyzing…' : 'Analyze Resume'}
                  </Button>
                  <Button variant="outline" onClick={reset}><X size={14} /> Remove</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Upload size={26} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Drag & drop your resume here</p>
                  <p className="text-slate-400 text-sm mt-1">or click to browse — PDF or DOCX, max 5 MB</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fade-in">
          {/* Score overview */}
          <Card className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing value={result.score} size={120} label="Resume Score" sublabel={result.score >= 75 ? 'Strong' : result.score >= 55 ? 'Good' : 'Needs Work'} />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-black text-slate-900 mb-1">
                {result.score >= 75 ? '🎉 Your resume is solid!' : result.score >= 55 ? '👍 Good start — room to improve' : '⚠️ Your resume needs attention'}
              </h2>
              <p className="text-slate-500 text-sm mb-3">
                Analyzed against your target role: <Badge variant="blue">{result.jobMatch.role}</Badge>
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="green">{result.strengths.length} strengths</Badge>
                <Badge variant="red">{result.missing.length} areas to fix</Badge>
                <Badge variant="blue">{result.jobMatch.matchScore}% job match</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={reset}>Re-upload</Button>
          </Card>

          {/* Section scores */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-4">Section Analysis</h3>
            <div className="space-y-4">
              {result.sections.map(s => {
                const meta = STATUS_META[s.status];
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <meta.icon size={14} className={s.status === 'good' ? 'text-emerald-500' : s.status === 'warning' ? 'text-amber-500' : 'text-red-500'} />
                        <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={meta.color}>{meta.label}</Badge>
                        <span className="text-sm font-bold text-slate-800">{s.score}%</span>
                      </div>
                    </div>
                    <ProgressBar value={s.score} color={s.status === 'good' ? 'green' : s.status === 'warning' ? 'yellow' : 'red'} size="sm" />
                    <p className="text-xs text-slate-400 mt-1">{s.note}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Strengths & Missing */}
          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" /> Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths.map(s => (
                  <li key={s} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>{s}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" /> Missing Areas
              </h3>
              <ul className="space-y-2">
                {result.missing.map(s => (
                  <li key={s} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-red-400 mt-0.5 shrink-0">!</span>{s}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Job match */}
          <Card className="bg-gradient-to-r from-brand-50 to-violet-50 border-brand-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-grad flex items-center justify-center shrink-0">
                <Target size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Job Role Match: {result.jobMatch.role}</h3>
                <p className="text-slate-500 text-sm">Your resume matches {result.jobMatch.matchScore}% of the keywords employers look for in this role.</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">Missing keywords for {result.jobMatch.role}:</p>
              <div className="flex flex-wrap gap-2">
                {result.jobMatch.missingKeywords.map(k => (
                  <Badge key={k} variant="red">{k}</Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* AI Suggestions */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-brand-500" /> AI Suggestions
            </h3>
            <ol className="space-y-3">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-slate-700 leading-relaxed">{s}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      )}
    </div>
  );
}

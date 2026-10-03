import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import StepIndicator from '../components/ui/StepIndicator.jsx';

const STEPS = ['Basic Info', 'Interests', 'Current Skills', 'Career Goal'];

const INTERESTS = [
  'Web Development','App Development','AI / Machine Learning','Data Science',
  'Cybersecurity','Cloud Computing','DevOps','Software Development','UI/UX Design','Data Analytics',
];

const SKILLS = [
  'Python','Java','C++','SQL','HTML/CSS','JavaScript','React','Node.js',
  'Git/GitHub','TypeScript','Docker','AWS','MongoDB','Machine Learning',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const CAREERS = [
  'Software Developer','Frontend Developer','Backend Developer','Full Stack Developer',
  'Data Analyst','Data Scientist','AI/ML Engineer','Cloud Engineer','Cybersecurity Analyst',
  'UI/UX Designer','DevOps Engineer',
];

const EDUCATION = ["Bachelor's", "Master's", 'Diploma', 'High School', 'PhD'];
const YEARS     = ['1st Year','2nd Year','3rd Year','4th Year','Graduated'];

export default function Onboarding() {
  const { user, updateUser } = useAuth();
  const { updateProfile } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  // Step 1 state
  const [info, setInfo] = useState({
    name: user?.name || '', education: '', branch: '', year: '',
  });
  // Step 2 state
  const [interests, setInterests] = useState([]);
  // Step 3 state
  const [skills, setSkills] = useState({}); // { skillName: level }
  const [customCareer, setCustomCareer] = useState('');
  // Step 4 state
  const [careerGoal, setCareerGoal] = useState('');

  const setI = (k, v) => { setInfo(p => ({ ...p, [k]: v })); setError(''); };

  const toggleInterest = (i) => {
    setInterests(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
    setError('');
  };

  const toggleSkill = (s) => {
    setSkills(p => {
      if (p[s]) { const n = { ...p }; delete n[s]; return n; }
      return { ...p, [s]: 'Beginner' };
    });
    setError('');
  };

  const setSkillLevel = (s, l) => setSkills(p => ({ ...p, [s]: l }));

  const validate = () => {
    if (step === 0) {
      if (!info.name.trim())    return 'Enter your full name.';
      if (!info.education)      return 'Select your education level.';
      if (!info.branch.trim())  return 'Enter your branch or major.';
      if (!info.year)           return 'Select your year of study.';
    }
    if (step === 1 && interests.length === 0) return 'Select at least one interest.';
    if (step === 2 && Object.keys(skills).length === 0) return 'Select at least one skill.';
    if (step === 3 && !careerGoal) return 'Choose your career goal.';
    return '';
  };

  const next = () => {
    const e = validate(); if (e) return setError(e);
    setError('');
    setStep(s => s + 1);
  };

  const finish = () => {
    const e = validate(); if (e) return setError(e);
    const goal = careerGoal === '__custom__' ? customCareer : careerGoal;
    updateUser({ ...info, onboardingComplete: true, interests, careerGoal: goal });
    updateProfile({
      name: info.name,
      careerGoal: goal,
      skills: Object.entries(skills).map(([name, level]) => ({ name, level, score: level === 'Advanced' ? 80 : level === 'Intermediate' ? 55 : 30 })),
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-grad flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-extrabold text-xl gradient-text">SkillSnap AI</span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-900 mb-1">Set up your profile</h1>
            <p className="text-slate-500 text-sm">Help us personalize your experience — takes about 2 minutes.</p>
          </div>

          <StepIndicator steps={STEPS} current={step} />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}

          {/* Step 0 — Basic Info */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <Input label="Full name" value={info.name} onChange={e => setI('name', e.target.value)} placeholder="e.g. Alex Kumar" />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Education" value={info.education} onChange={e => setI('education', e.target.value)} options={EDUCATION} />
                <Select label="Year of study" value={info.year} onChange={e => setI('year', e.target.value)} options={YEARS} />
              </div>
              <Input label="Branch / Major" value={info.branch} onChange={e => setI('branch', e.target.value)} placeholder="e.g. Computer Science" />
            </div>
          )}

          {/* Step 1 — Interests */}
          {step === 1 && (
            <div className="animate-fade-in">
              <p className="text-sm text-slate-500 mb-4">Select everything that interests you — pick as many as you like.</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(i => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleInterest(i)}
                    className={[
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all',
                      interests.includes(i)
                        ? 'bg-brand-grad text-white border-transparent shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300',
                    ].join(' ')}
                  >
                    {interests.includes(i) && <Check size={13} />}
                    {i}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Skills with levels */}
          {step === 2 && (
            <div className="animate-fade-in">
              <p className="text-sm text-slate-500 mb-4">Select skills you already know and rate your level honestly.</p>
              <div className="grid sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto scrollbar-thin pr-1">
                {SKILLS.map(s => {
                  const selected = !!skills[s];
                  return (
                    <div
                      key={s}
                      className={[
                        'rounded-xl border p-3 transition-all',
                        selected ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <button
                          type="button"
                          onClick={() => toggleSkill(s)}
                          className="flex items-center gap-2 text-sm font-semibold text-slate-800"
                        >
                          <div className={[
                            'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                            selected ? 'bg-brand-600 border-brand-600' : 'border-slate-300',
                          ].join(' ')}>
                            {selected && <Check size={10} className="text-white" />}
                          </div>
                          {s}
                        </button>
                      </div>
                      {selected && (
                        <div className="flex gap-1">
                          {LEVELS.map(l => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => setSkillLevel(s, l)}
                              className={[
                                'flex-1 text-xs py-1 rounded-lg font-medium transition-all',
                                skills[s] === l
                                  ? 'bg-brand-600 text-white'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300',
                              ].join(' ')}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3 — Career Goal */}
          {step === 3 && (
            <div className="animate-fade-in">
              <p className="text-sm text-slate-500 mb-4">What career are you targeting? This drives your entire roadmap.</p>
              <div className="grid sm:grid-cols-2 gap-2 mb-4">
                {CAREERS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setCareerGoal(c); setError(''); }}
                    className={[
                      'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all',
                      careerGoal === c
                        ? 'bg-brand-grad text-white border-transparent shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300',
                    ].join(' ')}
                  >
                    {careerGoal === c && <Check size={14} />}
                    {c}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setCareerGoal('__custom__'); setError(''); }}
                  className={[
                    'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all',
                    careerGoal === '__custom__'
                      ? 'bg-brand-grad text-white border-transparent'
                      : 'bg-white text-slate-700 border-dashed border-slate-300 hover:border-brand-300',
                  ].join(' ')}
                >
                  ✏️ Other (type your own)
                </button>
              </div>
              {careerGoal === '__custom__' && (
                <Input
                  placeholder="e.g. Game Developer, Embedded Systems Engineer…"
                  value={customCareer}
                  onChange={e => { setCustomCareer(e.target.value); setError(''); }}
                />
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-5 border-t border-slate-100">
            {step > 0
              ? <Button variant="outline" onClick={() => { setStep(s => s - 1); setError(''); }}>Back</Button>
              : <div />
            }
            {step < STEPS.length - 1
              ? <Button onClick={next}>Continue →</Button>
              : <Button onClick={finish}>Finish setup →</Button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

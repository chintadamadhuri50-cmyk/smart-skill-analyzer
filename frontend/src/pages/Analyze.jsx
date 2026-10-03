import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.jsx';
import SkillSelector from '../components/SkillSelector.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import { analyzeSkills, errMsg } from '../services/api.js';
import { EDUCATION, YEARS, LEVELS, TECH, SOFT, INTERESTS, CAREERS } from '../constants.js';

const STEPS = ['Profile', 'Technical Skills', 'Soft Skills', 'Interests', 'Career Preference'];
const EMPTY = { name: '', education: '', branch: '', year: '', experienceLevel: '', technicalSkills: [], softSkills: [], interests: [], careerPreference: '' };

export default function Analyze() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState(EMPTY);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, v) => { setF(p => ({ ...p, [k]: v })); setErr(''); };

  const check = () => {
    if (step === 0) return ['name', 'education', 'branch', 'year', 'experienceLevel'].some(k => !f[k].trim()) ? 'Fill in every field to continue.' : '';
    if (step === 1) return f.technicalSkills.length ? '' : 'Pick at least one technical skill.';
    if (step === 2) return f.softSkills.length ? '' : 'Pick at least one soft skill.';
    if (step === 3) return f.interests.length ? '' : 'Pick at least one interest.';
    return f.careerPreference ? '' : 'Choose a career area, or "Not Sure".';
  };
  const next = () => { const e = check(); if (e) return setErr(e); setStep(step + 1); };
  const submit = async () => {
    const e = check(); if (e) return setErr(e);
    setLoading(true); setErr('');
    try { const r = await analyzeSkills(f); nav(`/dashboard/${r.id}`); }
    catch (x) { setErr(errMsg(x)); setLoading(false); }   // form data is preserved for retry
  };

  if (loading) return <div className="container"><LoadingScreen /></div>;
  return (
    <div className="container narrow">
      <h1 className="page-title">Skill analysis</h1>
      <ProgressBar steps={STEPS} current={step} />
      <div className="card form">
        <h2>{STEPS[step]}</h2>
        {step === 0 && (
          <div className="fields">
            <label>Full name<input value={f.name} maxLength={80} onChange={e => set('name', e.target.value)} placeholder="e.g. Ananya Rao" /></label>
            <label>Branch or major<input value={f.branch} maxLength={80} onChange={e => set('branch', e.target.value)} placeholder="e.g. Computer Science" /></label>
            <label>Education<select value={f.education} onChange={e => set('education', e.target.value)}><option value="">Select…</option>{EDUCATION.map(o => <option key={o}>{o}</option>)}</select></label>
            <label>Year<select value={f.year} onChange={e => set('year', e.target.value)}><option value="">Select…</option>{YEARS.map(o => <option key={o}>{o}</option>)}</select></label>
            <label>Experience level<select value={f.experienceLevel} onChange={e => set('experienceLevel', e.target.value)}><option value="">Select…</option>{LEVELS.map(o => <option key={o}>{o}</option>)}</select></label>
          </div>
        )}
        {step === 1 && <><p className="hint">Choose the skills you already have. You can add your own.</p><SkillSelector options={TECH} value={f.technicalSkills} onChange={v => set('technicalSkills', v)} allowCustom /></>}
        {step === 2 && <><p className="hint">Which of these describe you?</p><SkillSelector options={SOFT} value={f.softSkills} onChange={v => set('softSkills', v)} allowCustom placeholder="Add a soft skill" /></>}
        {step === 3 && <><p className="hint">What do you enjoy working on?</p><SkillSelector options={INTERESTS} value={f.interests} onChange={v => set('interests', v)} allowCustom placeholder="Add an interest" /></>}
        {step === 4 && <><p className="hint">Pick one area. Choose "Not Sure" and the AI will suggest paths from your whole profile.</p><SkillSelector single options={CAREERS} value={f.careerPreference} onChange={v => set('careerPreference', v)} /></>}
        {err && <div className="error" role="alert">{err}</div>}
        <div className="row end">
          {step > 0 && <button className="btn ghost" onClick={() => { setErr(''); setStep(step - 1); }}>Back</button>}
          {step < 4 ? <button className="btn" onClick={next}>Continue</button> : <button className="btn" onClick={submit}>Analyze my profile</button>}
        </div>
      </div>
    </div>
  );
}

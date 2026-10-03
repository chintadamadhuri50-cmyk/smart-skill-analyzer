import { useEffect, useState } from 'react';
const MSGS = ['Understanding your skills…', 'Matching career paths…', 'Finding your skill gaps…', 'Building your learning roadmap…', 'Choosing projects for you…'];
export default function LoadingScreen() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % MSGS.length), 2500); return () => clearInterval(t); }, []);
  return (
    <div className="loading"><div className="spinner" /><h2>Analyzing your profile</h2><p key={i} className="fade">{MSGS[i]}</p><small>This usually takes 10–30 seconds.</small></div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalyses, deleteAnalysis, errMsg } from '../services/api.js';
import ConfirmModal from '../components/ConfirmModal.jsx';

export default function History() {
  const [list, setList] = useState(null);
  const [err, setErr] = useState('');
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = () => getAnalyses().then(setList).catch(e => { setErr(errMsg(e)); setList([]); });
  useEffect(() => { load(); }, []);

  const del = async () => {
    setBusy(true);
    try { await deleteAnalysis(target._id); setTarget(null); await load(); }
    catch (e) { setErr(errMsg(e)); setTarget(null); }
    setBusy(false);
  };
  if (!list) return <div className="container"><div className="card empty"><div className="spinner" /></div></div>;
  return (
    <div className="container">
      <h1 className="page-title">Analysis history</h1>
      {err && <div className="error">{err}</div>}
      {list.length === 0 ? (
        <div className="card empty"><h2>No skill analyses yet</h2><p>Complete the five-step form to create your first one.</p><Link className="btn" to="/analyze">Start analysis</Link></div>
      ) : (
        <div className="grid3">
          {list.map(a => (
            <div className="card" key={a._id}>
              <h3>{a.name}</h3>
              <p className="hint">{a.branch}</p>
              <div className="chips"><span className="tag">{a.careerPreference}</span><span className="tag alt">{a.aiAnalysis?.skillLevel?.level} · {a.aiAnalysis?.skillLevel?.percentage}%</span></div>
              <p className="hint">{new Date(a.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <div className="row"><Link className="btn small" to={`/history/${a._id}`}>View analysis</Link><button className="btn small danger-o" onClick={() => setTarget(a)}>Delete</button></div>
            </div>
          ))}
        </div>
      )}
      {target && <ConfirmModal title="Delete this analysis?" text={`The analysis for ${target.name} will be permanently removed.`} busy={busy} onConfirm={del} onCancel={() => setTarget(null)} />}
    </div>
  );
}

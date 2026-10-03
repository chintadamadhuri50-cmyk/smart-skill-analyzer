import { useState } from 'react';
export default function SkillSelector({ options, value, onChange, single = false, allowCustom = false, placeholder = 'Add your own' }) {
  const [text, setText] = useState('');
  const toggle = (o) => single ? onChange(o) : onChange(value.includes(o) ? value.filter(v => v !== o) : [...value, o]);
  const add = () => {
    const t = text.trim().slice(0, 50);
    if (t && !value.some(v => v.toLowerCase() === t.toLowerCase())) onChange([...value, t]);
    setText('');
  };
  const custom = single ? [] : value.filter(v => !options.includes(v));
  const isOn = (o) => single ? value === o : value.includes(o);
  return (
    <div>
      <div className="chips">
        {options.map(o => <button type="button" key={o} className={'chip' + (isOn(o) ? ' on' : '')} aria-pressed={isOn(o)} onClick={() => toggle(o)}>{o}</button>)}
      </div>
      {allowCustom && (
        <div className="add-row">
          <input value={text} placeholder={placeholder} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} />
          <button type="button" className="btn ghost" onClick={add}>Add skill</button>
        </div>
      )}
      {custom.length > 0 && <div className="chips">{custom.map(c => <span key={c} className="badge">{c}<button type="button" aria-label={`Remove ${c}`} onClick={() => onChange(value.filter(v => v !== c))}>×</button></span>)}</div>}
    </div>
  );
}

export default function ProgressBar({ steps, current }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={s} className={i === current ? 'active' : i < current ? 'done' : ''}><span>{i < current ? '✓' : i + 1}</span><em>{s}</em></li>
      ))}
    </ol>
  );
}

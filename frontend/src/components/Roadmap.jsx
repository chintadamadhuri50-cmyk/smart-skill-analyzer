export default function Roadmap({ steps }) {
  return (
    <ol className="timeline">
      {steps.map((s, i) => (
        <li key={i}>
          <span className="dot">{s.step || i + 1}</span>
          <div className="card">
            <h3>{s.title}</h3><p>{s.description}</p>
            <div className="chips"><span className="tag">{s.difficulty}</span><span className="tag">{s.duration}</span></div>
          </div>
        </li>
      ))}
    </ol>
  );
}

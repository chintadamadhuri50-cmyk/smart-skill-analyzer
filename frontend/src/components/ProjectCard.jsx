export default function ProjectCard({ p }) {
  return (
    <div className="card">
      <div className="row"><h3>{p.name}</h3><span className="tag">{p.difficulty}</span></div>
      <p>{p.description}</p>
      <div className="chips">{p.skills.map(s => <span className="tag alt" key={s}>{s}</span>)}</div>
    </div>
  );
}

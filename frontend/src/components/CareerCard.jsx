export default function CareerCard({ path }) {
  return (
    <div className="card career">
      <div className="row"><h3>{path.name}</h3><span className="pct">{path.matchPercentage}%</span></div>
      <div className="bar"><i style={{ width: path.matchPercentage + '%' }} /></div>
      <p>{path.description}</p>
      <div className="chips">{path.roles.map(r => <span className="tag" key={r}>{r}</span>)}</div>
    </div>
  );
}

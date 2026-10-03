export default function SkillGap({ item }) {
  return (
    <div className="card gap">
      <div className="row"><h3>{item.skill}</h3><span className={'imp ' + String(item.importance).toLowerCase()}>{item.importance} importance</span></div>
      <p>{item.reason}</p>
    </div>
  );
}

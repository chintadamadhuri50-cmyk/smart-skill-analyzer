export default function ConfirmModal({ title, text, onConfirm, onCancel, busy }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3><p>{text}</p>
        <div className="row end"><button className="btn ghost" onClick={onCancel}>Keep it</button><button className="btn danger" disabled={busy} onClick={onConfirm}>{busy ? 'Deleting…' : 'Delete analysis'}</button></div>
      </div>
    </div>
  );
}

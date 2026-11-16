function SummaryCard({ label, value, note, icon, tone = 'blue' }) {
  return (
    <article className="summary-card">
      <div className={`summary-card__icon summary-card__icon--${tone}`} aria-hidden="true">{icon}</div>
      <div>
        <p className="summary-card__label">{label}</p>
        <p className="summary-card__value">{value}</p>
        <p className="summary-card__note">{note}</p>
      </div>
    </article>
  );
}

export default SummaryCard;

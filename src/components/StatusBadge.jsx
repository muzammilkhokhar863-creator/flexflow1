function StatusBadge({ status }) {
  const tone = status.toLowerCase().replaceAll(' ', '-');
  return <span className={`status-badge status-badge--${tone}`}>{status}</span>;
}

export default StatusBadge;

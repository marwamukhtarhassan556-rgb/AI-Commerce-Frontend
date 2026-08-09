const statusStyles = {
  active: {
    wrapper: 'bg-secondary-container/20 text-on-secondary-container',
    dot: 'bg-secondary',
  },
  configuring: {
    wrapper: 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant',
    dot: 'bg-tertiary-fixed-dim',
  },
  suspended: {
    wrapper: 'bg-error-container/20 text-on-error-container',
    dot: 'bg-error',
  },
};

function StatusBadge({ status, label }) {
  const key = status?.toLowerCase();
  const styles = statusStyles[key] ?? statusStyles.active;
  const displayLabel = label ?? (status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Active');

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${styles.wrapper}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${styles.dot}`} />
      {displayLabel}
    </span>
  );
}

export default StatusBadge;

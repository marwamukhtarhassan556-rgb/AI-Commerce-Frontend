const categoryStyles = {
  AI: 'bg-primary/5 text-primary',
  API: 'bg-secondary-container/30 text-secondary',
  SUPPORT: 'bg-tertiary-fixed/40 text-tertiary',
};

function FeatureCategoryBadge({ category = 'AI' }) {
  const style = categoryStyles[category] ?? categoryStyles.AI;

  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${style}`}>
      {category}
    </span>
  );
}

export default FeatureCategoryBadge;
function AiOptimizationBanner({ tip }) {
  const parts = tip.highlight ? tip.message.split(tip.highlight) : [tip.message];

  return (
    <div className="admin-glass-card p-6 rounded-xl admin-ai-insight-border h-full">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="material-symbols-outlined text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
        <span className="text-primary text-xs font-semibold tracking-wider uppercase">{tip.title}</span>
      </div>
      <p className="text-on-surface text-sm leading-relaxed">
        {parts[0]}
        {tip.highlight && <span className="text-secondary font-bold">{tip.highlight}</span>}
        {parts[1]}
      </p>
      <div className="mt-4 flex gap-2">
        <button type="button" className="text-primary text-xs font-semibold hover:underline">
          {tip.actionLabel}
        </button>
      </div>
    </div>
  );
}

export default AiOptimizationBanner;

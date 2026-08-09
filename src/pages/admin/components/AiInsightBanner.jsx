function AiInsightBanner() {
  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 p-6 flex items-start gap-4 flex-wrap">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
      </div>
      <div className="flex-grow min-w-[200px]">
        <h4 className="text-sm font-semibold text-primary mb-1">AI Intelligence Insight</h4>
        <p className="text-sm text-on-surface-variant max-w-3xl">
          Platform performance is currently exceeding KPIs by 12%. Suggested action: Consider increasing server
          capacity for the <span className="font-bold text-on-surface">European Region</span> nodes to handle the
          upcoming seasonal traffic surge detected by our predictive algorithms.
        </p>
      </div>
      <button type="button" className="text-primary hover:underline text-xs font-semibold whitespace-nowrap">
        View Detailed Report
      </button>
    </div>
  );
}

export default AiInsightBanner;

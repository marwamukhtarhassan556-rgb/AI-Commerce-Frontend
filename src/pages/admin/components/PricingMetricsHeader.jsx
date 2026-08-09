function PricingMetricsHeader({ metrics }) {
  return metrics.map((metric) => (
    <div
      key={metric.label}
      className="admin-glass-card p-6 rounded-xl relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${metric.iconBg}`}>
          <span className="material-symbols-outlined">{metric.icon}</span>
        </div>
        {metric.change && (
          <span className="text-secondary flex items-center gap-1 text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            {metric.change}
          </span>
        )}
      </div>
      <p className="text-on-surface-variant text-sm font-semibold">{metric.label}</p>
      <h3 className="font-outfit text-[32px] font-semibold text-on-surface mt-1">{metric.value}</h3>
      <div className={`absolute bottom-0 left-0 w-full h-1 ${metric.accentBar} transition-colors`} />
    </div>
  ));
}

export default PricingMetricsHeader;

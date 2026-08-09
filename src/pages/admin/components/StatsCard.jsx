function StatsCard({ label, value, change, badge, icon, iconBg, highlight, iconFill }) {
  return (
    <div className={`admin-glass-card p-6 rounded-xl flex flex-col justify-between h-36 ${highlight ? 'admin-ai-insight-border' : ''}`}>
      <div className="flex justify-between items-start">
        <span className="text-on-surface-variant text-sm font-semibold">{label}</span>
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <span
            className="material-symbols-outlined"
            style={iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {icon}
          </span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-outfit text-[32px] font-semibold">{value}</span>
        {change && (
          <span className="text-secondary text-xs font-semibold flex items-center">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            {change}
          </span>
        )}
        {badge && (
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-secondary text-[10px] font-bold uppercase tracking-tight">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatsCard;

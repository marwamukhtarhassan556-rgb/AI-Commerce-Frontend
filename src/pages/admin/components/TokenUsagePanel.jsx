function TokenUsagePanel({ items, totalSpend = '$2,450' }) {
  return (
    <section className="admin-glass-card rounded-xl p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-outfit text-xl font-bold text-on-surface">AI Token Usage</h2>
          <p className="text-sm text-on-surface-variant">Aggregate consumption across all enterprise stores — Last 30 Days</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-on-surface-variant">Total Spend</p>
            <p className="font-outfit text-2xl font-bold text-primary">{totalSpend}</p>
          </div>
          <select className="bg-[#eff4ff] border border-outline-variant/30 rounded-lg text-sm font-semibold px-4 py-2 focus:ring-primary/20 outline-none">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Today</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.model} className="rounded-xl border border-outline-variant/20 p-4 bg-[#eff4ff]/30">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-semibold text-on-surface">{item.model}</span>
              <span className="text-xs font-semibold text-secondary">{item.trend}</span>
            </div>
            <p className="font-outfit text-2xl font-bold text-primary">{item.tokens}</p>
            <p className="text-xs text-on-surface-variant mt-1">{item.cost} estimated</p>
            <div className="h-1.5 w-full bg-[#dce9ff] rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TokenUsagePanel;

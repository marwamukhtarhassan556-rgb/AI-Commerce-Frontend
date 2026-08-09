function IntentsBarChart({ data }) {
  return (
    <section className="admin-glass-card rounded-xl p-8 admin-ai-glow-border overflow-hidden">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h2 className="font-outfit text-xl font-bold text-on-surface">Top Customer Intents</h2>
          <p className="text-sm text-on-surface-variant">Aggregate AI categorization across all enterprise stores</p>
        </div>
        <select className="bg-[#eff4ff] border border-outline-variant/30 rounded-lg text-sm font-semibold px-4 py-2 focus:ring-primary/20 outline-none">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Today</option>
        </select>
      </div>
      <div className="admin-bar-chart px-4">
        {data.map((bar) => (
          <div key={bar.label} className="flex-1 flex flex-col items-center group">
            <div
              className="admin-bar-pill bg-primary/20 hover:bg-primary transition-all cursor-help"
              style={{ height: bar.height }}
              title={`${bar.label}: ${bar.tooltip}`}
            />
            <span className="mt-4 text-xs font-semibold text-on-surface-variant text-center">{bar.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default IntentsBarChart;

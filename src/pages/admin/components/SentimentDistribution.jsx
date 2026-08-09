function SentimentDistribution({ categories }) {
  return (
    <div className="admin-glass-card rounded-xl p-8">
      <h2 className="font-outfit text-xl font-bold text-on-surface mb-6">AI Sentiment Distribution</h2>
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.label}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">{cat.label}</span>
              <span className="text-sm font-semibold text-secondary">{cat.positive}% Positive</span>
            </div>
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-[#dce9ff]">
              <div className="bg-secondary h-full" style={{ width: `${cat.positive}%` }} />
              <div className="bg-tertiary-fixed-dim h-full" style={{ width: `${cat.neutral}%` }} />
              <div className="bg-error h-full" style={{ width: `${cat.negative}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-6 mt-8 border-t border-outline-variant/30 pt-6 flex-wrap">
        {[
          { color: 'bg-secondary', label: 'Positive' },
          { color: 'bg-tertiary-fixed-dim', label: 'Neutral' },
          { color: 'bg-error', label: 'Negative' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-xs font-semibold text-on-surface-variant">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SentimentDistribution;

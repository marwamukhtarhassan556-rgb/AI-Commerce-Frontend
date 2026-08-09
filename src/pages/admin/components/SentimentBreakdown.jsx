function SentimentBreakdown({ items }) {
  return (
    <div className="admin-glass-card rounded-xl p-6">
      <h3 className="font-outfit text-xl font-medium mb-6">Sentiment Breakdown</h3>
      <div className="flex h-48 items-end gap-6 justify-around px-8">
        {items.map((item, index) => (
          <div key={item.icon || index} className="flex flex-col items-center gap-4 w-12">
            <div className={`w-full ${item.color} rounded-t-lg`} style={{ height: item.height }} />
            <span className={`text-xs font-semibold ${item.textColor}`}>{item.pct}</span>
            <span className={`material-symbols-outlined ${item.textColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {item.icon}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SentimentBreakdown;

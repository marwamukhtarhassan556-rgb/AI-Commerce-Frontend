function HistoricalPerformanceChart({ data, title = 'Historical Performance' }) {
  return (
    <div className="admin-glass-card p-6 rounded-2xl">
      <h3 className="text-sm font-bold mb-4">{title}</h3>
      <div className="h-48 bg-surface-container-low rounded-xl flex items-center justify-center border border-dashed border-outline-variant relative group overflow-hidden">
        <span className="text-on-surface-variant text-xs font-semibold z-10">Usage Growth Chart</span>
        <div className="absolute bottom-0 left-0 w-full flex items-end gap-1 px-4 pb-4 h-full opacity-30">
          {data.map((height, index) => (
            <div
              key={index}
              className="w-full bg-primary rounded-t-sm transition-all duration-500"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HistoricalPerformanceChart;

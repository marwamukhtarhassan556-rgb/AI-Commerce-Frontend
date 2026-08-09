function SystemHealthGauge({ label, value, sub, icon, accent, progress, border = '' }) {
  return (
    <div className={`admin-glass-card rounded-xl p-6 flex items-center justify-between ${border}`}>
      <div>
        <p className="text-sm font-semibold text-on-surface-variant mb-1">{label}</p>
        <h3 className="font-outfit text-[32px] font-bold text-primary">{value}</h3>
        {sub && (
          <p className="text-xs font-semibold text-on-surface-variant mt-2 flex items-center gap-1">
            {label === 'Latency' && (
              <span className="material-symbols-outlined text-[14px] text-secondary">trending_down</span>
            )}
            {sub}
          </p>
        )}
        {progress !== undefined && (
          <div className="w-32 h-1.5 bg-[#dce9ff] rounded-full mt-4 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(77,68,227,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${accent}`}>
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
    </div>
  );
}

function SystemHealthGauges({ gauges }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {gauges.map((gauge) => (
        <SystemHealthGauge key={gauge.label} {...gauge} />
      ))}
    </div>
  );
}

export default SystemHealthGauges;

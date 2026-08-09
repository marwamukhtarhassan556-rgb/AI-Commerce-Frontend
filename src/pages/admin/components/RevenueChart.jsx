function RevenueChart({ trend = [] }) {
  const hasTrend = trend.length > 0;
  const maxRevenue = Math.max(...trend.map((point) => point.revenue ?? 0), 1);
  const maxConversations = Math.max(...trend.map((point) => point.conversations ?? 0), 1);
  const chartWidth = 1000;
  const chartHeight = 300;
  const step = trend.length > 1 ? chartWidth / (trend.length - 1) : chartWidth;

  const revenuePoints = trend.map((point, index) => {
    const x = index * step;
    const y = chartHeight - ((point.revenue ?? 0) / maxRevenue) * (chartHeight - 40) - 20;
    return `${x},${y}`;
  });

  const conversationPoints = trend.map((point, index) => {
    const x = index * step;
    const y = chartHeight - ((point.conversations ?? 0) / maxConversations) * (chartHeight - 40) - 20;
    return `${x},${y}`;
  });

  const revenuePath = revenuePoints.length
    ? `M${revenuePoints.join(' L')} V${chartHeight} H0 Z`
    : '';
  const revenueLine = revenuePoints.length ? `M${revenuePoints.join(' L')}` : '';
  const conversationLine = conversationPoints.length ? `M${conversationPoints.join(' L')}` : '';

  return (
    <div className="lg:col-span-6 admin-glass-card rounded-xl p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-outfit text-xl font-medium">Revenue &amp; Growth</h3>
        <div className="flex gap-4">
          <span className="flex items-center gap-1 text-xs font-semibold text-primary">
            <span className="w-3 h-3 rounded-full bg-primary" /> Revenue
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-secondary">
            <span className="w-3 h-3 rounded-full bg-[#4edea3]" /> Conversations
          </span>
        </div>
      </div>
      <div className="flex-grow min-h-[300px] flex items-end relative">
        {hasTrend ? (
          <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
            <div className="w-full h-full relative overflow-hidden rounded-lg">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                <defs>
                  <linearGradient id="adminGrad1" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(79, 70, 229, 0.2)" />
                    <stop offset="100%" stopColor="rgba(79, 70, 229, 0)" />
                  </linearGradient>
                </defs>
                {revenuePath && <path d={revenuePath} fill="url(#adminGrad1)" />}
                {revenueLine && (
                  <path d={revenueLine} fill="none" stroke="#4f46e5" strokeWidth="3" />
                )}
                {conversationLine && (
                  <path
                    d={conversationLine}
                    fill="none"
                    stroke="#4edea3"
                    strokeDasharray="5,5"
                    strokeWidth="2"
                  />
                )}
              </svg>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-on-surface-variant">
            No trend data available yet.
          </div>
        )}
        <div className="w-full h-px bg-outline-variant/30 absolute bottom-12" />
        <div className="w-full h-px bg-outline-variant/30 absolute bottom-36" />
        <div className="w-full h-px bg-outline-variant/30 absolute bottom-60" />
      </div>
      {hasTrend && (
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-on-surface-variant">
          {trend.map((point) => (
            <span key={point.label ?? `${point.year}-${point.month}`}>{point.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default RevenueChart;

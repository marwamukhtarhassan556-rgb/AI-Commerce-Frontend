function StorePlatformsChart({ platforms = [], total }) {
  const displayTotal = total !== undefined ? total : platforms.reduce((acc, p) => acc + (p.count ?? 0), 0) || platforms.length;

  return (
    <div className="lg:col-span-4 admin-glass-card rounded-xl p-6">
      <h3 className="font-outfit text-xl font-medium mb-6">Store Platforms</h3>
      <div className="relative flex justify-center items-center py-8">
        <div
          className="w-48 h-48 rounded-full border-[16px] border-primary flex items-center justify-center"
          style={{ borderRightColor: '#6cf8bb', borderBottomColor: '#ffd4a4', transform: 'rotate(45deg)' }}
        >
          <div className="transform -rotate-45 flex flex-col items-center">
            <span className="font-outfit text-[32px] font-semibold">{displayTotal}</span>
            <span className="text-on-surface-variant text-xs font-semibold">Total Platforms</span>
          </div>
        </div>
      </div>
      <div className="space-y-4 mt-6">
        {platforms.map((item) => (
          <div key={item.label} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm">{item.label}</span>
            </div>
            <span className="font-bold">{item.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StorePlatformsChart;

function MerchantsPageHeader({
  globalSync,
  onToggleSync,
  search = '',
  platform = '',
  status = '',
  onSearchChange,
  onPlatformChange,
  onStatusChange,
  totalItems,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-outfit text-[32px] font-semibold text-[#0b1c30] tracking-tight">Stores Management</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            {totalItems !== undefined
              ? `Managing ${totalItems} stores from the admin API.`
              : 'Manage store status, plans, and seller details.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 admin-glass-panel px-4 py-2 rounded-xl">
            <span className="text-xs font-semibold text-on-surface-variant">Global Sync</span>
            <button
              type="button"
              role="switch"
              aria-checked={globalSync}
              onClick={onToggleSync}
              className={`relative w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${
                globalSync ? 'bg-secondary' : 'bg-outline-variant/40'
              }`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  globalSync ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Search stores..."
          className="px-4 py-3 rounded-xl border border-outline-variant/30 bg-white text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
        />
        <input
          type="text"
          value={platform}
          onChange={(event) => onPlatformChange?.(event.target.value)}
          placeholder="Filter by platform"
          className="px-4 py-3 rounded-xl border border-outline-variant/30 bg-white text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
        />
        <select
          value={status}
          onChange={(event) => onStatusChange?.(event.target.value)}
          className="px-4 py-3 rounded-xl border border-outline-variant/30 bg-white text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>
    </div>
  );
}

export default MerchantsPageHeader;

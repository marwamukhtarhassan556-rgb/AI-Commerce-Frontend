function AuditTrailTable({
  logs = [],
  actionFilter = '',
  onActionFilterChange,
  page = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
}) {
  const handleDownloadCsv = () => {
    if (!logs.length) return;
    const headers = ['Timestamp', 'Event Source', 'Activity', 'IP Address', 'User Agent'];
    const rows = logs.map((log) => [
      `"${log.time ?? ''}"`,
      `"${log.source ?? ''}"`,
      `"${log.activity ?? ''}"`,
      `"${log.ipAddress ?? ''}"`,
      `"${log.userAgent ?? ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="admin-glass-card rounded-xl overflow-hidden" id="audit">
      <div className="px-8 py-6 border-b border-outline-variant/30 flex justify-between items-center bg-[#eff4ff]/50 flex-wrap gap-4">
        <div>
          <h2 className="font-outfit text-xl font-bold text-on-surface">System Audit Trail</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Real-time security and authentication audit logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={actionFilter}
            onChange={(e) => onActionFilterChange?.(e.target.value)}
            placeholder="Filter by action (e.g. Login)..."
            className="px-3 py-1.5 rounded-lg border border-outline-variant/30 bg-white text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none w-56"
          />
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="text-primary text-xs font-semibold hover:underline flex items-center gap-1 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Download CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto admin-custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#eff4ff]/30">
              <th className="px-8 py-4 text-sm font-semibold text-on-surface-variant">Timestamp</th>
              <th className="px-8 py-4 text-sm font-semibold text-on-surface-variant">Event Source</th>
              <th className="px-8 py-4 text-sm font-semibold text-on-surface-variant">Activity</th>
              <th className="px-8 py-4 text-sm font-semibold text-on-surface-variant">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {logs.length ? (
              logs.map((log, index) => (
                <tr key={log.id || `${log.time}-${index}`} className="hover:bg-[#eff4ff] transition-colors">
                  <td className="px-8 py-4 text-sm">{log.time}</td>
                  <td className="px-8 py-4 text-sm font-semibold">{log.source}</td>
                  <td className="px-8 py-4 text-sm">{log.activity}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${log.statusClass}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-8 text-sm text-on-surface-variant text-center">
                  No audit log entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-8 py-4 bg-[#eff4ff]/20 flex justify-between items-center flex-wrap gap-4">
        <span className="text-xs text-on-surface-variant font-semibold">
          Showing {logs.length} of {totalItems} total logs
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange?.(Math.max(page - 1, 1))}
              className="px-3 py-1 rounded-lg border border-outline-variant/30 text-xs font-semibold disabled:opacity-40 hover:bg-white"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-on-surface-variant">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(Math.min(page + 1, totalPages))}
              className="px-3 py-1 rounded-lg border border-outline-variant/30 text-xs font-semibold disabled:opacity-40 hover:bg-white"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default AuditTrailTable;

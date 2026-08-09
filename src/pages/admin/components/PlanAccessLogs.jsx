function PlanAccessLogs({ logs }) {
  return (
    <div className="admin-glass-card p-6 rounded-2xl">
      <h3 className="text-sm font-bold mb-4">Plan Access Logs</h3>
      <div className="space-y-4">
        {logs.map((log, index) => (
          <div
            key={log.message}
            className={`flex items-center justify-between py-2 ${
              index < logs.length - 1 ? 'border-b border-outline-variant/20' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-xs">{log.icon}</span>
              </div>
              <span className="text-sm">{log.message}</span>
            </div>
            <span className="text-[10px] text-on-surface-variant uppercase">{log.time}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="w-full mt-4 text-primary text-xs font-semibold py-2 hover:bg-surface-container-low rounded-lg transition-all"
      >
        View all logs
      </button>
    </div>
  );
}

export default PlanAccessLogs;

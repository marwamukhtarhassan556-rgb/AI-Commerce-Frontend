function AdminPageState({ loading, error, onRetry, children }) {
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[320px]">
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          <p className="text-sm font-semibold">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[320px]">
        <div className="admin-glass-card rounded-xl p-8 max-w-lg text-center space-y-4">
          <span className="material-symbols-outlined text-4xl text-error">error</span>
          <div>
            <h3 className="font-outfit text-xl font-medium text-on-surface">Unable to load data</h3>
            <p className="text-sm text-on-surface-variant mt-2">{error}</p>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-all"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return children;
}

export default AdminPageState;

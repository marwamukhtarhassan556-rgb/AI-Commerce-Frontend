function MerchantsPagination({ page = 1, totalPages = 1, totalItems = 0, pageSize = 20, onPageChange }) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#eff4ff]/30">
      <p className="text-sm text-on-surface-variant">
        Showing {start} to {end} of {totalItems} stores
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange?.(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg text-on-surface-variant hover:bg-[#dce9ff] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <span className="px-3 text-sm font-semibold text-on-surface-variant">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange?.(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg hover:bg-[#dce9ff] transition-colors text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

export default MerchantsPagination;

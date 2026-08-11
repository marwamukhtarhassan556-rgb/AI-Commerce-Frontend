import { useEffect, useState } from 'react';
import { fetchStoreById } from '../../../services/super-admin/adminService';

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800 text-right">{value || 'N/A'}</span>
    </div>
  );
}

function StoreDetailsDrawer({ storeId, open, onClose }) {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !storeId) return;

    let cancelled = false;

    const loadStoreDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStoreById(storeId);
        if (!cancelled) setStore(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load store details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadStoreDetails();

    return () => {
      cancelled = true;
    };
  }, [storeId, open]);

  if (!open) return null;

  const isActive = store?.status?.toLowerCase() === 'active';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close store details"
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
        onClick={onClose}
      />

      <aside className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div>
            <h2 className="font-outfit text-lg font-bold text-slate-900">Store Details</h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">Overview of store configuration</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200/70"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center gap-2 py-20 text-center text-slate-500">
              <span className="material-symbols-outlined animate-spin text-2xl text-indigo-600">progress_activity</span>
              <span className="text-sm font-medium">Loading store details...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          ) : store ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-outfit text-base font-bold text-slate-900">{store.name || 'N/A'}</h3>
                    <p className="mt-0.5 font-mono text-xs text-slate-500">{store.shopDomain || store.domain || 'N/A'}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                      isActive
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {store.status || 'Unknown'}
                  </span>
                </div>
              </div>

              <section className="rounded-xl border border-slate-200 bg-white p-4">
                <DetailRow label="Store ID" value={store.id} />
                <DetailRow label="Platform" value={store.platform} />
                <DetailRow label="Owner Email" value={store.email || store.sellerEmail} />
                <DetailRow label="Plan" value={store.plan?.label || store.activePlan} />
                <DetailRow label="Subscription" value={store.subscriptionStatus} />
              </section>
            </div>
          ) : (
            <div className="py-20 text-center text-sm font-medium text-slate-400">No store selected.</div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default StoreDetailsDrawer;

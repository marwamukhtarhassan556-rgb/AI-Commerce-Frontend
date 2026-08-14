import { useEffect, useMemo, useState } from 'react';
import {
  demoteTopBundle,
  fetchBundleConfig,
  fetchBundlesTracking,
  promoteTopBundle,
  updateBundleConfig,
} from '../../api/aiService';

function StatCard({ label, value, sub, color = '#2563EB' }) {
  return (
    <article className="admin-card admin-border rounded-xl p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--color-on-surface-variant)' }}>{label}</p>
      <p className="mt-2 text-3xl font-bold" style={{ color }}>{value}</p>
      {sub && <p className="mt-1 text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>{sub}</p>}
    </article>
  );
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(Number(value || 0));
}

export default function SuperAdminBundles() {
  const [bundles, setBundles] = useState([]);
  const [config, setConfig] = useState({ threshold: 5, enabled: true });
  const [draft, setDraft] = useState({ threshold: 5, enabled: true });
  const [topOnly, setTopOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workingKey, setWorkingKey] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [trackingData, configData] = await Promise.all([
        fetchBundlesTracking(topOnly).catch(() => []),
        fetchBundleConfig().catch(() => ({ threshold: 5, enabled: true })),
      ]);
      const rows = Array.isArray(trackingData) ? trackingData : trackingData?.items || trackingData?.bundles || [];
      setBundles(rows);
      setConfig(configData || { threshold: 5, enabled: true });
      setDraft(configData || { threshold: 5, enabled: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [topOnly]);

  const stats = useMemo(() => {
    const copies = bundles.reduce((sum, bundle) => sum + Number(bundle.copy_count || bundle.copyCount || 0), 0);
    const top = bundles.filter((bundle) => bundle.is_top || bundle.isTop).length;
    const discount = bundles.reduce((sum, bundle) => sum + Number(bundle.total_discount || bundle.totalDiscount || 0), 0);
    return { copies, top, discount };
  }, [bundles]);

  const saveConfig = async () => {
    setSaving(true);
    try {
      const payload = { threshold: Number(draft.threshold || 1), enabled: Boolean(draft.enabled) };
      const saved = await updateBundleConfig(payload);
      setConfig(saved || payload);
      setDraft(saved || payload);
    } finally {
      setSaving(false);
    }
  };

  const toggleTop = async (bundle) => {
    const key = bundle.bundle_key || bundle.bundleKey;
    setWorkingKey(key);
    try {
      if (bundle.is_top || bundle.isTop) {
        await demoteTopBundle(key);
      } else {
        await promoteTopBundle({ bundle_key: key });
      }
      await load();
    } finally {
      setWorkingKey('');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>Bundle Promo Tracking</h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Promo-copy events, top bundles, discount impact, and tracking threshold.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setTopOnly((value) => !value)} className="admin-button-secondary rounded-lg px-4 py-2 text-sm font-bold">
            {topOnly ? 'Showing top only' : 'Showing all bundles'}
          </button>
          <button type="button" onClick={load} className="navi-admin-button px-4">
            <span className="material-symbols-outlined text-lg">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Tracked Bundles" value={bundles.length} />
        <StatCard label="Top Bundles" value={stats.top} color="#F59E0B" />
        <StatCard label="Promo Copies" value={stats.copies.toLocaleString()} color="#16A34A" />
        <StatCard label="Discount Impact" value={formatMoney(stats.discount)} color="#7C3AED" />
      </section>

      <section className="admin-card admin-border rounded-xl p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--color-on-surface)' }}>Tracking Config</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Current threshold: {config.threshold ?? 5}, tracking {config.enabled ? 'enabled' : 'disabled'}.</p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--color-on-surface-variant)' }}>
              Threshold
              <input
                type="number"
                min="1"
                max="100"
                value={draft.threshold ?? 5}
                onChange={(event) => setDraft((prev) => ({ ...prev, threshold: event.target.value }))}
                className="mt-1 block h-10 w-28 rounded-lg px-3 text-sm navi-input"
              />
            </label>
            <label className="admin-button-secondary flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(draft.enabled)}
                onChange={(event) => setDraft((prev) => ({ ...prev, enabled: event.target.checked }))}
              />
              Enabled
            </label>
            <button type="button" onClick={saveConfig} disabled={saving} className="navi-admin-button px-4">
              {saving ? 'Saving...' : 'Save config'}
            </button>
          </div>
        </div>
      </section>

      <section className="admin-card admin-border overflow-hidden rounded-xl shadow-sm">
        <div className="border-b px-6 py-4" style={{ borderColor: 'var(--admin-border)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--color-on-surface)' }}>Bundle Tracking Records</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center" style={{ color: 'var(--color-on-surface-variant)' }}>Loading bundles...</div>
        ) : bundles.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--color-on-surface-variant)' }}>No bundle copy events have been tracked yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase" style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}>
                <tr>
                  {['Bundle Key', 'Promo Code', 'Products', 'Discount', 'Copies', 'Last Copied', 'Top', 'Action'].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ borderColor: 'var(--admin-border)' }}>
                {bundles.map((bundle, index) => {
                  const key = bundle.bundle_key || bundle.bundleKey || `bundle-${index}`;
                  const isTop = bundle.is_top || bundle.isTop;
                  const products = bundle.product_ids || bundle.productIds || [];

                  return (
                    <tr key={key} className="border-t transition-colors" style={{ borderColor: 'var(--admin-border)', background: 'var(--admin-card)' }} onMouseEnter={e => e.currentTarget.style.background='var(--color-surface-container-low)'} onMouseLeave={e => e.currentTarget.style.background='var(--admin-card)'}>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-on-surface)' }}>{key}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-on-surface-variant)' }}>{bundle.promo_code || bundle.promoCode || '-'}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-on-surface-variant)' }}>{Array.isArray(products) && products.length ? products.join(', ') : '-'}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {bundle.discount_pct || bundle.discountPct || 0}% / {formatMoney(bundle.total_discount || bundle.totalDiscount)}
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-on-surface)' }}>{Number(bundle.copy_count || bundle.copyCount || 0).toLocaleString()}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-on-surface-variant)' }}>{bundle.last_copied_at || bundle.lastCopiedAt || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isTop ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {isTop ? 'Top' : 'Standard'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleTop(bundle)}
                          disabled={workingKey === key}
                          className="rounded-lg border border-[#2563EB] px-3 py-1.5 text-xs font-bold text-[#2563EB] disabled:opacity-50"
                        >
                          {workingKey === key ? 'Working...' : isTop ? 'Demote' : 'Promote'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

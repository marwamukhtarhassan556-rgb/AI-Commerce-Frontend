import { useEffect, useState } from 'react';
import { Settings, Star } from 'lucide-react';
import { bundlesApi } from '../../../api/integrationApi';

/* Loading remote data requires state updates from effects. */
/* eslint-disable react-hooks/set-state-in-effect */

export default function BundlesTab({ storeId }) {
  const [topOnly, setTopOnly] = useState(false);
  const [bundles, setBundles] = useState([]);
  const [config, setConfig] = useState({ enabled: true, threshold: 15 });
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadBundles = () => {
    if (!storeId) return;
    setLoading(true); setError('');
    bundlesApi.list(storeId, topOnly).then(({ data }) => setBundles(Array.isArray(data) ? data : data?.items || [])).catch(() => setError('Bundles could not be loaded.')).finally(() => setLoading(false));
  };

  useEffect(loadBundles, [storeId, topOnly]);
  useEffect(() => { if (storeId) bundlesApi.getConfig(storeId).then(({ data }) => setConfig(data)).catch(() => {}); }, [storeId]);

  const saveConfig = async () => {
    try { await bundlesApi.updateConfig(storeId, { enabled: config.enabled, threshold: Number(config.threshold) }); setShowSettings(false); }
    catch { setError('Bundle settings could not be saved.'); }
  };
  const toggleTop = async (bundle) => {
    try { if (bundle.is_top) await bundlesApi.demote(storeId, bundle.bundle_key); else await bundlesApi.promote(storeId, bundle.bundle_key); loadBundles(); }
    catch { setError('Bundle promotion could not be updated.'); }
  };

  return <div>
    <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-white"><label className="flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={topOnly} onChange={(event) => setTopOnly(event.target.checked)} /><div className="w-9 h-5 bg-surface-container-highest rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary relative" /><span className="ml-3 text-xs font-medium text-on-surface-variant">Show Top Bundles Only</span></label><button onClick={() => setShowSettings((value) => !value)} className="p-2 hover:bg-surface-container-low rounded-full text-on-surface-variant" title="Bundle settings"><Settings className="w-4 h-4" /></button></div>
    {showSettings && <div className="p-4 border-b border-outline-variant/30 flex flex-wrap items-center gap-4"><label className="text-xs">Auto-promote after <input type="number" min="1" value={config.threshold} onChange={(event) => setConfig((value) => ({ ...value, threshold: event.target.value }))} className="ml-2 w-16 rounded border p-1" /> copies</label><label className="text-xs"><input type="checkbox" checked={config.enabled} onChange={(event) => setConfig((value) => ({ ...value, enabled: event.target.checked }))} className="mr-2" />Enable tracking</label><button onClick={saveConfig} className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white">Save</button></div>}
    {error && <p className="m-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-error">{error}</p>}
    <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead className="bg-surface-container-low border-b border-outline-variant/30"><tr>{['Bundle Products', 'Discount', 'Promo Code', 'Copy Count'].map((heading) => <th key={heading} className="px-6 py-4 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{heading}</th>)}<th className="px-6 py-4" /></tr></thead><tbody className="divide-y divide-outline-variant/20">
      {loading && <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-on-surface-variant">Loading bundles…</td></tr>}
      {!loading && bundles.length === 0 && <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-on-surface-variant">No tracked bundles found.</td></tr>}
      {!loading && bundles.map((bundle) => <tr key={bundle.id || bundle.bundle_key} className="hover:bg-surface transition-colors"><td className="px-6 py-4"><div className="flex -space-x-2">{(bundle.product_ids || []).slice(0, 3).map((id) => <div key={id} title={id} className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[10px] font-semibold">{String(id).slice(0, 2).toUpperCase()}</div>)}</div></td><td className="px-6 py-4 text-xs font-bold text-emerald-600">{Number(bundle.discount_pct || 0)}% OFF</td><td className="px-6 py-4"><span className="px-3 py-1 bg-surface-container-low text-primary rounded-full text-xs font-mono">{bundle.promo_code || '—'}</span></td><td className="px-6 py-4 text-xs font-semibold text-on-surface">{bundle.copy_count || 0}</td><td className="px-6 py-4 text-right"><button onClick={() => toggleTop(bundle)} title={bundle.is_top ? 'Remove from top bundles' : 'Promote to top bundles'}><Star className={`w-4 h-4 inline ${bundle.is_top ? 'text-amber-500 fill-amber-500' : 'text-on-surface-variant'}`} /></button></td></tr>)}
    </tbody></table></div>
  </div>;
}

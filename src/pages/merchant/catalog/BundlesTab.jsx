import { useEffect, useState } from 'react';
import { Copy, Eye, LoaderCircle, Settings, Sparkles, Star, X } from 'lucide-react';
import { bundlesApi, recommendationsApi } from '../../../api/integrationApi';

/* Loading remote bundle data updates component state from effects. */
/* eslint-disable react-hooks/set-state-in-effect */

const requestError = (error, fallback) => error.response?.status === 401 ? 'AI service authentication failed. Please sign in again after the AI token is configured.' : error.response?.data?.detail || error.response?.data?.message || fallback;

export default function BundlesTab({ storeId }) {
  const [topOnly, setTopOnly] = useState(false);
  const [bundles, setBundles] = useState([]);
  const [config, setConfig] = useState({ enabled: true, threshold: 15 });
  const [showSettings, setShowSettings] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionInput, setSuggestionInput] = useState({ message: '', customerId: '' });
  const [suggestion, setSuggestion] = useState(null);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState('');

  const loadBundles = () => {
    if (!storeId) return;
    setLoading(true); setError('');
    bundlesApi.list(storeId, topOnly)
      .then(({ data }) => setBundles(Array.isArray(data) ? data : data?.items || []))
      .catch((error) => setError(requestError(error, 'Bundles could not be loaded.')))
      .finally(() => setLoading(false));
  };

  useEffect(loadBundles, [storeId, topOnly]);
  useEffect(() => { if (storeId) bundlesApi.getConfig(storeId).then(({ data }) => setConfig(data)).catch(() => {}); }, [storeId]);

  const saveConfig = async () => {
    try { await bundlesApi.updateConfig(storeId, { enabled: config.enabled, threshold: Number(config.threshold) }); setShowSettings(false); }
    catch (error) { setError(requestError(error, 'Bundle settings could not be saved.')); }
  };

  const toggleTop = async (bundle) => {
    try { if (bundle.is_top) await bundlesApi.demote(storeId, bundle.bundle_key); else await bundlesApi.promote(storeId, bundle.bundle_key); loadBundles(); }
    catch (error) { setError(requestError(error, 'Bundle promotion could not be updated.')); }
  };

  const getDetails = async (bundleKey) => {
    setLoadingDetails(true); setSelectedBundle(null);
    try { const { data } = await bundlesApi.getOne(bundleKey, storeId); setSelectedBundle(data); }
    catch (error) { setError(requestError(error, 'Bundle details could not be loaded.')); }
    finally { setLoadingDetails(false); }
  };

  const getSuggestion = async (event) => {
    event.preventDefault();
    if (!suggestionInput.message.trim() || !storeId) return;
    setSuggesting(true); setError(''); setSuggestion(null);
    try {
      const { data } = await recommendationsApi.getBundleSuggestion({ message: suggestionInput.message, storeId, customerId: suggestionInput.customerId || undefined });
      setSuggestion(data);
    } catch (error) { setError(requestError(error, 'AI bundle suggestion could not be created.')); }
    finally { setSuggesting(false); }
  };

  const copyPromoCode = async (bundle) => {
    if (!bundle?.promo_code || !storeId) return;
    try {
      await navigator.clipboard.writeText(bundle.promo_code);
      await bundlesApi.track({
        store_id: storeId,
        promo_code: bundle.promo_code,
        product_ids: (bundle.products || []).map((product) => product.product_id || product.id).filter(Boolean),
        discount_pct: Number(bundle.discount_pct || 0),
        total_discount: Number(bundle.total_discount || 0),
        total_original: Number(bundle.total_original || 0),
      });
    } catch {
      setError('We could not copy this promo code. Please try again.');
    }
  };

  return <div>
    <div className="flex items-center justify-between border-b border-outline-variant/30 bg-white p-4"><label className="flex cursor-pointer items-center"><input type="checkbox" className="sr-only peer" checked={topOnly} onChange={(event) => setTopOnly(event.target.checked)} /><div className="relative h-5 w-9 rounded-full bg-surface-container-highest after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full" /><span className="ml-3 text-xs font-medium text-on-surface-variant">Show Top Bundles Only</span></label><div className="flex items-center gap-1"><button onClick={() => setShowSuggestion((value) => !value)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white"><Sparkles className="h-3.5 w-3.5" />AI Suggestion</button><button onClick={() => setShowSettings((value) => !value)} className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low" title="Bundle settings"><Settings className="h-4 w-4" /></button></div></div>
    {showSuggestion && <section className="border-b border-outline-variant/30 bg-surface-container-low p-5"><div className="mb-4"><h3 className="flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4 text-primary" />AI Bundle Suggestion</h3><p className="mt-1 text-xs text-on-surface-variant">Describe the customer need and budget. The AI will suggest a bundle from this store.</p></div><form onSubmit={getSuggestion} className="grid gap-3 md:grid-cols-[1fr_12rem_auto]"><input required value={suggestionInput.message} onChange={(event) => setSuggestionInput((value) => ({ ...value, message: event.target.value }))} placeholder="e.g. A laptop bundle under $1500 for programming" className="rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-sm" /><input value={suggestionInput.customerId} onChange={(event) => setSuggestionInput((value) => ({ ...value, customerId: event.target.value }))} placeholder="Customer ID (optional)" className="rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-sm" /><button disabled={suggesting} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{suggesting ? 'Thinking…' : 'Suggest'}</button></form>{suggestion && <div className="mt-4 grid gap-3 lg:grid-cols-2">{(suggestion.bundles || []).map((bundle, index) => <article key={index} className="rounded-xl border border-primary/20 bg-white p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-primary">Suggested bundle #{index + 1}</p><ul className="mt-2 space-y-1">{(bundle.products || []).map((product) => <li key={product.product_id} className="text-sm font-medium text-on-surface">{product.product_title} <span className="text-on-surface-variant">— {product.price_after_discount} after {product.discount_pct}% off</span></li>)}</ul></div>{bundle.promo_code && <button type="button" onClick={() => copyPromoCode(bundle)} title="Copy promo code" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"><Copy className="h-3.5 w-3.5" />{bundle.promo_code}</button>}</div><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-outline-variant/20 pt-3 text-xs"><span>Original: <b>{bundle.total_original}</b></span><span className="text-emerald-600">Discount: <b>{bundle.total_discount}</b></span><span>Final: <b>{bundle.total_after_discount}</b></span></div></article>)}</div>}{suggestion?.rationale && <p className="mt-3 text-xs text-on-surface-variant">{suggestion.rationale}</p>}</section>}
    {showSettings && <div className="flex flex-wrap items-center gap-4 border-b border-outline-variant/30 p-4"><label className="text-xs">Auto-promote after <input type="number" min="1" value={config.threshold} onChange={(event) => setConfig((value) => ({ ...value, threshold: event.target.value }))} className="ml-2 w-16 rounded border p-1" /> copies</label><label className="text-xs"><input type="checkbox" checked={config.enabled} onChange={(event) => setConfig((value) => ({ ...value, enabled: event.target.checked }))} className="mr-2" />Enable tracking</label><button onClick={saveConfig} className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white">Save</button></div>}
    {error && <p className="m-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-error">{error}</p>}
    <div className="overflow-x-auto"><table className="w-full border-collapse text-left"><thead className="border-b border-outline-variant/30 bg-surface-container-low"><tr>{['Bundle Products', 'Discount', 'Promo Code', 'Copy Count'].map((heading) => <th key={heading} className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">{heading}</th>)}<th className="px-6 py-4" /></tr></thead><tbody className="divide-y divide-outline-variant/20">{loading && <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-on-surface-variant">Loading bundles…</td></tr>}{!loading && bundles.length === 0 && <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-on-surface-variant">No tracked bundles found.</td></tr>}{!loading && bundles.map((bundle) => <tr key={bundle.id || bundle.bundle_key} className="transition-colors hover:bg-surface"><td className="px-6 py-4"><div className="flex -space-x-2">{(bundle.product_ids || []).slice(0, 3).map((id) => <div key={id} title={id} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-surface-container-high text-[10px] font-semibold">{String(id).slice(0, 2).toUpperCase()}</div>)}</div></td><td className="px-6 py-4 text-xs font-bold text-emerald-600">{Number(bundle.discount_pct || 0)}% OFF</td><td className="px-6 py-4"><span className="rounded-full bg-surface-container-low px-3 py-1 font-mono text-xs text-primary">{bundle.promo_code || '—'}</span></td><td className="px-6 py-4 text-xs font-semibold text-on-surface">{bundle.copy_count || 0}</td><td className="px-6 py-4 text-right"><div className="flex justify-end gap-3"><button onClick={() => getDetails(bundle.bundle_key)} title="View bundle details"><Eye className="h-4 w-4 text-on-surface-variant" /></button><button onClick={() => toggleTop(bundle)} title={bundle.is_top ? 'Remove from top bundles' : 'Promote to top bundles'}><Star className={`inline h-4 w-4 ${bundle.is_top ? 'fill-amber-500 text-amber-500' : 'text-on-surface-variant'}`} /></button></div></td></tr>)}</tbody></table></div>
    {(loadingDetails || selectedBundle) && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4"><section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold">Bundle details</h2><p className="mt-1 text-xs text-on-surface-variant">{selectedBundle?.bundle_key || 'Loading bundle…'}</p></div><button onClick={() => { setSelectedBundle(null); setLoadingDetails(false); }} aria-label="Close details"><X className="h-5 w-5" /></button></div>{loadingDetails ? <div className="flex justify-center py-10"><LoaderCircle className="h-6 w-6 animate-spin text-primary" /></div> : <div className="mt-5 space-y-4 text-sm"><dl className="grid grid-cols-2 gap-3"><div><dt className="text-xs text-on-surface-variant">Promo code</dt><dd className="font-mono font-semibold">{selectedBundle.promo_code || '—'}</dd></div><div><dt className="text-xs text-on-surface-variant">Copies</dt><dd className="font-semibold">{selectedBundle.copy_count || 0}</dd></div><div><dt className="text-xs text-on-surface-variant">Discount</dt><dd>{selectedBundle.discount_pct || 0}%</dd></div><div><dt className="text-xs text-on-surface-variant">Total discount</dt><dd>{selectedBundle.total_discount || 0}</dd></div><div><dt className="text-xs text-on-surface-variant">First copied</dt><dd>{selectedBundle.first_copied_at ? new Date(selectedBundle.first_copied_at).toLocaleString() : '—'}</dd></div><div><dt className="text-xs text-on-surface-variant">Last copied</dt><dd>{selectedBundle.last_copied_at ? new Date(selectedBundle.last_copied_at).toLocaleString() : '—'}</dd></div></dl><div><p className="text-xs text-on-surface-variant">Product IDs</p><p className="mt-1 break-all font-mono text-xs">{(selectedBundle.product_ids || []).join(', ') || '—'}</p></div></div>}</section></div>}
  </div>;
}

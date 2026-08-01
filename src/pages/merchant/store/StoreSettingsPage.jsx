import { useEffect, useState } from 'react';
import { AlertTriangle, Globe, Info, Save } from 'lucide-react';
import { storesApi } from '../../../api/integrationApi';

const emptyStore = { name: '', description: '', platform: '', shopDomain: '', status: 'active', currency: '', language: '', timezone: '' };

export default function StoreSettingsPage() {
  const storeId = localStorage.getItem('currentStoreId') || localStorage.getItem('storeId');
  const [store, setStore] = useState(emptyStore);
  const [loading, setLoading] = useState(Boolean(storeId));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(storeId ? '' : 'Select a store before managing its settings.');

  useEffect(() => {
    if (!storeId) return;
    let mounted = true;
    storesApi.getById(storeId).then(({ data }) => {
      if (mounted) setStore({ ...emptyStore, ...data });
    }).catch(() => mounted && setMessage('Store details could not be loaded.')).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [storeId]);

  const updateField = (event) => setStore((value) => ({ ...value, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  const saveDetails = async () => {
    if (!storeId) return;
    setSaving(true); setMessage('');
    try {
      const { data } = await storesApi.update(storeId, { name: store.name, description: store.description, platform: store.platform, shopDomain: store.shopDomain, status: store.status });
      setStore((value) => ({ ...value, ...data })); setMessage('Store details saved.');
    } catch { setMessage('Store details could not be saved.'); }
    finally { setSaving(false); }
  };
  const saveRegionalSettings = async () => {
    if (!storeId) return;
    setSaving(true); setMessage('');
    try {
      const { data } = await storesApi.updateSettings(storeId, store);
      setStore((value) => ({ ...value, ...data })); setMessage('Regional settings saved.');
    } catch { setMessage('Regional settings could not be saved.'); }
    finally { setSaving(false); }
  };
  const deleteStore = async () => {
    if (!storeId || !window.confirm(`Delete ${store.name || 'this store'} permanently?`)) return;
    try { await storesApi.delete(storeId); localStorage.removeItem('storeId'); localStorage.removeItem('currentStoreId'); window.location.href = '/merchant/dashboard'; }
    catch { setMessage('Store could not be deleted.'); }
  };

  return <div className="min-h-screen bg-surface text-on-surface p-6 lg:p-10"><div className="max-w-5xl mx-auto space-y-8"><div><h2 className="text-3xl font-extrabold tracking-tight">Store Settings</h2><p className="text-gray-500 mt-1 text-sm">Manage your store's identity and regional preferences.</p></div>{message && <p className="rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">{message}</p>}{loading ? <div className="rounded-xl bg-white p-8 text-center text-sm text-on-surface-variant">Loading store…</div> : <>
    <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"><div className="px-6 py-4 bg-surface-container-low border-b border-gray-200 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-primary"><Info className="w-5 h-5" /></div><h3 className="font-bold text-lg">Store Details</h3></div><div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"><label className="space-y-1.5"><span className="text-xs font-semibold text-gray-600">Store Name</span><input name="name" value={store.name} onChange={updateField} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" /></label><label className="space-y-1.5"><span className="text-xs font-semibold text-gray-600">Shop Domain</span><input name="shopDomain" value={store.shopDomain} onChange={updateField} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" /></label><label className="md:col-span-2 space-y-1.5"><span className="text-xs font-semibold text-gray-600">Description</span><textarea name="description" rows="3" value={store.description} onChange={updateField} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" /></label><label className="space-y-1.5"><span className="text-xs font-semibold text-gray-600">Platform</span><input name="platform" value={store.platform} onChange={updateField} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" /></label><label className="space-y-1.5"><span className="text-xs font-semibold text-gray-600">Status</span><select name="status" value={store.status} onChange={updateField} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"><option value="active">Active</option><option value="inactive">Inactive</option></select></label></div><div className="px-6 py-4 border-t border-gray-200 flex justify-end"><button onClick={saveDetails} disabled={saving || !storeId} className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4" />Save Details</button></div></section>
    <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"><div className="px-6 py-4 bg-surface-container-low border-b border-gray-200 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600"><Globe className="w-5 h-5" /></div><h3 className="font-bold text-lg">Regional Settings</h3></div><div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">{[['currency', 'Base Currency'], ['language', 'Primary Language'], ['timezone', 'Store Timezone']].map(([field, label]) => <label key={field} className="space-y-1.5"><span className="text-xs font-semibold text-gray-600">{label}</span><input name={field} value={store[field] || ''} onChange={updateField} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" /></label>)}</div><div className="px-6 py-4 border-t border-gray-200 flex justify-end"><button onClick={saveRegionalSettings} disabled={saving || !storeId} className="border border-primary text-primary px-6 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50">Save Localization</button></div></section>
    <section className="bg-white border border-red-200 rounded-2xl overflow-hidden shadow-sm"><div className="px-6 py-4 bg-red-50/50 border-b border-red-100 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600"><AlertTriangle className="w-5 h-5" /></div><h3 className="font-bold text-lg text-red-700">Danger Zone</h3></div><div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"><div><h4 className="font-bold text-sm">Delete Store Permanently</h4><p className="text-xs text-gray-500 mt-1">This action cannot be undone.</p></div><button onClick={deleteStore} disabled={!storeId} className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50">Delete Store</button></div></section>
  </>}</div></div>;
}

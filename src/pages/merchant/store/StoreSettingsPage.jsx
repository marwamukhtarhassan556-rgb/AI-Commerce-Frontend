import { useEffect, useState } from 'react';
import { AlertTriangle, Globe, Info, Save, Tag } from 'lucide-react';
import { storeCapabilitiesApi, storesApi } from '../../../api/integrationApi';

const emptyStore = { name: '', description: '', platform: '', shopDomain: '', status: 'active', currency: '', language: '', timezone: '' };

export default function StoreSettingsPage() {
  const storeId = localStorage.getItem('currentStoreId') || localStorage.getItem('storeId');
  const [store, setStore] = useState(emptyStore);
  const [capabilities, setCapabilities] = useState({});
  const [loading, setLoading] = useState(Boolean(storeId));
  const [saving, setSaving] = useState(false);
  const [updatingPromoCapability, setUpdatingPromoCapability] = useState(false);
  const [message, setMessage] = useState(storeId ? '' : 'Select a store before managing its settings.');

  useEffect(() => {
    if (!storeId) return;
    let mounted = true;
    Promise.all([storesApi.getById(storeId), storeCapabilitiesApi.get(storeId)])
      .then(([{ data: storeData }, { data: capabilityData }]) => {
        if (!mounted) return;
        setStore({ ...emptyStore, ...storeData });
        setCapabilities(capabilityData?.capabilities || {});
      })
      .catch(() => mounted && setMessage('Store details or capabilities could not be loaded.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [storeId]);

  const updateField = (event) => setStore((value) => ({ ...value, [event.target.name]: event.target.value }));

  const saveDetails = async () => {
    if (!storeId) return;
    setSaving(true); setMessage('');
    try {
      const { data } = await storesApi.update(storeId, { name: store.name, description: store.description, platform: store.platform, shopDomain: store.shopDomain, status: store.status });
      setStore((value) => ({ ...value, ...data }));
      setMessage('Store details saved.');
    } catch { setMessage('Store details could not be saved.'); }
    finally { setSaving(false); }
  };

  const saveRegionalSettings = async () => {
    if (!storeId) return;
    setSaving(true); setMessage('');
    try {
      const { data } = await storesApi.updateSettings(storeId, store);
      setStore((value) => ({ ...value, ...data }));
      setMessage('Regional settings saved.');
    } catch { setMessage('Regional settings could not be saved.'); }
    finally { setSaving(false); }
  };

  const updatePromoCapability = async (event) => {
    const nextValue = event.target.checked;
    if (!storeId) return;
    const previousCapabilities = capabilities;
    const nextCapabilities = { ...capabilities, has_promo_code: nextValue };
    setCapabilities(nextCapabilities);
    setUpdatingPromoCapability(true); setMessage('');
    try {
      await storeCapabilitiesApi.update({ storeId, capabilities: nextCapabilities });
      setMessage(`Promo codes ${nextValue ? 'enabled' : 'disabled'} for this store.`);
    } catch {
      setCapabilities(previousCapabilities);
      setMessage('Promo-code capability could not be updated.');
    } finally { setUpdatingPromoCapability(false); }
  };

  const deleteStore = async () => {
    if (!storeId || !window.confirm(`Delete ${store.name || 'this store'} permanently?`)) return;
    try {
      await storesApi.delete(storeId);
      localStorage.removeItem('storeId'); localStorage.removeItem('currentStoreId');
      window.location.href = '/merchant/dashboard';
    } catch { setMessage('Store could not be deleted.'); }
  };

  return (
    <div className="min-h-screen bg-surface p-6 text-on-surface lg:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div><h2 className="text-3xl font-extrabold tracking-tight">Store Settings</h2><p className="mt-1 text-sm text-gray-500">Manage your store's identity, preferences, and capabilities.</p></div>
        {message && <p className="rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant" role="status">{message}</p>}
        {loading ? <div className="rounded-xl bg-white p-8 text-center text-sm text-on-surface-variant">Loading store…</div> : <>
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <SectionTitle icon={<Info className="h-5 w-5" />} title="Store Details" iconClass="bg-blue-100 text-primary" />
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
              <Field label="Store Name"><input name="name" value={store.name} onChange={updateField} className="store-input" /></Field>
              <Field label="Shop Domain"><input name="shopDomain" value={store.shopDomain} onChange={updateField} className="store-input" /></Field>
              <Field label="Description" className="md:col-span-2"><textarea name="description" rows="3" value={store.description} onChange={updateField} className="store-input resize-none" /></Field>
              <Field label="Platform"><input name="platform" value={store.platform} onChange={updateField} className="store-input" /></Field>
              <Field label="Status"><select name="status" value={store.status} onChange={updateField} className="store-input"><option value="active">Active</option><option value="inactive">Inactive</option></select></Field>
            </div>
            <div className="flex justify-end border-t border-gray-200 px-6 py-4"><button onClick={saveDetails} disabled={saving || !storeId} className="store-primary-button"><Save className="h-4 w-4" />Save Details</button></div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <SectionTitle icon={<Tag className="h-5 w-5" />} title="Store Capabilities" iconClass="bg-amber-100 text-amber-700" />
            <div className="store-capability-row">
              <div className="store-capability-copy"><span className="store-capability-eyebrow">Discount settings</span><h4>This store supports promo codes</h4><p>Enable this only if sellers can create and apply promo codes in this store. The AI uses this setting when making suggestions.</p></div>
              <label className={`store-capability-toggle ${updatingPromoCapability ? 'is-saving' : ''}`}><input type="checkbox" checked={Boolean(capabilities.has_promo_code)} onChange={updatePromoCapability} disabled={updatingPromoCapability || !storeId} /><span className="store-capability-switch" aria-hidden="true" /><span className="text-sm font-semibold" aria-live="polite">{!storeId ? 'Select a store first' : updatingPromoCapability ? 'Saving…' : capabilities.has_promo_code ? 'Promo codes on' : 'Promo codes off'}</span></label>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <SectionTitle icon={<Globe className="h-5 w-5" />} title="Regional Settings" iconClass="bg-purple-100 text-purple-600" />
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">{[['currency', 'Base Currency'], ['language', 'Primary Language'], ['timezone', 'Store Timezone']].map(([field, label]) => <Field key={field} label={label}><input name={field} value={store[field] || ''} onChange={updateField} className="store-input" /></Field>)}</div>
            <div className="flex justify-end border-t border-gray-200 px-6 py-4"><button onClick={saveRegionalSettings} disabled={saving || !storeId} className="store-secondary-button">Save Localization</button></div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            <SectionTitle icon={<AlertTriangle className="h-5 w-5" />} title="Danger Zone" iconClass="bg-red-100 text-red-600" titleClass="text-red-700" />
            <div className="flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center"><div><h4 className="text-sm font-bold">Delete Store Permanently</h4><p className="mt-1 text-xs text-gray-500">This action cannot be undone.</p></div><button onClick={deleteStore} disabled={!storeId} className="rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white disabled:opacity-50">Delete Store</button></div>
          </section>
        </>}
      </div>
    </div>
  );
}

function SectionTitle({ icon, title, iconClass, titleClass = '' }) {
  return <div className="flex items-center gap-3 border-b border-gray-200 bg-surface-container-low px-6 py-4"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>{icon}</div><h3 className={`text-lg font-bold ${titleClass}`}>{title}</h3></div>;
}

function Field({ label, className = '', children }) {
  return <label className={`space-y-1.5 ${className}`}><span className="text-xs font-semibold text-gray-600">{label}</span>{children}</label>;
}

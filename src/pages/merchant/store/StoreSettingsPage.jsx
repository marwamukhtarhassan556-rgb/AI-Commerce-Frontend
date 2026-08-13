import { useEffect, useState } from 'react';
import { AlertTriangle, Globe, Info, KeyRound, MessageCircle, Save } from 'lucide-react';
import { storesApi } from '../../../api/integrationApi';
import { refreshAccessToken } from '../../../api/axiosConfig';

const emptyStore = { name: '', description: '', platform: '', shopDomain: '', status: 'active', currency: '', language: '', timezone: '' };

export default function StoreSettingsPage() {
  const storeId = localStorage.getItem('currentStoreId') || localStorage.getItem('storeId');
  const [store, setStore] = useState(emptyStore);
  const [loading, setLoading] = useState(Boolean(storeId));
  const [saving, setSaving] = useState(false);
  const [savingAdminInfo, setSavingAdminInfo] = useState(false);
  const [savingDailyLimit, setSavingDailyLimit] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ adminEmail: '', adminPassword: '' });
  const [dailyAllowedMessage, setDailyAllowedMessage] = useState('10');
  const [message, setMessage] = useState(storeId ? '' : 'Select a store before managing its settings.');

  useEffect(() => {
    if (!storeId) return;
    let mounted = true;
    storesApi.getById(storeId)
      .then(({ data: storeData }) => {
        if (!mounted) return;
        setStore({ ...emptyStore, ...storeData });
        setDailyAllowedMessage(String(storeData?.dailyAllowedMessage ?? 10));
      })
      .catch(() => mounted && setMessage('Store details could not be loaded.'))
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

  const updateAdminInfo = (event) => setAdminInfo((value) => ({ ...value, [event.target.name]: event.target.value }));

  const saveDailyMessageLimit = async () => {
    const limit = Number(dailyAllowedMessage);
    if (!storeId || !Number.isInteger(limit) || limit < 1) {
      setMessage('Enter a whole number of at least 1 message per customer, per day.');
      return;
    }
    setSavingDailyLimit(true); setMessage('');
    try {
      await storesApi.updateDailyAllowedMessage(storeId, limit);
      setDailyAllowedMessage(String(limit));
      setMessage('Daily customer message limit saved.');
    } catch { setMessage('The daily message limit could not be saved. Please try again.'); }
    finally { setSavingDailyLimit(false); }
  };

  const saveAdminInfo = async () => {
    if (!storeId) return;
    if (!adminInfo.adminEmail.trim() || !adminInfo.adminPassword) {
      setMessage('Enter the admin email and password before saving.');
      return;
    }
    setSavingAdminInfo(true); setMessage('');
    try {
      await storesApi.updateAdminInfo(storeId, {
        adminEmail: adminInfo.adminEmail.trim(),
        adminPassword: adminInfo.adminPassword,
      });
      await refreshAccessToken();
      setAdminInfo((value) => ({ ...value, adminPassword: '' }));
      setMessage('Admin panel credentials updated and your access token was refreshed.');
    } catch (error) {
      const detail = error.response?.data?.message || error.response?.data?.detail;
      setMessage(detail || 'We could not update the admin panel credentials. Please check them and try again.');
    } finally { setSavingAdminInfo(false); }
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
        <div><h2 className="text-3xl font-extrabold tracking-tight">Store Settings</h2><p className="mt-1 text-sm text-gray-500">Manage your store's identity and regional preferences.</p></div>
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
            <SectionTitle icon={<MessageCircle className="h-5 w-5" />} title="Customer message limit" iconClass="bg-blue-100 text-blue-700" />
            <div className="grid gap-5 p-6 md:grid-cols-[minmax(0,1fr)_14rem] md:items-end"><div><h4 className="text-sm font-bold">Daily messages per customer</h4><p className="mt-1 text-sm text-gray-500">Set how many messages one customer can send to the storefront AI widget in one day. This helps prevent chat misuse.</p></div><Field label="Messages per day"><input type="number" min="1" step="1" value={dailyAllowedMessage} onChange={(event) => setDailyAllowedMessage(event.target.value)} className="store-input" /></Field></div>
            <div className="flex justify-end border-t border-gray-200 px-6 py-4"><button onClick={saveDailyMessageLimit} disabled={savingDailyLimit || !storeId} className="store-primary-button"><Save className="h-4 w-4" />{savingDailyLimit ? 'Saving…' : 'Save message limit'}</button></div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <SectionTitle icon={<Globe className="h-5 w-5" />} title="Regional Settings" iconClass="bg-purple-100 text-purple-600" />
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">{[['currency', 'Base Currency'], ['language', 'Primary Language'], ['timezone', 'Store Timezone']].map(([field, label]) => <Field key={field} label={label}><input name={field} value={store[field] || ''} onChange={updateField} className="store-input" /></Field>)}</div>
            <div className="flex justify-end border-t border-gray-200 px-6 py-4"><button onClick={saveRegionalSettings} disabled={saving || !storeId} className="store-secondary-button">Save Localization</button></div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <SectionTitle icon={<KeyRound className="h-5 w-5" />} title="Update Admin Panel" iconClass="bg-sky-100 text-sky-700" />
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
              <Field label="E-commerce Admin Email"><input type="email" name="adminEmail" value={adminInfo.adminEmail} onChange={updateAdminInfo} autoComplete="username" placeholder="admin@yourstore.com" className="store-input" /></Field>
              <Field label="E-commerce Admin Password"><input type="password" name="adminPassword" value={adminInfo.adminPassword} onChange={updateAdminInfo} autoComplete="new-password" placeholder="Enter the current admin password" className="store-input" /></Field>
            </div>
            <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-gray-500">Saving refreshes your access token so the AI integration uses the latest credentials.</p><button onClick={saveAdminInfo} disabled={savingAdminInfo || !storeId} className="store-primary-button shrink-0"><KeyRound className="h-4 w-4" />{savingAdminInfo ? 'Saving…' : 'Save Admin Credentials'}</button></div>
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

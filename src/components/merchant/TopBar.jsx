import { useEffect, useMemo, useState } from 'react';
import { Bell, ChevronDown, HelpCircle, RefreshCw, Settings } from 'lucide-react';
import { integrationApi, storesApi } from '../../api/integrationApi';
import LogoutButton from '../LogoutButton';

const normalizeStores = (data) => Array.isArray(data) ? data : data?.items || data?.data?.items || data?.data || data?.result?.items || data?.result || [];

export default function TopBar() {
  const [stores, setStores] = useState([]);
  const [currentStoreId, setCurrentStoreId] = useState(() => localStorage.getItem('currentStoreId') || localStorage.getItem('storeId') || '');
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const merchantProfile = (() => {
    try { return JSON.parse(localStorage.getItem('merchantProfile') || '{}'); } catch { return {}; }
  })();
  const merchantName = [merchantProfile.firstName, merchantProfile.lastName].filter(Boolean).join(' ') || merchantProfile.name || merchantProfile.email || 'Merchant';
  const merchantInitials = merchantName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'M';

  useEffect(() => {
    let mounted = true;
    storesApi.list().then(({ data }) => {
      if (!mounted) return;
      const availableStores = normalizeStores(data);
      setStores(availableStores);
      const storedId = localStorage.getItem('currentStoreId') || localStorage.getItem('storeId');
      const selectedId = availableStores.some((store) => store.id === storedId) ? storedId : availableStores[0]?.id;
      if (selectedId) { localStorage.setItem('currentStoreId', selectedId); setCurrentStoreId(selectedId); }
    }).catch(() => mounted && setStores([]));
    return () => { mounted = false; };
  }, []);

  const currentStore = useMemo(() => stores.find((store) => store.id === currentStoreId), [stores, currentStoreId]);
  const selectStore = (storeId) => { localStorage.setItem('currentStoreId', storeId); setCurrentStoreId(storeId); setIsStoreMenuOpen(false); window.location.reload(); };
  const handleSync = async () => {
    if (!currentStoreId) { window.alert('اختاري متجرًا أولًا.'); return; }
    setIsSyncing(true);
    try {
      const { data } = await integrationApi.listConnections(currentStoreId);
      const connections = Array.isArray(data) ? data : data?.items || data?.connections || [];
      const connection = connections.find((item) => String(item.status).toLowerCase() === 'active') || connections[0];
      const connectionId = connection?.id || connection?.connection_id;
      if (!connectionId) { window.alert('لا يوجد اتصال متجر جاهز للمزامنة.'); return; }
      await integrationApi.syncConnection(connectionId);
      window.alert('تم بدء المزامنة بنجاح.');
    } catch (error) {
      console.error('Sync failed:', error.response?.data || error);
      window.alert(error.response?.status === 401 ? 'خدمة الـAI رفضت التوكن.' : 'فشلت المزامنة.');
    } finally { setIsSyncing(false); }
  };

  return <header className="merchant-topbar fixed top-0 right-0 left-0 z-40 flex min-h-16 items-center gap-3 border-b border-slate-200 bg-white px-3 py-2 lg:left-[280px] sm:px-5">
    <div className="relative shrink-0"><button onClick={() => setIsStoreMenuOpen((open) => !open)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><span className="h-3 w-3 rounded bg-emerald-500" /><span className="max-w-24 truncate">{currentStore?.name || 'Select Store'}</span><ChevronDown className="h-4 w-4 text-slate-400" /></button>{isStoreMenuOpen && <div className="absolute left-0 top-11 z-50 min-w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">{stores.length ? stores.map((store) => <button key={store.id} onClick={() => selectStore(store.id)} className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50">{store.name}</button>) : <p className="px-4 py-2 text-sm text-slate-500">No stores found</p>}</div>}</div>
    <button onClick={handleSync} disabled={isSyncing} className="flex shrink-0 items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">{isSyncing ? 'Syncing…' : 'Sync Now'}</span></button>
    <div className="hidden min-w-0 flex-1 border-l border-slate-100 pl-3 md:block"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">AI Tokens</p><p className="text-xs text-slate-400">Usage endpoint not configured</p></div>
    <div className="ml-auto flex shrink-0 items-center gap-1 text-slate-400"><button className="hidden rounded-full p-2 hover:bg-slate-50 sm:block"><Bell className="h-5 w-5" /></button><button className="hidden rounded-full p-2 hover:bg-slate-50 md:block"><Settings className="h-5 w-5" /></button><button className="hidden rounded-full p-2 hover:bg-slate-50 md:block"><HelpCircle className="h-5 w-5" /></button><div className="hidden border-l border-slate-100 pl-3 text-right lg:block"><p className="max-w-40 truncate text-sm font-bold text-slate-900">{merchantName}</p><p className="text-[10px] text-slate-400">MANAGE ACCOUNT</p></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{merchantInitials}</div><LogoutButton variant="ghost" className="px-2 py-2 text-xs" /></div>
  </header>;
}

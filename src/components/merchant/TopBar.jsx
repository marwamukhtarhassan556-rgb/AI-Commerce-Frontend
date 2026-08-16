import { useEffect, useMemo, useState } from 'react';
import { Bell, Clock3, Loader2, RefreshCw, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsApi, integrationApi, storesApi, subscriptionsApi, ticketsApi } from '../../api/integrationApi';
import { normalizeSubscription } from './subscription/subscriptionStatus';
import LogoutButton from '../LogoutButton';
import { profileApi } from '../../api/profileApi';
import { resolveProfilePicture, saveMerchantProfile } from '../../utils/profilePicture';
import { getUserErrorMessage } from '../../utils/errorMessage';

const normalizeStores = (data) => Array.isArray(data) ? data : data?.items || data?.data?.items || data?.data || data?.result?.items || data?.result || [];
const normalizeTickets = (data) => Array.isArray(data) ? data : data?.items || data?.data?.items || data?.data || [];
const notificationTime = (value) => value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';

export default function TopBar() {
  const [stores, setStores] = useState([]);
  const [currentStoreId, setCurrentStoreId] = useState(() => localStorage.getItem('currentStoreId') || localStorage.getItem('storeId') || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [aiUsage, setAiUsage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [merchantProfile, setMerchantProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('merchantProfile') || '{}'); } catch { return {}; }
  });
  const merchantName = [merchantProfile.firstName, merchantProfile.lastName].filter(Boolean).join(' ') || merchantProfile.name || merchantProfile.email || 'Merchant';
  const merchantInitials = merchantName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'M';

  useEffect(() => {
    const refreshProfile = () => {
      try { setMerchantProfile(JSON.parse(localStorage.getItem('merchantProfile') || '{}')); } catch { setMerchantProfile({}); }
    };
    window.addEventListener('merchant-profile-updated', refreshProfile);

    if (localStorage.getItem('token')) {
      profileApi.get().then(({ data }) => {
        if (!data) return;
        const updated = saveMerchantProfile({
          firstName: data.firstName || data.first_name || '',
          lastName: data.lastName || data.last_name || '',
          email: data.email || '',
          profilePictureUrl: data.profilePictureUrl || data.profile_picture_url || '',
        });
        if (updated) setMerchantProfile(updated);
      }).catch(() => { /* silent fallback */ });
    }

    return () => window.removeEventListener('merchant-profile-updated', refreshProfile);
  }, []);

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

  useEffect(() => {
    let mounted = true;
    subscriptionsApi.getTrialStatus().then(({ data }) => {
      if (mounted) setSubscription(normalizeSubscription(data));
    }).catch(() => mounted && setSubscription(null));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!currentStoreId) { setNotifications([]); setUnreadNotifications(0); return undefined; }
    let mounted = true;
    const loadNotifications = async () => {
      setNotificationsLoading(true);
      try {
        const { data } = await ticketsApi.list({ storeId: currentStoreId, pageSize: 50 });
        const tickets = normalizeTickets(data);
        if (!mounted) return;
        // Show open/in-progress tickets as notifications
        const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress');
        const mapped = openTickets.slice(0, 20).map((t) => ({
          id: t.id || t.ticket_id,
          message: t.summary || t.category || 'New ticket',
          created_at: t.created_at || t.analyzed_at,
          priority: t.priority,
          status: t.status,
        }));
        setNotifications(mapped);
        setUnreadNotifications(openTickets.length);
      } catch {
        if (mounted) { setNotifications([]); setUnreadNotifications(0); }
      } finally { if (mounted) setNotificationsLoading(false); }
    };
    void loadNotifications();
    return () => { mounted = false; };
  }, [currentStoreId]);

  useEffect(() => {
    if (!currentStoreId) { setAiUsage(null); return undefined; }
    let mounted = true;
    analyticsApi.getAIUsage(currentStoreId)
      .then(({ data }) => mounted && setAiUsage(data))
      .catch(() => mounted && setAiUsage(null));
    return () => { mounted = false; };
  }, [currentStoreId]);

  const currentStore = useMemo(() => stores.find((store) => store.id === currentStoreId), [stores, currentStoreId]);
  const handleSync = async () => {
    if (!currentStoreId) { window.alert('Select a store first.'); return; }
    setIsSyncing(true);
    try {
      const { data } = await integrationApi.listConnections(currentStoreId);
      const connections = Array.isArray(data) ? data : data?.items || data?.connections || [];
      const connection = connections.find((item) => String(item.status).toLowerCase() === 'active') || connections[0];
      const connectionId = connection?.id || connection?.connection_id;
      if (!connectionId) { window.alert('No store connection is ready to sync.'); return; }
      await integrationApi.syncConnection(connectionId);
      window.alert('Sync started successfully.');
    } catch (error) {
      console.error('Sync failed:', error.response?.data || error);
      window.alert(getUserErrorMessage(error, 'We could not start the sync. Please try again.'));
    } finally { setIsSyncing(false); }
  };

  return <header className="merchant-topbar fixed top-0 right-0 left-0 z-40 flex min-h-16 items-center gap-3 border-b border-slate-200 bg-white px-3 py-2 lg:left-[280px] sm:px-5">
    <div className="merchant-store-selector shrink-0 cursor-default"><span className="merchant-store-selector__icon"><Store className="h-4 w-4" /></span><span className="min-w-0 text-left"><span className="merchant-store-selector__label">Store</span><span className="merchant-store-selector__name">{currentStore?.name || 'Select a store'}</span></span></div>
    <button onClick={handleSync} disabled={isSyncing} className="flex shrink-0 items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">{isSyncing ? 'Syncing…' : 'Sync Now'}</span></button>
    <div className="hidden min-w-0 flex-1 border-l border-slate-100 pl-3 md:block"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">AI Tokens</p><p className="truncate text-xs text-slate-400">{aiUsage ? `${Number(aiUsage.tokens?.used || 0).toLocaleString()} of ${Number(aiUsage.tokens?.limit || 0).toLocaleString()} used` : 'Usage unavailable'}</p></div>
    <div className="ml-auto flex shrink-0 items-center gap-1 text-slate-400">
      {subscription?.isTrialing && <Link to="/merchant/subscription" className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold sm:inline-flex ${subscription.remainingDays <= 1 ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300' : 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'}`}><Clock3 className="h-3.5 w-3.5" />Trial · {subscription.remainingDays} {subscription.remainingDays === 1 ? 'day' : 'days'} left</Link>}
      {subscription?.isExpired && <Link to="/onboarding?step=3" className="hidden items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white sm:inline-flex"><Clock3 className="h-3.5 w-3.5" />Trial ended · Choose plan</Link>}
      <div className="relative hidden sm:block"><button type="button" onClick={() => setIsNotificationsOpen((open) => !open)} aria-label="Open tickets" className="relative rounded-full p-2 hover:bg-slate-50"><Bell className="h-5 w-5" />{unreadNotifications > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{unreadNotifications > 99 ? '99+' : unreadNotifications}</span>}</button>{isNotificationsOpen && <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><p className="text-sm font-bold text-slate-900">Open Tickets</p><Link to="/merchant/tickets" onClick={() => setIsNotificationsOpen(false)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View all</Link></div><div className="max-h-80 overflow-y-auto">{notificationsLoading ? <div className="flex justify-center p-6"><Loader2 className="h-5 w-5 animate-spin text-indigo-600" /></div> : notifications.length ? notifications.map((notification) => <Link key={notification.id} to="/merchant/tickets" onClick={() => setIsNotificationsOpen(false)} className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50"><span className={`mt-0.5 inline-flex h-2 w-2 shrink-0 rounded-full ${notification.priority === 'urgent' || notification.priority === 'p1' ? 'bg-rose-500' : notification.priority === 'high' || notification.priority === 'p2' ? 'bg-amber-500' : 'bg-indigo-400'}`} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-800">{notification.message}</p><p className="mt-0.5 text-xs text-slate-400">{notification.priority ? `${notification.priority} · ` : ''}{notificationTime(notification.created_at)}</p></div></Link>) : <p className="px-4 py-8 text-center text-sm text-slate-500">No open tickets 🎉</p>}</div></div>}</div>
      <div className="hidden border-l border-slate-100 pl-3 text-right lg:block"><p className="max-w-40 truncate text-sm font-bold text-slate-900">{merchantName}</p><p className="text-[10px] text-slate-400">MANAGE ACCOUNT</p></div><div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-sm font-bold text-white">{merchantProfile.profilePictureUrl ? <img src={resolveProfilePicture(merchantProfile.profilePictureUrl)} alt="" className="h-full w-full object-cover" /> : merchantInitials}</div><LogoutButton variant="ghost" className="px-2 py-2 text-xs" />
    </div>
  </header>;
}

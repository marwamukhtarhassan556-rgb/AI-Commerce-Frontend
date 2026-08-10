import { useEffect, useState } from 'react';
import { ArrowUp, Bot, CheckCircle2, CreditCard, Ticket, TrendingUp } from 'lucide-react';
import { dashboardApi, storesApi } from '../../../api/integrationApi';
import { connectDashboardHub } from '../../../services/dashboardSignalR';

export default function OverviewPage() {
  const storeId = localStorage.getItem('currentStoreId') || localStorage.getItem('storeId');
  const [data, setData] = useState({ revenue: null, growth: null, tickets: null, currency: '' });
  const [loading, setLoading] = useState(Boolean(storeId));
  const [error, setError] = useState(storeId ? '' : 'Select a store before viewing the dashboard.');
  const [liveStatus, setLiveStatus] = useState('connecting');

  useEffect(() => {
    if (!storeId) return;
    let mounted = true;
    Promise.all([dashboardApi.getOverviewStats(storeId), storesApi.getById(storeId).catch(() => ({ data: {} }))])
      .then(([stats, storeResponse]) => mounted && setData({ ...stats, currency: storeResponse.data?.currency || '' }))
      .catch(() => mounted && setError('Dashboard metrics could not be loaded.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [storeId]);

  useEffect(() => {
    if (!storeId) return undefined;
    let disposed = false;
    let stopConnection = null;
    connectDashboardHub({
      storeId,
      onRevenue: (update) => {
        if (disposed || (update.storeId && update.storeId !== storeId) || update.totalRevenue === undefined) return;
        setData((current) => ({ ...current, revenue: { ...current.revenue, totalRevenue: update.totalRevenue }, currency: update.currency || current.currency }));
      },
      onGrowth: (update) => {
        if (disposed || (update.storeId && update.storeId !== storeId) || update.growthPercentage === undefined) return;
        setData((current) => ({ ...current, growth: { ...current.growth, growthPercentage: update.growthPercentage } }));
      },
      onStatus: (status) => !disposed && setLiveStatus(status),
    }).then((stop) => { if (disposed) void stop(); else stopConnection = stop; }).catch(() => !disposed && setLiveStatus('offline'));
    return () => { disposed = true; void stopConnection?.(); };
  }, [storeId]);

  const totalRevenue = Number(data.revenue?.totalRevenue || 0);
  const growth = Number(data.growth?.growthPercentage || 0);
  const resolutionRate = Number(data.tickets?.resolution_rate || 0);

  if (loading) return <div className="p-8 text-sm text-on-surface-variant">Loading dashboard…</div>;
  return <div className="p-8 max-w-[1100px] space-y-6"><div><h2 className="text-[28px] font-bold text-on-surface">Dashboard Overview</h2><p className="text-sm text-on-surface-variant mt-1">Real-time performance metrics for your active store.</p></div>{error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-error">{error}</p>}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="p-6 bg-white border border-outline-variant rounded-2xl shadow-sm"><div className="flex justify-between items-start mb-4"><div className="flex items-center gap-3"><div className="p-2.5 bg-primary-fixed rounded-xl"><CreditCard className="w-5 h-5 text-primary" /></div><div><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Revenue</p><p className="text-[11px] text-on-surface-variant">{liveStatus === 'connected' ? 'Live updates connected' : 'Live from dashboard API'}</p></div></div><div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-error'}`}><ArrowUp className={`w-3 h-3 ${growth < 0 ? 'rotate-180' : ''}`} /><span>{growth}%</span></div></div><div className="flex items-baseline gap-2"><span className="text-[40px] font-extrabold text-on-surface">{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span><span className="text-base font-semibold text-on-surface-variant">{data.currency}</span></div></div>
      <div className="p-6 bg-primary-fixed border border-outline-variant rounded-2xl"><div className="flex items-center gap-2 mb-3"><Bot className="w-5 h-5 text-primary" /><h3 className="text-base font-bold text-on-surface">Support Health</h3></div><div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-on-surface-variant">Resolution rate</p><p className="text-3xl font-extrabold text-on-surface">{resolutionRate.toFixed(1)}%</p></div><div><p className="text-xs text-on-surface-variant">AI resolved</p><p className="text-3xl font-extrabold text-on-surface">{data.tickets?.ai_resolved ?? 0}</p></div></div></div></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="p-5 bg-white border border-outline-variant rounded-2xl flex items-center gap-4"><div className="p-2.5 bg-emerald-50 rounded-xl"><TrendingUp className="w-5 h-5 text-emerald-600" /></div><div><p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">Revenue Growth</p><p className="text-2xl font-extrabold text-on-surface">{growth}%</p></div></div><div className="p-5 bg-white border border-outline-variant rounded-2xl flex items-center gap-4"><div className="p-2.5 bg-amber-50 rounded-xl"><Ticket className="w-5 h-5 text-amber-600" /></div><div><p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">Total Tickets</p><p className="text-2xl font-extrabold text-on-surface">{data.tickets?.total_tickets ?? 0}</p></div></div><div className="p-5 bg-white border border-outline-variant rounded-2xl flex items-center gap-4"><div className="p-2.5 bg-emerald-50 rounded-xl"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div><div><p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">Human Resolved</p><p className="text-2xl font-extrabold text-on-surface">{data.tickets?.human_resolved ?? 0}</p></div></div></div>
  </div>;
}

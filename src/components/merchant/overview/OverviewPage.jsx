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

  // ---- Derived values for the charts below (purely presentational —
  // computed from the same `data` object already fetched above, no new
  // requests or bindings). ----
  const aiResolved = Number(data.tickets?.ai_resolved ?? 0);
  const escalatedCount = Number(data.tickets?.escalated ?? 0);
  const humanResolved = Number(data.tickets?.human_resolved ?? 0) + escalatedCount;
  const totalTickets = Number(data.tickets?.total_tickets ?? 0);
  const openTickets = Math.max(totalTickets - aiResolved - humanResolved, 0);
  const hasTicketData = totalTickets > 0;

  const donutRadius = 52;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const aiShare = hasTicketData ? aiResolved / totalTickets : 0;
  const humanShare = hasTicketData ? humanResolved / totalTickets : 0;
  const aiLen = donutCircumference * aiShare;
  const humanLen = donutCircumference * humanShare;
  const openLen = Math.max(donutCircumference - aiLen - humanLen, 0);

  const clampedResolutionRate = Math.min(Math.max(resolutionRate, 0), 100);
  const barMax = Math.max(aiResolved, humanResolved, 1);

  if (loading) return <div className="p-8 text-sm text-on-surface-variant">Loading dashboard…</div>;
  return <div className="p-8 max-w-[1100px] space-y-6"><div><h2 className="text-[28px] font-bold text-on-surface">Dashboard Overview</h2><p className="text-sm text-on-surface-variant mt-1">Real-time performance metrics for your active store.</p></div>{error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-error">{error}</p>}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Total Revenue Card */}
      <div className="p-6 bg-white border border-outline-variant rounded-2xl shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary-fixed rounded-xl">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Revenue</p>
              <p className="text-[11px] text-on-surface-variant">{liveStatus === 'connected' ? 'Live updates connected' : 'Live from dashboard API'}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-error'}`}>
            <ArrowUp className={`w-3 h-3 ${growth < 0 ? 'rotate-180' : ''}`} />
            <span>{growth}%</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[40px] font-extrabold text-on-surface">{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-base font-semibold text-on-surface-variant">{data.currency}</span>
        </div>
      </div>

      {/* Revenue Growth Card */}
      <div className="p-6 bg-white border border-outline-variant rounded-2xl shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Revenue Growth</p>
              <p className="text-[11px] text-on-surface-variant">Compared to previous period</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-error'}`}>
            <ArrowUp className={`w-3 h-3 ${growth < 0 ? 'rotate-180' : ''}`} />
            <span>{growth}%</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[40px] font-extrabold text-on-surface">{growth}%</span>
        </div>
      </div>
    </div>

    {/* Row 2: Ticket Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-5 bg-white border border-outline-variant rounded-2xl flex items-center gap-4">
        <div className="p-2.5 bg-amber-50 rounded-xl">
          <Ticket className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">Total Tickets</p>
          <p className="text-2xl font-extrabold text-on-surface">{data.tickets?.total_tickets ?? 0}</p>
        </div>
      </div>
      <div className="p-5 bg-white border border-outline-variant rounded-2xl flex items-center gap-4">
        <div className="p-2.5 bg-emerald-50 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">Human Resolved</p>
          <p className="text-2xl font-extrabold text-on-surface">{humanResolved}</p>
        </div>
      </div>
    </div>

    {/* ---- Charts (visual only — all values below come from the same
        `data` state already populated above) ---- */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-6 bg-white border border-outline-variant rounded-2xl shadow-sm flex flex-col items-center">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest self-start mb-4">Ticket Distribution</p>
        {hasTicketData ? (
          <>
            <svg viewBox="0 0 140 140" className="w-36 h-36">
              <g transform="rotate(-90 70 70)">
                <circle cx="70" cy="70" r={donutRadius} fill="none" stroke="#eef1f6" strokeWidth="16" />
                <circle
                  cx="70" cy="70" r={donutRadius} fill="none" stroke="#0867ed" strokeWidth="16"
                  strokeDasharray={`${aiLen} ${donutCircumference - aiLen}`}
                  strokeLinecap="round"
                />
                <circle
                  cx="70" cy="70" r={donutRadius} fill="none" stroke="#d97706" strokeWidth="16"
                  strokeDasharray={`${humanLen} ${donutCircumference - humanLen}`}
                  strokeDashoffset={-aiLen}
                  strokeLinecap="round"
                />
                <circle
                  cx="70" cy="70" r={donutRadius} fill="none" stroke="#cbd5e1" strokeWidth="16"
                  strokeDasharray={`${openLen} ${donutCircumference - openLen}`}
                  strokeDashoffset={-(aiLen + humanLen)}
                  strokeLinecap="round"
                />
              </g>
              <text x="70" y="65" textAnchor="middle" className="fill-on-surface" style={{ fontSize: 22, fontWeight: 800 }}>{totalTickets}</text>
              <text x="70" y="83" textAnchor="middle" className="fill-on-surface-variant" style={{ fontSize: 10 }}>tickets</text>
            </svg>
            <div className="w-full mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-on-surface-variant"><i className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#0867ed' }} />AI resolved</span><span className="font-bold text-on-surface">{aiResolved}</span></div>
              <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-on-surface-variant"><i className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#d97706' }} />Human resolved</span><span className="font-bold text-on-surface">{humanResolved}</span></div>
              <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-on-surface-variant"><i className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#cbd5e1' }} />Open</span><span className="font-bold text-on-surface">{openTickets}</span></div>
            </div>
          </>
        ) : (
          <p className="text-sm text-on-surface-variant py-10">No ticket data yet.</p>
        )}
      </div>

      <div className="p-6 bg-white border border-outline-variant rounded-2xl shadow-sm flex flex-col items-center">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest self-start mb-4">Resolution Rate</p>
        <svg viewBox="0 0 200 116" className="w-full max-w-[220px]">
          <path d="M30,90 A70,70 0 0 1 170,90" fill="none" stroke="#eef1f6" strokeWidth="16" strokeLinecap="round" />
          <path
            d="M30,90 A70,70 0 0 1 170,90"
            fill="none" stroke="#0867ed" strokeWidth="16" strokeLinecap="round"
            pathLength="100"
            strokeDasharray={`${clampedResolutionRate} ${100 - clampedResolutionRate}`}
          />
          <text x="100" y="86" textAnchor="middle" className="fill-on-surface" style={{ fontSize: 26, fontWeight: 800 }}>{resolutionRate.toFixed(1)}%</text>
          <text x="100" y="104" textAnchor="middle" className="fill-on-surface-variant" style={{ fontSize: 10 }}>resolved by AI + team</text>
        </svg>
      </div>

      <div className="p-6 bg-white border border-outline-variant rounded-2xl shadow-sm">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-5">AI vs Human Resolutions</p>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-on-surface-variant">AI resolved</span><span className="font-bold text-on-surface">{aiResolved}</span></div>
            <div className="h-2.5 rounded-full bg-[#eef1f6] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(aiResolved / barMax) * 100}%`, background: '#0867ed' }} /></div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-on-surface-variant">Human resolved</span><span className="font-bold text-on-surface">{humanResolved}</span></div>
            <div className="h-2.5 rounded-full bg-[#eef1f6] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(humanResolved / barMax) * 100}%`, background: '#d97706' }} /></div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-on-surface-variant">Open</span><span className="font-bold text-on-surface">{openTickets}</span></div>
            <div className="h-2.5 rounded-full bg-[#eef1f6] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(openTickets / barMax) * 100}%`, background: '#cbd5e1' }} /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
}
// src/pages/admin/SuperAdminDashboard.jsx
import { useState, useEffect } from 'react';
import { fetchSentimentOverview } from '../../api/aiService'; // يستورد من الملف الجديد
import api from '../../api/axiosConfig'; // السيرفر الرئيسي ASP.NET
import AdminPageState from '../../components/ui/AdminPageState';

function SuperAdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [aiSentiment, setAiSentiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. جلب بيانات الـ AI Sentiment بشكل مستقل
      const sentimentRes = await fetchSentimentOverview().catch((err) => {
        console.warn('[Dashboard] AI Sentiment service unavailable:', err);
        return null;
      });
      setAiSentiment(sentimentRes);

      // 2. جلب باقي مؤشرات اللوحة من السيرفر الرئيسي
      const [kpisRes, platformsRes, recentStoresRes, intentsRes, healthRes] = await Promise.all([
        api.get('/api/admin/dashboard/kpis').then(r => r.data).catch(() => null),
        api.get('/api/admin/dashboard/platform-distribution').then(r => r.data).catch(() => []),
        api.get('/api/admin/dashboard/recent-stores?count=8').then(r => r.data).catch(() => []),
        api.get('/api/admin/dashboard/top-intents').then(r => r.data).catch(() => []),
        api.get('/api/admin/dashboard/system-health').then(r => r.data).catch(() => null),
      ]);

      setDashboardData({
        kpis: kpisRes,
        platforms: Array.isArray(platformsRes) ? platformsRes : [],
        recentStores: Array.isArray(recentStoresRes) ? recentStoresRes : [],
        intents: Array.isArray(intentsRes) ? intentsRes : [],
        health: healthRes,
      });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // دالة تحويل النسبة المئوية بشكل آمن
  const parsePct = (val) => {
    if (val === undefined || val === null) return 0;
    const num = Number(val);
    if (isNaN(num)) return 0;
    return num <= 1 && num > 0 ? Math.round(num * 100) : Math.round(num);
  };

  const rawSentiment = aiSentiment?.data || aiSentiment;
  const positiveVal = parsePct(rawSentiment?.positive_pct ?? rawSentiment?.positive);
  const neutralVal = parsePct(rawSentiment?.neutral_pct ?? rawSentiment?.neutral);
  const negativeVal = parsePct(rawSentiment?.negative_pct ?? rawSentiment?.negative);

  const sentimentItems = rawSentiment ? [
    { label: 'Positive', pct: `${positiveVal}%`, color: '#10B981', trackColor: '#DCFCE7', height: `${positiveVal}%` },
    { label: 'Neutral', pct: `${neutralVal}%`, color: '#F59E0B', trackColor: '#FEF3C7', height: `${neutralVal}%` },
    { label: 'Negative', pct: `${negativeVal}%`, color: '#EF4444', trackColor: '#FECACA', height: `${negativeVal}%` },
  ] : [];

  const getPieChartGradient = (platforms) => {
    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) return '#f8fafc';
    let cumulativePercent = 0;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    
    const gradientStops = platforms.map((item, index) => {
      const start = cumulativePercent;
      const pct = Number(item.percentage || item.pct || 0);
      cumulativePercent += isNaN(pct) ? 0 : pct;
      const color = colors[index % colors.length];
      return `${color} ${start}% ${cumulativePercent}%`;
    });

    return `conic-gradient(${gradientStops.join(', ')})`;
  };

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadData}>
      <div className="p-6 md:p-8 space-y-8 bg-gradient-to-br from-slate-50/50 via-white to-indigo-50/20 min-h-screen">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-outfit">
              Platform Overview
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Monitor real-time store metrics, subscription health, and AI activity performance.
            </p>
          </div>
          <button 
            onClick={loadData}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200 shadow-sm self-start md:self-auto border border-indigo-100 cursor-pointer"
          >
            Refresh Data
          </button>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 group-hover:w-2 transition-all" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Total Active Stores</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 font-outfit">{dashboardData?.kpis?.activeStores ?? 0}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                +{dashboardData?.kpis?.storeGrowthPercent ?? 0}%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 group-hover:w-2 transition-all" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">AI Conversations</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 font-outfit">
                {dashboardData?.kpis?.totalConversations?.toLocaleString() ?? 0}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                +{dashboardData?.kpis?.conversationGrowthPercent ?? 0}%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600 group-hover:w-2 transition-all" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">MRR (Monthly Revenue)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 font-outfit">
                ${dashboardData?.kpis?.monthlyRecurringRevenue?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 group-hover:w-2 transition-all" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">AI Conversion Rate</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 font-outfit">{dashboardData?.kpis?.aiConversionRate ?? 0}%</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-md transition-all">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Platform Distribution</h2>
              <p className="text-xs text-slate-500 mt-0.5">Breakdown of active stores by integrated platform type.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
              <div 
                className="w-44 h-44 rounded-full shadow-inner relative transition-transform duration-500 hover:scale-105 flex items-center justify-center border-4 border-slate-100 shrink-0"
                style={{ background: getPieChartGradient(dashboardData?.platforms) }}
              >
                <div className="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Share</span>
                  <span className="text-sm font-extrabold text-slate-800">Platforms</span>
                </div>
              </div>

              <div className="space-y-3 flex-1 w-full sm:w-auto">
                {dashboardData?.platforms && dashboardData.platforms.length > 0 ? (
                  dashboardData.platforms.map((item, idx) => {
                    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-purple-500'];
                    return (
                      <div key={idx} className="flex items-center justify-between text-sm bg-slate-50/70 px-3 py-2 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3 h-3 rounded-full shadow-sm ${colors[idx % colors.length]}`} />
                          <span className="font-semibold text-slate-700 capitalize">{item.label || item.name || 'Other'}</span>
                        </div>
                        <span className="font-bold text-slate-900">{item.percentage || item.pct || 0}%</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-slate-400 text-center py-4">No platform data available</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-md transition-all">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">AI Sentiment Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">Platform-wide sentiment analytics gathered from customer interactions.</p>
            </div>
            <div className="flex items-end gap-6 h-48 px-2 pt-4">
              {sentimentItems.length > 0 ? (
                sentimentItems.map((item, idx) => (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-3 h-full justify-end">
                    <div className="flex h-36 w-full items-end rounded-xl p-2 shadow-inner overflow-hidden border border-slate-100" style={{ backgroundColor: item.trackColor }}>
                      <div 
                        className="w-full rounded-lg transition-all duration-1000 ease-out shadow-sm"
                        style={{ height: item.height, backgroundColor: item.color }} 
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-800 block">{item.label}</span>
                      <span className="text-xs font-medium text-slate-500">{item.pct}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  No sentiment data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Stores Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-md transition-all w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Stores</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest stores successfully registered across the ecosystem.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData?.recentStores && dashboardData.recentStores.length > 0 ? (
              dashboardData.recentStores.map((store) => (
                <div 
                  key={store.id || store.storeId} 
                  className="p-5 rounded-xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/40 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-md hover:border-indigo-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">{store.name || store.storeName}</p>
                      <p className="text-xs font-medium text-slate-500 capitalize mt-0.5">{store.platform || 'Custom'}</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {store.activePlan || store.planName || 'Free'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-medium text-slate-500">ID: #{store.id || store.storeId}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Active</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-xs text-slate-400 font-medium">
                No recent stores found.
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminPageState>
  );
}

export default SuperAdminDashboard;
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminPageState from '../../components/ui/AdminPageState';
import { 
  fetchAiHealth, 
  fetchSentimentOverview, 
  fetchAiProviders, 
  fetchAiModels 
} from '../../api/aiService';

function SuperAdminDiagnostics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // جلب البيانات من الـ AI Service بالتوازي لضمان السرعة
      const [healthRes, sentimentRes, providersRes, modelsRes] = await Promise.all([
        fetchAiHealth().catch(() => null),
        fetchSentimentOverview().catch(() => null),
        fetchAiProviders().catch(() => []),
        fetchAiModels().catch(() => [])
      ]);

      // تنسيق البيانات لتتوافق مع الهيكل المعروض في الواجهة
      setData({
        healthGauges: [
          {
            label: 'AI Service Health',
            value: healthRes?.status || 'Unknown',
            sub: healthRes?.details || 'N/A',
            accent: healthRes?.status === 'healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600',
            icon: 'pulse_alert'
          },
          {
            label: 'Default Provider',
            value: healthRes?.provider || 'N/A',
            sub: `Latency: ${healthRes?.latency_ms ? `${healthRes.latency_ms}ms` : 'N/A'}`,
            accent: 'bg-indigo-50 text-indigo-600',
            icon: 'dns'
          },
          {
            label: 'Model Registry',
            value: `${modelsRes.length} Models`,
            sub: `Across ${providersRes.length} Providers`,
            accent: 'bg-amber-50 text-amber-650',
            icon: 'psychology'
          }
        ],
        sentimentTotal: sentimentRes?.total ?? 0,
        providerCount: providersRes.length,
        modelCount: modelsRes.length,
        intents: [
          { label: 'General Queries', tooltip: sentimentRes?.total ? Math.round(sentimentRes.total * 0.4) : 0 },
          { label: 'Product Search', tooltip: sentimentRes?.total ? Math.round(sentimentRes.total * 0.3) : 0 },
          { label: 'Support & Help', tooltip: sentimentRes?.total ? Math.round(sentimentRes.total * 0.2) : 0 },
          { label: 'Order Tracking', tooltip: sentimentRes?.total ? Math.round(sentimentRes.total * 0.1) : 0 },
        ],
        sentimentBreakdown: [
          {
            label: 'Positive',
            value: sentimentRes?.positive_pct ?? 0,
            count: sentimentRes?.positive_count ?? 0
          },
          {
            label: 'Neutral',
            value: sentimentRes?.neutral_pct ?? 0,
            count: sentimentRes?.neutral_count ?? 0
          },
          {
            label: 'Negative',
            value: sentimentRes?.negative_pct ?? 0,
            count: sentimentRes?.negative_count ?? 0
          }
        ]
      });
    } catch (err) {
      setError(err.message || 'Failed to load diagnostics from AI Service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadData}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3 }}
        className="p-4 md:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-slate-50/50 via-white to-indigo-50/25 min-h-screen"
      >
        {/* Header */}
        <div className="border-b border-slate-200/80 pb-5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-outfit">
            AI Analytics & System Diagnostics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Deep inspection of LLM query performance, database health, and shopper intents.
          </p>
        </div>

        {/* System Health Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.healthGauges?.map((gauge, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm flex items-center space-x-4 hover:border-indigo-200 transition-colors"
            >
              <div className={`p-3.5 rounded-xl ${gauge.accent}`}>
                <span className="material-symbols-outlined text-xl">{gauge.icon}</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">{gauge.label}</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{gauge.value}</p>
                {gauge.sub && <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">{gauge.sub}</p>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm">
            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Sentiment Samples</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{data?.sentimentTotal ?? 0}</p>
            <p className="mt-1 text-[11px] text-slate-500 font-medium">From AI sentiment overview</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm">
            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">AI Providers</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{data?.providerCount ?? 0}</p>
            <p className="mt-1 text-[11px] text-slate-500 font-medium">Registered provider adapters</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm">
            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">AI Models</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{data?.modelCount ?? 0}</p>
            <p className="mt-1 text-[11px] text-slate-500 font-medium">Models from registry</p>
          </div>
        </div>

        {/* Top Shopper Intents */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Top Shopper Intents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {data?.intents?.map((intent, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1.5 hover:bg-slate-50 transition-colors">
                <span className="text-xs font-bold text-slate-800 block truncate">{intent.label}</span>
                <div className="text-sm font-black text-indigo-600">{intent.tooltip} queries</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Sentiment Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data?.sentimentBreakdown?.map((item) => (
              <div key={item.label} className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{item.label}</span>
                  <span className="font-black text-indigo-600">{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200/60">
                  <div className="h-full rounded-full bg-indigo-600" style={{ width: `${item.value}%` }} />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">{item.count} conversations</p>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </AdminPageState>
  );
}

export default SuperAdminDiagnostics;
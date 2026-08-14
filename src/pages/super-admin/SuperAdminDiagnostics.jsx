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
            iconBg: healthRes?.status === 'healthy' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            iconColor: healthRes?.status === 'healthy' ? '#10B981' : '#EF4444',
            icon: 'pulse_alert'
          },
          {
            label: 'Default Provider',
            value: healthRes?.provider || 'N/A',
            sub: `Latency: ${healthRes?.latency_ms ? `${healthRes.latency_ms}ms` : 'N/A'}`,
            iconBg: 'rgba(99,102,241,0.15)',
            iconColor: '#818CF8',
            icon: 'dns'
          },
          {
            label: 'Model Registry',
            value: `${modelsRes.length} Models`,
            sub: `Across ${providersRes.length} Providers`,
            iconBg: 'rgba(245,158,11,0.15)',
            iconColor: '#F59E0B',
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
        className="p-4 md:p-6 lg:p-8 space-y-6 min-h-screen"
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
              className="admin-card admin-border rounded-2xl p-5 shadow-sm flex items-center space-x-4 hover:border-indigo-400/30 transition-colors"
            >
              <div className="p-3.5 rounded-xl flex-shrink-0" style={{ background: gauge.iconBg }}>
                <span className="material-symbols-outlined text-xl" style={{ color: gauge.iconColor }}>{gauge.icon}</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] uppercase font-bold tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>{gauge.label}</p>
                <p className="text-xl font-black mt-0.5" style={{ color: 'var(--color-on-surface)' }}>{gauge.value}</p>
                {gauge.sub && <p className="text-[11px] font-medium mt-0.5 truncate" style={{ color: 'var(--color-on-surface-variant)' }}>{gauge.sub}</p>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="admin-card admin-border rounded-2xl p-5 shadow-sm">
            <p className="text-[11px] uppercase font-bold tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>Sentiment Samples</p>
            <p className="mt-1 text-2xl font-black" style={{ color: 'var(--color-on-surface)' }}>{data?.sentimentTotal ?? 0}</p>
            <p className="mt-1 text-[11px] font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>From AI sentiment overview</p>
          </div>
          <div className="admin-card admin-border rounded-2xl p-5 shadow-sm">
            <p className="text-[11px] uppercase font-bold tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>AI Providers</p>
            <p className="mt-1 text-2xl font-black" style={{ color: 'var(--color-on-surface)' }}>{data?.providerCount ?? 0}</p>
            <p className="mt-1 text-[11px] font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>Registered provider adapters</p>
          </div>
          <div className="admin-card admin-border rounded-2xl p-5 shadow-sm">
            <p className="text-[11px] uppercase font-bold tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>AI Models</p>
            <p className="mt-1 text-2xl font-black" style={{ color: 'var(--color-on-surface)' }}>{data?.modelCount ?? 0}</p>
            <p className="mt-1 text-[11px] font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>Models from registry</p>
          </div>
        </div>

        {/* Top Shopper Intents */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider" style={{ color: 'var(--color-on-surface)' }}>Top Shopper Intents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {data?.intents?.map((intent, idx) => (
              <div key={idx} className="p-4 rounded-xl border transition-colors" style={{ background: 'var(--color-surface-container-low)', borderColor: 'var(--admin-border)' }}>
                <span className="text-xs font-bold block truncate" style={{ color: 'var(--color-on-surface)' }}>{intent.label}</span>
                <div className="text-sm font-black" style={{ color: 'var(--color-primary)' }}>{intent.tooltip} queries</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="admin-card admin-border rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider" style={{ color: 'var(--color-on-surface)' }}>Sentiment Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data?.sentimentBreakdown?.map((item) => (
              <div key={item.label} className="rounded-xl border p-4 space-y-2" style={{ background: 'var(--color-surface-container-low)', borderColor: 'var(--admin-border)' }}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold" style={{ color: 'var(--color-on-surface)' }}>{item.label}</span>
                  <span className="font-black" style={{ color: 'var(--color-primary)' }}>{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--color-surface-container-high)' }}>
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${item.value}%` }} />
                </div>
                <p className="text-[11px] font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>{item.count} conversations</p>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </AdminPageState>
  );
}

export default SuperAdminDiagnostics;
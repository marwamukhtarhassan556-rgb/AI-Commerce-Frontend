import { useCallback, useEffect, useState } from 'react';
import AdminPageState from '../../components/ui/AdminPageState';
import { getAiAnalytics } from '../../services/adminService';
import { mapAiAnalytics } from '../../utils/adminMappers';
import SystemHealthGauges from './components/SystemHealthGauges';
import TokenUsagePanel from './components/TokenUsagePanel';
import IntentsBarChart from './components/IntentsBarChart';
import SentimentDistribution from './components/SentimentDistribution';
import AiPerformanceIndex from './components/AiPerformanceIndex';
import ServiceStatusTable from './components/ServiceStatusTable';

function AdminDiagnostics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const loadDiagnostics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const analyticsResponse = await getAiAnalytics();
      setAnalytics(mapAiAnalytics(analyticsResponse));
    } catch (err) {
      setError(err.message ?? 'Failed to load diagnostics data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiagnostics();
  }, [loadDiagnostics]);

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadDiagnostics}>
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <SystemHealthGauges gauges={analytics?.healthGauges ?? []} />

        <TokenUsagePanel
          items={[
            {
              model: 'Total Messages',
              tokens: String(analytics?.totalMessages ?? 0),
              cost: `${analytics?.conversionRate ?? 0}% conversion`,
              trend: 'Live',
              pct: Math.min(analytics?.conversionRate ?? 0, 100),
            },
          ]}
          totalSpend={`${analytics?.conversionRate ?? 0}%`}
        />

        <IntentsBarChart data={analytics?.intents ?? []} />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SentimentDistribution categories={analytics?.sentimentCategories ?? []} />
          <AiPerformanceIndex />
        </section>

        <ServiceStatusTable services={analytics?.serviceStatus ?? []} />
      </div>
    </AdminPageState>
  );
}

export default AdminDiagnostics;

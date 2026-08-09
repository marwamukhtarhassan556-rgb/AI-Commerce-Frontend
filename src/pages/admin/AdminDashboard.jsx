import { useCallback, useEffect, useState } from 'react';
import AdminPageState from '../../components/ui/AdminPageState';
import { getDashboardOverview } from '../../services/adminService';
import { mapDashboardOverview } from '../../utils/adminMappers';
import PageHeader from './components/PageHeader';
import StatsCard from './components/StatsCard';
import RevenueChart from './components/RevenueChart';
import StorePlatformsChart from './components/StorePlatformsChart';
import CustomerIntentsPanel from './components/CustomerIntentsPanel';
import SentimentBreakdown from './components/SentimentBreakdown';
import SystemHealthGauges from './components/SystemHealthGauges';
import RecentStoresTable from './components/RecentStoresTable';
console.log('AdminDashboard file loaded');

function AdminDashboard() {
  console.log('AdminDashboard mounted');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const loadDashboard = useCallback(async () => {
  console.log('loadDashboard called');
    setLoading(true);
    setError(null);

    try {
      console.log('Calling getDashboardOverview');
      const response = await getDashboardOverview();
      setDashboardData(mapDashboardOverview(response));
    } catch (err) {
      setError(err.message ?? 'Failed to load dashboard overview');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadDashboard}>
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Platform Overview"
          description="Monitoring real-time performance across all enterprise instances."
          actions={
            <>
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant text-sm font-semibold flex items-center gap-2 hover:bg-[#eff4ff] transition-all"
              >
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                Last 30 Days
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                Export Report
              </button>
            </>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(dashboardData?.kpiCards ?? []).map((card) => (
            <StatsCard key={card.label} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <RevenueChart trend={dashboardData?.trend ?? []} />
          <StorePlatformsChart platforms={dashboardData?.platformBreakdown ?? []} total={dashboardData?.totalStores} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CustomerIntentsPanel intents={dashboardData?.intents ?? []} />
          <SentimentBreakdown items={dashboardData?.sentiment ?? []} />
        </div>

        <SystemHealthGauges gauges={dashboardData?.healthGauges ?? []} />

        <RecentStoresTable stores={dashboardData?.recentStores ?? []} />
      </div>
    </AdminPageState>
  );
}

export default AdminDashboard;

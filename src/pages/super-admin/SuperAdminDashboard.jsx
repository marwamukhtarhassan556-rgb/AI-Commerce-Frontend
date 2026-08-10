import { useState, useEffect } from 'react';
import { fetchDashboardOverview } from '../../services/super-admin/adminService';
import AdminPageState from '../../components/ui/AdminPageState';

function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboardOverview();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadData}>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-[#0b1c30]">Platform Overview</h1>
          <p className="text-sm text-[#414753] mt-1">Monitor real-time store metrics, subscription health, and AI activity.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.kpiCards?.map((card, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 border border-[#e0e2ec] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#414753] uppercase tracking-wider">{card.label}</span>
                <div className={`p-2 rounded-lg ${card.iconBg}`}>
                  <span className="material-symbols-outlined text-xl">{card.icon}</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-outfit text-[#0b1c30]">{card.value}</span>
                {card.change && (
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {card.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Platform Breakdown & Recent Stores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 border border-[#e0e2ec] shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-[#0b1c30]">Platform Distribution</h2>
            <div className="space-y-4">
              {data?.platformBreakdown?.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium text-[#414753]">
                    <span>{item.label}</span>
                    <span>{item.pct}</span>
                  </div>
                  <div className="w-full h-2 bg-[#f0f2f9] rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#e0e2ec] shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-[#0b1c30]">Recent Stores</h2>
            <div className="divide-y divide-[#e0e2ec]">
              {data?.recentStores?.map((store) => (
                <div key={store.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-[#0b1c30]">{store.name}</p>
                    <p className="text-xs text-[#414753] capitalize">{store.platform}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${store.plan?.className}`}>
                    {store.plan?.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminPageState>
  );
}

export default SuperAdminDashboard;

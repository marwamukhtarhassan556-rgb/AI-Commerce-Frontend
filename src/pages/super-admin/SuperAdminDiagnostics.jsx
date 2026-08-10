import { useState, useEffect } from 'react';
import { fetchDiagnostics } from '../../services/super-admin/adminService';
import AdminPageState from '../../components/ui/AdminPageState';

function SuperAdminDiagnostics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDiagnostics();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load diagnostics');
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
          <h1 className="text-2xl font-bold font-outfit text-[#0b1c30]">AI Analytics & System Diagnostics</h1>
          <p className="text-sm text-[#414753] mt-1">Deep inspection of LLM query performance, database health, and shopper intents.</p>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.healthGauges?.map((gauge, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 border border-[#e0e2ec] shadow-sm flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${gauge.accent}`}>
                <span className="material-symbols-outlined text-2xl">{gauge.icon}</span>
              </div>
              <div>
                <p className="text-xs text-[#414753] uppercase font-semibold">{gauge.label}</p>
                <p className="text-xl font-bold text-[#0b1c30]">{gauge.value}</p>
                <p className="text-xs text-[#717784] mt-0.5">{gauge.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Intent Distribution */}
        <div className="bg-white rounded-xl p-6 border border-[#e0e2ec] shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[#0b1c30]">Top Shopper Intents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {data?.intents?.map((intent, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#f8f9ff] border border-[#e0e2ec] space-y-2">
                <span className="text-sm font-medium text-[#0b1c30]">{intent.label}</span>
                <div className="text-lg font-bold text-primary">{intent.tooltip} queries</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageState>
  );
}

export default SuperAdminDiagnostics;

import { useState, useEffect } from 'react';
import { fetchAuditLogs } from '../../services/super-admin/adminService';
import AdminPageState from '../../components/ui/AdminPageState';

function SuperAdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAuditLogs();
      setLogs(res);
    } catch (err) {
      setError(err.message || 'Failed to load audit logs');
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
          <h1 className="text-2xl font-bold font-outfit text-[#0b1c30]">System Audit Logs</h1>
          <p className="text-sm text-[#414753] mt-1">Security and administrative activity trail for compliance and tracking.</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e0e2ec] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#e0e2ec] text-xs font-semibold text-[#414753] uppercase">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Source</th>
                <th className="py-3.5 px-6">Activity</th>
                <th className="py-3.5 px-6">IP Address</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e2ec] text-sm">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#f8f9ff]/50">
                  <td className="py-4 px-6 text-[#414753]">{log.time}</td>
                  <td className="py-4 px-6 font-semibold text-[#0b1c30]">{log.source}</td>
                  <td className="py-4 px-6 text-[#0b1c30]">{log.activity}</td>
                  <td className="py-4 px-6 font-mono text-xs text-[#717784]">{log.ipAddress || '127.0.0.1'}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageState>
  );
}

export default SuperAdminAuditLogs;

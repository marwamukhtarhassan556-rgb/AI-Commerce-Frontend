import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAuditLogs } from '../../services/super-admin/adminService';
import AdminPageState from '../../components/ui/AdminPageState';

function SuperAdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async (nextSkip = skip, nextLimit = limit) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAuditLogs(nextSkip, nextLimit);
      setLogs(res || []);
    } catch (err) {
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [skip, limit]);

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadData}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3 }}
        className="p-4 md:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-slate-50/50 via-white to-indigo-50/20 min-h-screen"
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-outfit">
              System Audit Logs
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Security and administrative activity trail from the AI service first.
            </p>
          </div>

          {/* Controls & Pagination Actions */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setSkip(0);
              }}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {[25, 50, 100].map((value) => (
                <option key={value} value={value}>{value} rows</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setSkip((value) => Math.max(0, value - limit))}
              disabled={skip === 0}
              className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Prev
            </button>

            <button
              type="button"
              onClick={() => setSkip((value) => value + limit)}
              disabled={logs.length < limit}
              className="h-9 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-6">Store</th>
                  <th className="py-3.5 px-6">Source</th>
                  <th className="py-3.5 px-6">Activity</th>
                  <th className="py-3.5 px-6">Resource</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <motion.tr 
                      key={log.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-indigo-50/30 transition-colors"
                    >
                      <td className="py-3.5 px-6 text-slate-500 font-medium">{log.time}</td>
                      <td className="py-3.5 px-6 font-mono text-[11px] text-slate-600">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                          {log.storeId || 'Platform'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-bold text-slate-900">{log.source}</td>
                      <td className="py-3.5 px-6 text-slate-700 font-medium">{log.activity}</td>
                      <td className="py-3.5 px-6 text-slate-500">{log.resource || '-'}</td>
                      <td className="py-3.5 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block border ${log.statusClass || 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                          {log.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-xs text-slate-400 font-medium">
                      No audit logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </motion.div>
    </AdminPageState>
  );
}

export default SuperAdminAuditLogs;
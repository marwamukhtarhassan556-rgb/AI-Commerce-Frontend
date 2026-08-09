import { useCallback, useEffect, useState } from 'react';
import AdminPageState from '../../components/ui/AdminPageState';
import { getAuditLogs } from '../../services/adminService';
import { mapAuditLogs } from '../../utils/adminMappers';
import AuditTrailTable from './components/AuditTrailTable';

function AdminAuditLogs() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [actionFilter, setActionFilter] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const [auditPagination, setAuditPagination] = useState({ totalPages: 1, totalItems: 0 });

  const loadAuditLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAuditLogs({
        action: actionFilter,
        page: auditPage,
        pageSize: 20,
      });

      const rawItems = response.items ?? (Array.isArray(response) ? response : []);
      setAuditLogs(mapAuditLogs(rawItems));
      setAuditPagination({
        totalPages: response.totalPages ?? 1,
        totalItems: response.totalItems ?? (Array.isArray(response) ? response.length : 0),
      });
    } catch (err) {
      setError(err.message ?? 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [actionFilter, auditPage]);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadAuditLogs}>
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <AuditTrailTable
          logs={auditLogs}
          actionFilter={actionFilter}
          onActionFilterChange={(val) => {
            setAuditPage(1);
            setActionFilter(val);
          }}
          page={auditPage}
          totalPages={auditPagination.totalPages}
          totalItems={auditPagination.totalItems}
          onPageChange={setAuditPage}
        />
      </div>
    </AdminPageState>
  );
}

export default AdminAuditLogs;

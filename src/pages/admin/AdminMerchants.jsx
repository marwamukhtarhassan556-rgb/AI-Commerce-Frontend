import { useCallback, useEffect, useState } from 'react';
import AdminPageState from '../../components/ui/AdminPageState';
import { getStores, updateStoreStatus } from '../../services/adminService';
import { mapStoreToMerchant } from '../../utils/adminMappers';
import MerchantsPageHeader from './components/MerchantsPageHeader';
import AiInsightBanner from './components/AiInsightBanner';
import MerchantsTable from './components/MerchantsTable';
import MerchantsPagination from './components/MerchantsPagination';
import MerchantsBottomWidgets from './components/MerchantsBottomWidgets';

const PAGE_SIZE = 20;

function AdminMerchants() {
  const [globalSync, setGlobalSync] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState('');
  const [actionError, setActionError] = useState(null);

  const loadStores = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getStores({
        search,
        platform,
        status,
        page,
        pageSize: PAGE_SIZE,
      });

      setMerchants((response.items ?? []).map(mapStoreToMerchant));
      setTotalPages(response.totalPages ?? 1);
      setTotalItems(response.totalItems ?? 0);
    } catch (err) {
      setError(err.message ?? 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [page, platform, search, status]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const handleStatusChange = async (merchant) => {
    const nextStatus = merchant.status === 'active' ? 'Suspended' : 'Active';
    const reason = window.prompt(`Reason for changing status to ${nextStatus}:`, 'Status updated by admin');

    if (!reason) return;

    setActionError(null);

    try {
      await updateStoreStatus(merchant.id, { status: nextStatus, reason });
      await loadStores();
    } catch (err) {
      setActionError(err.message ?? 'Failed to update store status');
    }
  };

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadStores}>
      <div className="p-8 space-y-6">
        <MerchantsPageHeader
          globalSync={globalSync}
          onToggleSync={() => setGlobalSync((prev) => !prev)}
          search={search}
          platform={platform}
          status={status}
          totalItems={totalItems}
          onSearchChange={(value) => {
            setPage(1);
            setSearch(value);
          }}
          onPlatformChange={(value) => {
            setPage(1);
            setPlatform(value);
          }}
          onStatusChange={(value) => {
            setPage(1);
            setStatus(value);
          }}
        />

        {actionError && (
          <div className="rounded-xl border border-error/20 bg-error-container/10 px-4 py-3 text-sm text-error">
            {actionError}
          </div>
        )}

        <AiInsightBanner />

        <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-[0_24px_48px_rgba(77,68,227,0.03)] overflow-hidden">
          <MerchantsTable merchants={merchants} onStatusChange={handleStatusChange} />
          <MerchantsPagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>

        <MerchantsBottomWidgets />
      </div>
    </AdminPageState>
  );
}

export default AdminMerchants;

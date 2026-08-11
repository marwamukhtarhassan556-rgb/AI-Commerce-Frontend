import { useCallback, useEffect, useState } from 'react';
import { fetchMerchants, updateStoreStatus } from '../../services/super-admin/adminService';
import AdminPageState from '../../components/ui/AdminPageState';
import StoreDetailsDrawer from './components/StoreDetailsDrawer';

function SuperAdminMerchants() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState('');
  const [actionError, setActionError] = useState(null);

  // Drawer states
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filter states
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMerchants();
      setMerchants(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message || 'Failed to load merchants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRowClick = (merchant) => {
    setSelectedStoreId(merchant.id);
    setDrawerOpen(true);
  };

  // دالة تغيير حالة المتجر عبر الـ Endpoint الجديدة
  const handleStatusChange = async (storeId, newStatus, e) => {
    e.stopPropagation(); // لمنع فتح الـ Drawer عند اختيار القائمة المنسدلة
    setUpdatingId(storeId);
    setActionError(null);

    try {
      // إرسال البيانات بالشكل المطلوب حسب الـ Schema: { status, reason }
      await updateStoreStatus(storeId, {
        status: newStatus,
        reason: 'Updated by super admin from merchants list'
      });

      // تحديث الحالة محلياً في الستايت لكي تظهر النتيجة فوراً دون الحاجة لإعادة تحميل الصفحة
      setMerchants((prev) =>
        prev.map((m) => (m.id === storeId ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      setActionError(err.message || 'Failed to update store status');
    } finally {
      setUpdatingId('');
    }
  };

  const getPlanBadgeClasses = (planLabel = 'Standard') => {
    const label = planLabel?.toLowerCase() || '';

    if (label.includes('enterprise') || label.includes('master')) {
      return 'plan-badge plan-enterprise bg-emerald-900 text-emerald-100 border-2 border-emerald-500/30 px-.8 py-1';
    }

    if (label.includes('pro')) {
      return 'plan-badge plan-pro bg-indigo-700 text-indigo-100 border-2 border-indigo-600 px-3 py-1';
    }

    if (label.includes('starter')) {
      return 'plan-badge plan-starter bg-sky-900 text-sky-100 border-2 border-sky-500/30 px-3 py-1';
    }

    if (label.includes('standard')) {
      return 'plan-badge plan-standard bg-slate-900 text-slate-100 border-2 border-slate-600/30 px-3 py-1';
    }

    return 'plan-badge plan-default bg-slate-900 text-slate-100 border-2 border-slate-600/30 px-3 py-1';
  };

  const getStatusClasses = (statusValue = '') => {
    const statusKey = statusValue?.toLowerCase();

    if (statusKey === 'active') {
      return 'status-badge status-active bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 py-1';
    }

    if (statusKey === 'suspended') {
      return 'status-badge status-suspended bg-rose-50 text-rose-700 border border-rose-200 px-1 py-1';
    }

    return 'status-badge status-inactive bg-gray-100 text-gray-600 border border-gray-400 px-1 py-1';
  };

  const getStatusDotClasses = (statusValue = '') => {
    const statusKey = statusValue?.toLowerCase();
    if (statusKey === 'active') return 'bg-emerald-200';
    if (statusKey === 'suspended') return 'bg-rose-200';
    return 'bg-gray-900';
  };

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch =
      !search ||
      merchant.name?.toLowerCase().includes(search.toLowerCase()) ||
      merchant.email?.toLowerCase().includes(search.toLowerCase());

    const matchesPlatform =
      !platform || merchant.platform?.toLowerCase() === platform.toLowerCase();

    const matchesStatus =
      !status || merchant.status?.toLowerCase() === status.toLowerCase();

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadData}>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center gap-4 flex-wrap pb-2 border-b border-slate-200/80">
          <div>
            <h1 className="font-outfit text-2xl md:text-3xl font-black text-[#0b1c30] tracking-tight">
              Stores & Merchants
            </h1>
            <p className="text-[#414753] text-xs md:text-sm mt-1 font-medium">
              Directory of connected e-commerce stores across platforms.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wider uppercase border border-indigo-100">
              Total Stores: {merchants.length}
            </span>
          </div>
        </div>

        {/* Action Error Alert */}
        {actionError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 font-medium flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-lg text-rose-500">error</span>
            {actionError}
          </div>
        )}

        {/* AI Insight Banner */}
        <div className="relative rounded-2xl p-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30">
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-[calc(1rem-2px)] flex items-center justify-between flex-wrap gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <div>
                <h4 className="font-outfit text-base font-bold text-[#0b1c30]">Merchants Health & Insights</h4>
                <p className="text-xs text-[#414753] font-medium mt-0.5">
                  Platform activity is stable with over {filteredMerchants.length} active matching stores synchronized successfully.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#e0e2ec] shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-lg">search</span>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by store name or owner email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e0e2ec] bg-slate-50/50 text-sm text-[#0b1c30] focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[#e0e2ec] bg-slate-50/50 text-sm text-[#0b1c30] focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none cursor-pointer font-medium"
            >
              <option value="">All Platforms</option>
              <option value="shopify">Shopify</option>
              <option value="woocommerce">WooCommerce</option>
              <option value="salla">Salla</option>
              <option value="zid">Zid</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[#e0e2ec] bg-slate-50/50 text-sm text-[#0b1c30] focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none cursor-pointer font-medium"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Merchants Table */}
        <div className="bg-white rounded-2xl border border-[#e0e2ec] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#e0e2ec] text-xs font-bold text-[#414753] uppercase tracking-wider">
                <th className="py-4 px-6">Store Name</th>
                <th className="py-4 px-6">Platform</th>
                <th className="py-4 px-6">Owner Email</th>
                <th className="py-4 px-6">Plan</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Change Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e2ec] text-sm bg-white">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#414753] font-medium bg-white">
                    No merchants match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((merchant) => (
                  <tr
                    key={merchant.id}
                    onClick={() => handleRowClick(merchant)}
                    className="hover:bg-[#f8f9ff] cursor-pointer transition-colors duration-150 bg-white"
                  >
                    <td className="py-4 px-6 font-semibold text-[#0b1c30]">{merchant.name}</td>
                    <td className="py-4 px-6 text-[#414753] capitalize font-medium">{merchant.platform}</td>
                    <td className="py-4 px-6 text-[#414753] font-medium">{merchant.email}</td>
                    <td className="py-4 px-6">
                      <span className={`${getPlanBadgeClasses(merchant.plan?.label)} rounded-lg text-xs font-semibold`}>
                        {merchant.plan?.label || 'Standard'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`${getStatusClasses(merchant.status)} rounded-full text-xs font-semibold inline-flex items-center gap-1.5`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClasses(merchant.status)}`}></span>
                        {merchant.status}
                      </span>
                    </td>
                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={merchant.status?.toLowerCase() || 'active'}
                        disabled={updatingId === merchant.id}
                        onChange={(e) => handleStatusChange(merchant.id, e.target.value, e)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                      {updatingId === merchant.id && (
                        <span className="text-[10px] text-indigo-600 font-semibold ml-2 inline-block">Updating...</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Store Details Modal Drawer */}
      <StoreDetailsDrawer
        storeId={selectedStoreId}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </AdminPageState>
  );
}

export default SuperAdminMerchants;
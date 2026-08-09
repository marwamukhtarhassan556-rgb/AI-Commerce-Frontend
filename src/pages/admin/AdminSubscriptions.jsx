import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageState from '../../components/ui/AdminPageState';
import { deletePlan, getSubscriptions, getFeatures, getPlans } from '../../services/admin/adminService';
import {
  mapPlanToCard,
  mapSubscriptionMetrics,
  mapSubscriptionRow,
} from '../../utils/adminMappers';
import PageHeader from './components/PageHeader';
import PricingMetricsHeader from './components/PricingMetricsHeader';
import AiOptimizationBanner from './components/AiOptimizationBanner';
import PlanCard from './components/PlanCard';

const billingStatusStyles = {
  successful: 'bg-secondary/10 text-secondary',
  failed: 'bg-error/10 text-error',
};

function AdminSubscriptions() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [actionError, setActionError] = useState(null);
  const [creating, setCreating] = useState(false);

  const loadSubscriptions = useCallback(async () => {

    setLoading(true);
    setError(null);

    try {

      const [subscriptionsResponse, plansResponse, featuresResponse] = await Promise.all([
        getSubscriptions({ status: statusFilter, page, pageSize: 20 }),
        getPlans(),
        getFeatures(),
      ]);

      const featureList = Array.isArray(featuresResponse) ? featuresResponse : [];
      const planList = Array.isArray(plansResponse) ? plansResponse : subscriptionsResponse.plans ?? [];

      setMetrics(mapSubscriptionMetrics(subscriptionsResponse.summary ?? {}));
      setPlans(planList.map((plan) => mapPlanToCard(plan, featureList)));
      setBillingHistory((subscriptionsResponse.subscriptions?.items ?? []).map(mapSubscriptionRow));
      setPagination({
        page: subscriptionsResponse.subscriptions?.page ?? page,
        totalPages: subscriptionsResponse.subscriptions?.totalPages ?? 1,
        totalItems: subscriptionsResponse.subscriptions?.totalItems ?? 0,
      });
    } catch (err) {
      setError(err.message ?? 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Delete this plan?')) return;

    setActionError(null);

    try {
      await deletePlan(planId);
      await loadSubscriptions();
    } catch (err) {
      setActionError(err.message ?? 'Failed to delete plan');
    }
  };

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadSubscriptions}>
      <div className="p-8 space-y-8">
        <PageHeader
          title="Subscriptions & Plans"
          description="Manage enterprise-wide subscription tiers and monitor revenue growth."
          actions={
            <Link
              to="/admin/plans/create"
              className="bg-primary text-on-primary px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined">add</span>
              Create New Plan
            </Link>
          }
        />

        {actionError && (
          <div className="rounded-xl border border-error/20 bg-error-container/10 px-4 py-3 text-sm text-error">
            {actionError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <PricingMetricsHeader metrics={metrics} />
          <AiOptimizationBanner
            tip={{
              title: 'Subscription Summary',
              message: `${pagination.totalItems} subscriptions tracked across ${plans.length} plans.`,
              highlight: String(plans.length),
              actionLabel: 'Refresh Data',
            }}
          />
        </div>

        <div className="space-y-6">
          <h2 className="font-outfit text-2xl font-medium text-on-surface">Active Subscription Tiers</h2>
          {plans.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onDelete={handleDeletePlan} />
              ))}
            </div>
          ) : (
            <div className="admin-glass-card rounded-xl p-8 text-sm text-on-surface-variant">
              No plans found. Create a plan to get started.
            </div>
          )}
        </div>

        <div className="space-y-6 pb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="font-outfit text-2xl font-medium text-on-surface">Recent Subscriptions</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-on-surface-variant">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setPage(1);
                  setStatusFilter(e.target.value);
                }}
                className="px-3 py-1.5 rounded-lg border border-outline-variant/30 bg-white text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="admin-glass-card rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant">Merchant</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant">Plan</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant">Amount</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {billingHistory.length ? (
                  billingHistory.map((row) => (
                    <tr key={row.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded flex items-center justify-center font-bold ${row.merchant.initialBg}`}
                          >
                            {row.merchant.initial}
                          </div>
                          <span className="text-sm font-medium text-on-surface">{row.merchant.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">{row.plan}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            billingStatusStyles[row.status]
                          }`}
                        >
                          {row.status === 'successful' ? 'Active' : row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{row.date}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-on-surface">{row.amount}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors text-on-surface-variant"
                        >
                          <span className="material-symbols-outlined">{row.actionIcon}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-sm text-on-surface-variant text-center">
                      No subscription records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest flex-wrap gap-4">
              <span className="text-sm text-on-surface-variant">
                Showing {billingHistory.length} of {pagination.totalItems} subscriptions
              </span>
              {pagination.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs font-semibold disabled:opacity-40 hover:bg-surface-container-low"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-semibold text-on-surface-variant">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                    className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs font-semibold disabled:opacity-40 hover:bg-surface-container-low"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminPageState>
  );
}

export default AdminSubscriptions;

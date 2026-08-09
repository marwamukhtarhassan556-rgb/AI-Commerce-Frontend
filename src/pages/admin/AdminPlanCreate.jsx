import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminPageState from '../../components/ui/AdminPageState';
import { createPlan, getFeatures } from '../../services/adminService';
import PlanConfigForm from './components/PlanConfigForm';

function AdminPlanCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [features, setFeatures] = useState([]);
  const [actionError, setActionError] = useState(null);
  const [creating, setCreating] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const featuresResponse = await getFeatures();
      setFeatures(Array.isArray(featuresResponse) ? featuresResponse : []);
    } catch (err) {
      setError(err.message ?? 'Failed to load platform features');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (form) => {
    setCreating(true);
    setActionError(null);

    const payload = {
      planName: form.name,
      planDescription: form.description,
      planStatus: form.status || 'Active',
      planPrice: Number(form.price),
      developmentPrice: Number(form.developmentPrice),
      featureIds: form.featureIds,
      aiModels: form.aiModels,
    };

    try {
      await createPlan(payload);
      navigate('/admin/subscriptions');
    } catch (err) {
      setActionError(err.message ?? 'Failed to create plan');
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadData}>
      <div className="p-8 space-y-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2">
          <Link
            to="/admin/subscriptions"
            className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Subscriptions & Plans
          </Link>
          <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
          <span className="text-primary font-bold text-sm">Create New Plan</span>
        </nav>

        {/* Page Header */}
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="font-outfit text-[32px] font-bold text-on-surface leading-tight">
              Create New Plan
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Configure new subscription plan parameters and feature access.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/subscriptions"
              className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={creating}
              form="plan-create-form"
              className="px-7 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {creating ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                  Creating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    add_circle
                  </span>
                  Create Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Error Alert */}
        {actionError && (
          <div className="rounded-xl border border-error/20 bg-error-container/10 px-4 py-3 text-sm text-error font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {actionError}
          </div>
        )}

        {/* Create Plan Form */}
        <PlanConfigForm
          mode="create"
          allFeatures={features}
          onSave={handleCreate}
          formId="plan-create-form"
        />
      </div>
    </AdminPageState>
  );
}

export default AdminPlanCreate;

import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AdminPageState from '../../components/ui/AdminPageState';
import { getFeatures, getPlanById, updatePlan, deletePlan } from '../../services/adminService';
import { mapPlanDetails } from '../../utils/adminMappers';
import PlanConfigForm from './components/PlanConfigForm';

function AdminPlanDetails() {
  const { id, planId } = useParams();
  const targetPlanId = id || planId;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState(null);
  const [features, setFeatures] = useState([]);
  const [actionError, setActionError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadPlan = useCallback(async () => {
    if (!targetPlanId) {
      setError('No plan ID specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [planResponse, featuresResponse] = await Promise.all([
        getPlanById(targetPlanId),
        getFeatures(),
      ]);

      const loadedFeatures = Array.isArray(featuresResponse) ? featuresResponse : [];
      setFeatures(loadedFeatures);
      setPlan(mapPlanDetails(planResponse, loadedFeatures));
    } catch (err) {
      setError(err.message ?? 'Failed to load plan details');
    } finally {
      setLoading(false);
    }
  }, [targetPlanId]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const handleSave = async (form) => {
    setSaving(true);
    setActionError(null);
    setSaveSuccess(null);

    const payload = {
      planName: form.name,
      planDescription: form.description,
      planStatus: form.status,
      planPrice: Number(form.price),
      developmentPrice: Number(form.developmentPrice),
      featureIds: form.featureIds,
      aiModels: form.aiModels,
    };

    try {
      await updatePlan(targetPlanId, payload);
      setSaveSuccess('Plan updated successfully!');
      await loadPlan();
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } catch (err) {
      setActionError(err.message ?? 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!plan) return;
    if (!window.confirm('Are you sure you want to archive this plan?')) return;

    setActionError(null);

    try {
      const payload = {
        planName: plan.name,
        planDescription: plan.description,
        planStatus: 'Inactive',
        planPrice: Number(plan.price),
        developmentPrice: Number(plan.developmentPrice),
        featureIds: plan.featureIds,
        aiModels: plan.aiModels,
      };

      await updatePlan(targetPlanId, payload);
      navigate('/admin/subscriptions');
    } catch (err) {
      setActionError(err.message ?? 'Failed to archive plan');
    }
  };

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadPlan}>
      {plan && (
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
            <span className="text-primary font-bold text-sm">{plan.shortName}</span>
          </nav>

          {/* Page Header */}
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <h1 className="font-outfit text-[32px] font-bold text-on-surface leading-tight">
                {plan.shortName} Details
              </h1>
              <p className="text-on-surface-variant text-sm mt-1">
                Configure plan parameters, pricing, features, and AI model access.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleArchive}
                className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">archive</span>
                Archive Plan
              </button>
              <button
                type="submit"
                disabled={saving}
                form="plan-config-form"
                className="px-7 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      save
                    </span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Feedback Banners */}
          {saveSuccess && (
            <div className="rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-secondary font-semibold flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              {saveSuccess}
            </div>
          )}

          {actionError && (
            <div className="rounded-xl border border-error/20 bg-error-container/10 px-4 py-3 text-sm text-error font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {actionError}
            </div>
          )}

          {/* Main Plan Config Form */}
          <PlanConfigForm
            mode="edit"
            plan={plan}
            allFeatures={features}
            onSave={handleSave}
            formId="plan-config-form"
          />
        </div>
      )}
    </AdminPageState>
  );
}

export default AdminPlanDetails;

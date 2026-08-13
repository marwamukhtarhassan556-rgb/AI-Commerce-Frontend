import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminPageState from '../../components/ui/AdminPageState';
import { 
  fetchPlanById as getPlanById, 
  fetchFeatures as getFeatures, 
  updatePlan 
} from '../../services/super-admin/adminService';
import { mapPlanDetails } from '../../utils/adminMappers';

const STANDARD_AI_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', desc: 'Fast, cost-effective model for routine queries' },
  { id: 'gpt-4o', name: 'GPT-4o', desc: 'Advanced reasoning for complex recommendation flows' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', desc: 'High nuance for long customer conversations' },
  { id: 'gemini', name: 'Gemini', desc: 'High-speed multimodal AI performance' },
];

function SuperAdminPlanDetails() {
  const { planId, id } = useParams();
  const targetId = planId || id;
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status & Notifications
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const [customModelInput, setCustomModelInput] = useState('');

  // Inline Form State
  const [form, setForm] = useState({
    name: '',
    price: '',
    developmentPrice: '',
    description: '',
    status: 'Active',
    aiModels: ['gpt-4o-mini'],
    featureIds: [],
  });

  const loadData = useCallback(async () => {
    if (!targetId) {
      setError('No plan ID specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [planResponse, featuresResponse] = await Promise.all([
        getPlanById(targetId),
        getFeatures(),
      ]);

      const loadedFeatures = Array.isArray(featuresResponse) ? featuresResponse : [];
      setFeatures(loadedFeatures);

      const mappedPlan = mapPlanDetails(planResponse, loadedFeatures);
      setPlan(mappedPlan);

      // Set form state directly from loaded data for inline editing
      setForm({
        name: mappedPlan.name ?? mappedPlan.planName ?? '',
        price: mappedPlan.price ?? '',
        developmentPrice: mappedPlan.developmentPrice ?? '',
        description: mappedPlan.description ?? '',
        status: mappedPlan.status ?? 'Active',
        aiModels: Array.isArray(mappedPlan.aiModels) && mappedPlan.aiModels.length ? mappedPlan.aiModels : ['gpt-4o-mini'],
        featureIds: Array.isArray(mappedPlan.featureIds) ? mappedPlan.featureIds : [],
      });
    } catch (err) {
      setError(err.message ?? 'Failed to load plan details');
    } finally {
      setLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleFeature = (featureId) => {
    setForm((prev) => {
      const exists = prev.featureIds.includes(featureId);
      return {
        ...prev,
        featureIds: exists
          ? prev.featureIds.filter((id) => id !== featureId)
          : [...prev.featureIds, featureId],
      };
    });
    if (validationError) setValidationError(null);
  };

  const toggleAiModel = (modelId) => {
    setForm((prev) => {
      const exists = prev.aiModels.includes(modelId);
      return {
        ...prev,
        aiModels: exists
          ? prev.aiModels.filter((m) => m !== modelId)
          : [...prev.aiModels, modelId],
      };
    });
    if (validationError) setValidationError(null);
  };

  const handleAddCustomModel = (e) => {
    e.preventDefault();
    const trimmed = customModelInput.trim();
    if (!trimmed) return;
    if (!form.aiModels.includes(trimmed)) {
      setForm((prev) => ({ ...prev, aiModels: [...prev.aiModels, trimmed] }));
    }
    setCustomModelInput('');
    if (validationError) setValidationError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setActionError(null);

    if (!form.name.trim()) {
      setValidationError('Plan Name cannot be empty.');
      return;
    }
    if (form.price === '' || Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
      setValidationError('Monthly Pricing must be a valid number greater than or equal to 0.');
      return;
    }
    if (form.developmentPrice === '' || Number.isNaN(Number(form.developmentPrice)) || Number(form.developmentPrice) <= 0) {
      setValidationError('Development Price is required and must be greater than 0.');
      return;
    }
    if (!form.featureIds || form.featureIds.length === 0) {
      setValidationError('At least one feature must be selected.');
      return;
    }
    if (!form.aiModels || form.aiModels.length === 0) {
      setValidationError('At least one AI Model must be selected.');
      return;
    }

    setSaving(true);

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
      await updatePlan(targetId, payload);
      setSaveSuccess('Plan updated successfully!');
      // Navigate back to main subscriptions page after saving
      navigate('/admin/subscriptions');
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
        planName: form.name || plan.name,
        planDescription: form.description || plan.description,
        planStatus: 'Inactive',
        planPrice: Number(form.price || plan.price),
        developmentPrice: Number(form.developmentPrice || plan.developmentPrice),
        featureIds: form.featureIds,
        aiModels: form.aiModels,
      };

      await updatePlan(targetId, payload);
      navigate('/admin/subscriptions');
    } catch (err) {
      setActionError(err.message ?? 'Failed to archive plan');
    }
  };

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadData}>
      {plan && (
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto font-sans">
          {/* Top Breadcrumb & Action Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                to="/admin/subscriptions"
                className="text-slate-500 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Subscriptions & Plans
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-semibold">{plan.name || plan.shortName}</span>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleArchive}
                className="px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm text-slate-400">archive</span>
                Archive Plan
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Alert Banners */}
          {validationError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/90 backdrop-blur-sm p-4 text-xs font-medium text-rose-900 flex items-center gap-3 shadow-sm">
              <div className="p-1 rounded-lg bg-rose-600 text-white">
                <span className="material-symbols-outlined text-base">error</span>
              </div>
              {validationError}
            </div>
          )}
          {saveSuccess && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/90 backdrop-blur-sm p-4 text-xs font-medium text-indigo-950 flex items-center gap-3 shadow-sm">
              <div className="p-1 rounded-lg bg-indigo-600 text-white">
                <span className="material-symbols-outlined text-base">check</span>
              </div>
              {saveSuccess}
            </div>
          )}
          {actionError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/90 backdrop-blur-sm p-4 text-xs font-medium text-rose-900 flex items-center gap-3 shadow-sm">
              <div className="p-1 rounded-lg bg-rose-600 text-white">
                <span className="material-symbols-outlined text-base">warning</span>
              </div>
              {actionError}
            </div>
          )}

          {/* Bento Header Box - Main Plan Details */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50 space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined p-2 rounded-xl bg-indigo-50 text-indigo-600 text-xl">edit_note</span>
                <h1 className="text-xl font-extrabold text-slate-900 font-outfit">Plan Overview</h1>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  form.status === 'Active'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {form.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Plan Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition bg-white/70"
                    placeholder="e.g. Enterprise Tier"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition resize-none bg-white/70"
                    placeholder="Brief description of who this plan is tailored for..."
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Plan Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition bg-white cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-200/60 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plan ID</div>
                  <div className="text-xs font-mono font-bold text-slate-600 break-all">{targetId}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Price ($)</span>
                <span className="material-symbols-outlined p-2 rounded-xl bg-indigo-50 text-indigo-600 text-xl">payments</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-slate-400 text-lg">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-xl font-extrabold text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition font-outfit"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Development / Setup Fee ($)</span>
                <span className="material-symbols-outlined p-2 rounded-xl bg-violet-50 text-violet-600 text-xl">handshake</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-slate-400 text-lg">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={form.developmentPrice}
                  onChange={(e) => setForm((prev) => ({ ...prev, developmentPrice: e.target.value }))}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-xl font-extrabold text-slate-900 focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 outline-none transition font-outfit"
                />
              </div>
            </div>
          </div>

          {/* AI Models & Included Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Model Direct Selection Bento Panel */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined p-2 rounded-xl bg-indigo-50 text-indigo-600 text-xl">smart_toy</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">AI Models Access</h3>
                    <p className="text-xs text-slate-400">Select allowed models for this tier</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {form.aiModels.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STANDARD_AI_MODELS.map((model) => {
                  const isSelected = form.aiModels.includes(model.id);
                  return (
                    <div
                      key={model.id}
                      onClick={() => toggleAiModel(model.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition select-none flex items-start gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600/30 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{model.name}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{model.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Model Direct Adder */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={customModelInput}
                  onChange={(e) => setCustomModelInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomModel(e)}
                  placeholder="Add custom model identifier..."
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                />
                <button
                  type="button"
                  onClick={handleAddCustomModel}
                  className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
                >
                  Add Model
                </button>
              </div>
            </div>

            {/* Included Features Direct Selection Bento Panel */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined p-2 rounded-xl bg-violet-50 text-violet-600 text-xl">verified</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Included Features</h3>
                    <p className="text-xs text-slate-400">Toggle enabled system permissions</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                  {form.featureIds.length} Enabled
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {features.map((feature) => {
                  const isSelected = form.featureIds.includes(feature.id);
                  return (
                    <div
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition select-none flex items-center gap-3 ${
                        isSelected
                          ? 'border-violet-600 bg-violet-50/50 ring-1 ring-violet-600/30 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-violet-600 focus:ring-violet-500 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        {feature.label || feature.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Save Action Bar */}
          <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleArchive}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Archive Plan
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </AdminPageState>
  );
}

export default SuperAdminPlanDetails;
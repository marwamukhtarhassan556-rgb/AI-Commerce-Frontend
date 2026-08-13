import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminPageState from '../../components/ui/AdminPageState';
import { createFeature } from '../../services/super-admin/adminService';

function SuperAdminFeatureCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'Active',
  });

  const [validationError, setValidationError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setActionError(null);

    const trimmedName = form.name.trim();
    const trimmedDesc = form.description.trim();

    if (!trimmedName) {
      setValidationError('Feature Name is required and cannot be empty.');
      return;
    }

    if (!trimmedDesc) {
      setValidationError('Description is required and cannot be empty.');
      return;
    }

    setCreating(true);

    const payload = {
      name: trimmedName,
      description: trimmedDesc,
      enabled: form.status === 'Active',
    };

    try {
      await createFeature(payload);
      navigate('/admin/features');
    } catch (err) {
      setActionError(err.message ?? 'Failed to create feature');
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminPageState loading={false}>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/admin/subscriptions" className="hover:text-indigo-600 transition-colors">
            Subscriptions & Plans
          </Link>
          <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
          <Link to="/admin/features" className="hover:text-indigo-600 transition-colors">
            Features
          </Link>
          <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
          <span className="text-indigo-600 font-bold">Create New Feature</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-outfit">
              Create New Feature
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
              Define a new capability module and configure its availability across tiers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/features"
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={creating}
              form="feature-create-form"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60"
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
                  Create Feature
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Error Alert */}
        {actionError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 font-medium flex items-center gap-2.5 shadow-sm">
            <span className="material-symbols-outlined text-xl text-rose-500">error</span>
            {actionError}
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <span className="material-symbols-outlined text-2xl">add_box</span>
            </div>
            <div>
              <h2 className="font-outfit text-lg font-bold text-slate-900">
                Feature Information
              </h2>
              <p className="text-xs text-slate-400 font-medium">Fill in the core parameters below</p>
            </div>
          </div>

          {/* Validation Error Alert */}
          {validationError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs md:text-sm text-rose-700 font-medium flex items-center gap-3">
              <span className="material-symbols-outlined text-lg text-rose-500 flex-shrink-0">error</span>
              <span>{validationError}</span>
            </div>
          )}

          <form id="feature-create-form" className="space-y-6" onSubmit={handleSubmit}>
            {/* Grid for Name & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Feature Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, name: e.target.value }));
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="e.g. AI Smart Recommendation"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Initial Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.status}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, status: e.target.value }));
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none cursor-pointer font-medium"
                >
                  <option value="Active">Active (Enabled)</option>
                  <option value="Inactive">Inactive (Disabled)</option>
                </select>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, description: e.target.value }));
                  if (validationError) setValidationError(null);
                }}
                placeholder="Explain what this feature provides to the platform users..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none resize-none leading-relaxed font-medium"
              />
            </div>
          </form>
        </div>

      </div>
    </AdminPageState>
  );
}

// Note: Use regular export below
export default SuperAdminFeatureCreate;
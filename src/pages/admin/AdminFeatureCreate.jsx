import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminPageState from '../../components/ui/AdminPageState';
import { createFeature } from '../../services/adminService';

function AdminFeatureCreate() {
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

    if (!form.status) {
      setValidationError('Please select a valid Status.');
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
      <div className="p-8 space-y-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2">
          <Link
            to="/admin/subscriptions"
            className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors"
          >
            Subscriptions & Plans
          </Link>
          <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
          <Link
            to="/admin/features"
            className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors"
          >
            Features
          </Link>
          <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
          <span className="text-primary font-bold text-sm">Create New Feature</span>
        </nav>

        {/* Page Header */}
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="font-outfit text-[32px] font-bold text-on-surface leading-tight">
              Create New Feature
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Define a new capability and configure its availability across subscription tiers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/features"
              className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={creating}
              form="feature-create-form"
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
                  Create Feature
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

        {/* Form Container */}
        <div className="admin-glass-card p-8 rounded-2xl bg-white border border-outline-variant/30 shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">
                add_box
              </span>
            </div>
            <div>
              <h2 className="font-outfit text-2xl font-semibold text-on-surface">
                Feature Details
              </h2>
            </div>
          </div>

          {validationError && (
            <div className="rounded-xl border border-error/30 bg-error/5 p-4 text-sm text-error flex items-center gap-3">
              <span className="material-symbols-outlined text-xl flex-shrink-0">error</span>
              <span className="font-medium">{validationError}</span>
            </div>
          )}

          <form id="feature-create-form" className="space-y-8" onSubmit={handleSubmit}>
            {/* Name and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Feature Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, name: e.target.value }));
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="e.g. AI Sentiment Analysis"
                  className="px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Status <span className="text-error">*</span>
                </label>
                <select
                  value={form.status}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, status: e.target.value }));
                    if (validationError) setValidationError(null);
                  }}
                  className="px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none cursor-pointer font-medium"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Description <span className="text-error">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={form.description}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, description: e.target.value }));
                  if (validationError) setValidationError(null);
                }}
                placeholder="Describe what this feature capability provides..."
                className="px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none leading-relaxed"
              />
            </div>
          </form>
        </div>
      </div>
    </AdminPageState>
  );
}

export default AdminFeatureCreate;

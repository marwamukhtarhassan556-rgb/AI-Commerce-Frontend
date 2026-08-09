import { useState, useEffect } from 'react';

const STANDARD_AI_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', desc: 'Fast, cost-effective model for routine customer queries' },
  { id: 'gpt-4o', name: 'GPT-4o', desc: 'Advanced reasoning model for complex sales & recommendation flows' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', desc: 'High nuance for customer support & long conversations' },
  { id: 'gemini', name: 'Gemini', desc: 'High-speed multimodal AI performance' },
];

function PlanConfigForm({ plan, allFeatures = [], onSave, formId, mode = 'edit' }) {
  const [form, setForm] = useState({
    name: plan?.name ?? '',
    price: plan?.price ?? '',
    developmentPrice: plan?.developmentPrice ?? '',
    description: plan?.description ?? '',
    status: plan?.status ?? 'Active',
    aiModels: plan?.aiModels ?? ['gpt-4o-mini'],
    featureIds: plan?.featureIds ?? [],
  });

  const [validationError, setValidationError] = useState(null);
  const [customModelInput, setCustomModelInput] = useState('');

  // Keep form updated when plan data loads in edit mode
  useEffect(() => {
    if (plan && mode === 'edit') {
      setForm({
        name: plan.name ?? '',
        price: plan.price ?? '',
        developmentPrice: plan.developmentPrice ?? '',
        description: plan.description ?? '',
        status: plan.status ?? 'Active',
        aiModels: Array.isArray(plan.aiModels) && plan.aiModels.length ? plan.aiModels : ['gpt-4o-mini'],
        featureIds: Array.isArray(plan.featureIds) ? plan.featureIds : [],
      });
    }
  }, [plan, mode]);

  const availableFeatures = (allFeatures.length ? allFeatures : plan?.includedFeatures) ?? [];

  const toggleFeature = (featureId) => {
    setForm((prev) => {
      const exists = prev.featureIds.includes(featureId);
      const newFeatureIds = exists
        ? prev.featureIds.filter((id) => id !== featureId)
        : [...prev.featureIds, featureId];
      return { ...prev, featureIds: newFeatureIds };
    });
    if (validationError) setValidationError(null);
  };

  const toggleAiModel = (modelId) => {
    setForm((prev) => {
      const exists = prev.aiModels.includes(modelId);
      const newAiModels = exists
        ? prev.aiModels.filter((m) => m !== modelId)
        : [...prev.aiModels, modelId];
      return { ...prev, aiModels: newAiModels };
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    // ── Validation matching backend requirements ─────────────
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

    onSave?.(form);
  };

  return (
    <div className="admin-glass-card p-8 rounded-2xl bg-white border border-outline-variant/30 shadow-sm space-y-8">
      <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-2xl">
            {mode === 'create' ? 'add_box' : 'edit_note'}
          </span>
        </div>
        <div>
          <h2 className="font-outfit text-2xl font-semibold text-on-surface">
            {mode === 'create' ? 'Create New Subscription Plan' : 'Plan Configuration'}
          </h2>
          <p className="text-xs text-on-surface-variant">
            Configure pricing, development setup costs, included features, and AI model access.
          </p>
        </div>
      </div>

      {validationError && (
        <div className="rounded-xl border border-error/30 bg-error/5 p-4 text-sm text-error flex items-center gap-3">
          <span className="material-symbols-outlined text-xl flex-shrink-0">error</span>
          <span className="font-medium">{validationError}</span>
        </div>
      )}

      <form id={formId} className="space-y-8" onSubmit={handleSubmit}>
        {/* Core Plan Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Plan Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                if (validationError) setValidationError(null);
              }}
              placeholder="e.g. Starter, Pro Growth, Enterprise"
              className="px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Monthly Pricing ($) <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={form.price}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, price: e.target.value }));
                  if (validationError) setValidationError(null);
                }}
                placeholder="49.00"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-semibold text-on-surface"
              />
            </div>
          </div>
        </div>

        {/* Development Price & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Development Price ($) <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={form.developmentPrice}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, developmentPrice: e.target.value }));
                  if (validationError) setValidationError(null);
                }}
                placeholder="45.00"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-primary"
              />
            </div>
            <span className="text-[11px] text-on-surface-variant">
              Setup or custom development fee (must be &gt; $0).
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Plan Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
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
            Plan Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe what this plan tier provides to merchants..."
            className="px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none leading-relaxed"
          />
        </div>

        {/* AI Models Selection */}
        <div className="flex flex-col gap-4 pt-4 border-t border-outline-variant/30">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
                AI Model Access <span className="text-error">*</span>
              </h3>
              <p className="text-xs text-on-surface-variant">Select AI models accessible under this plan tier.</p>
            </div>
            <span className="text-xs px-3 py-1 bg-primary/10 text-primary font-bold rounded-full">
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
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-outline-variant/60 bg-surface-container-lowest hover:border-primary/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-on-surface flex items-center gap-2">
                      {model.name}
                      <code className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono">
                        {model.id}
                      </code>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 leading-normal">{model.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom models tag list */}
          {form.aiModels.filter((m) => !STANDARD_AI_MODELS.some((sm) => sm.id === m)).length > 0 && (
            <div className="flex flex-wrap gap-2 items-center pt-2">
              <span className="text-xs font-semibold text-on-surface-variant">Custom Models:</span>
              {form.aiModels
                .filter((m) => !STANDARD_AI_MODELS.some((sm) => sm.id === m))
                .map((customModel) => (
                  <span
                    key={customModel}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-on-primary shadow-sm"
                  >
                    {customModel}
                    <button
                      type="button"
                      onClick={() => toggleAiModel(customModel)}
                      className="hover:text-error transition-colors text-sm font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
          )}

          {/* Input to add custom model tag */}
          <div className="flex gap-2 items-center pt-1">
            <input
              type="text"
              value={customModelInput}
              onChange={(e) => setCustomModelInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomModel(e)}
              placeholder="Add custom model identifier (e.g. gpt-4o-2024-08-06)..."
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={handleAddCustomModel}
              className="px-4 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold rounded-lg transition-colors"
            >
              Add Model
            </button>
          </div>
        </div>

        {/* Included Features Selection */}
        <div className="flex flex-col gap-4 pt-4 border-t border-outline-variant/30">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">featured_play_list</span>
                Included Features <span className="text-error">*</span>
              </h3>
              <p className="text-xs text-on-surface-variant">Select features bundled into this plan tier.</p>
            </div>
            <span className="text-xs px-3 py-1 bg-secondary/10 text-secondary font-bold rounded-full">
              {form.featureIds.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableFeatures.map((feature) => {
              const isSelected = form.featureIds.includes(feature.id);
              const label = feature.label || feature.name;
              const description = feature.description;

              return (
                <div
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isSelected
                      ? 'border-secondary bg-secondary/5 shadow-sm'
                      : 'border-outline-variant/60 bg-surface-container-lowest hover:border-secondary/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-on-surface block leading-tight">{label}</span>
                    {description && (
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">{description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}

export default PlanConfigForm;

import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPlan } from '../../services/super-admin/adminService';
import axios from 'axios'; // استخدمي الـ instance الخاص بكم إذا وجد، مثل import api from '../../services/api';

function SuperAdminPlanCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Form States
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planStatus, setPlanStatus] = useState('Active');
  
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // جلب كل الفيتشرز من الـ API ديناميكياً
  const loadFeatures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      // استبدلي الرابط بالمسار الصحيح للـ Endpoint الخاصة بجلب الفيتشرز في الباك إند
      const response = await axios.get('https://aisales123.runasp.net/api/admin/features', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // التأكد من استخراج المفقود أو الـ Array بغض النظر عن شكل الـ Response (إذا كانت مصفوفة مباشرة أو داخل data أو items)
      const result = response.data;
      const featuresList = Array.isArray(result) 
        ? result 
        : result?.items || result?.data || result?.features || [];

      setFeatures(featuresList);
    } catch (err) {
      setError('Failed to load features from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setActionError(null);

    const payload = {
      planName,
      planDescription,
      planStatus,
      planPrice: Number(planPrice),
      featureIds: selectedFeatures,
    };

    try {
      await createPlan(payload);
      navigate('/admin/subscriptions');
    } catch (err) {
      setActionError(err.message || 'Failed to create plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2">
        <Link
          to="/admin/subscriptions"
          className="text-slate-500 text-xs md:text-sm font-semibold hover:text-indigo-600 transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Subscriptions & Plans
        </Link>
        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
        <span className="text-indigo-600 font-bold text-xs md:text-sm">Create New Plan</span>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-end flex-wrap gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Create Subscription Plan
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">
            Configure pricing tier, parameter limits, and feature access for merchants.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/subscriptions"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            form="plan-create-form"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
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
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 font-medium flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-lg text-rose-500">error</span>
          {actionError}
        </div>
      )}

      {/* Global Error Alert */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 font-medium flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-rose-500">error</span>
            {error}
          </div>
          <button onClick={loadFeatures} className="text-xs underline font-bold">Retry</button>
        </div>
      )}

      {/* Create Plan Form */}
      <form
        id="plan-create-form"
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/85 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Plan Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g. Scale Plan"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Monthly Price ($) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="any"
              value={planPrice}
              onChange={(e) => setPlanPrice(e.target.value)}
              placeholder="100"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Plan Status
            </label>
            <select
              value={planStatus}
              onChange={(e) => setPlanStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Plan Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={planDescription}
            onChange={(e) => setPlanDescription(e.target.value)}
            placeholder="Target audience and highlight features..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none resize-none leading-relaxed font-medium"
          />
        </div>

        {/* Features Selection List (Dynamic & Full Data) */}
        <div className="space-y-3 pt-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Included Feature Modules ({features.length})
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
            {loading ? (
              <p className="text-sm text-slate-400 font-medium col-span-2 py-4 text-center">
                Loading all features...
              </p>
            ) : features.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium col-span-2 py-4 text-center border border-dashed border-slate-200 rounded-xl">
                No features found from API.
              </p>
            ) : (
              features.map((feature) => {
                const isChecked = selectedFeatures.includes(feature.id);
                return (
                  <div
                    key={feature.id}
                    onClick={() => handleFeatureToggle(feature.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <span className="material-symbols-outlined text-sm">check</span>}
                      </div>
                      <div className="min-w-0">
                        {/* تأكدي من أسماء الخصائص القادمة من الـ API (مثل name أو featureName) */}
                        <p className="text-xs font-bold text-slate-900 truncate">{feature.name || feature.featureName}</p>
                        <p className="text-[11px] text-slate-500 truncate font-medium">{feature.description || feature.code}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </form>

    </div>
  );
}

export default SuperAdminPlanCreate;
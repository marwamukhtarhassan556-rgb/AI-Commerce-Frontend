import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlan } from '../../services/super-admin/adminService';

function SuperAdminPlanCreate() {
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createPlan({
        planName,
        planPrice: Number(planPrice),
        planDescription,
        planStatus: 'Active',
      });
      navigate('/admin/subscriptions');
    } catch (err) {
      setError(err.message || 'Failed to create plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-outfit text-[#0b1c30]">Create Subscription Plan</h1>
        <p className="text-sm text-[#414753] mt-1">Configure pricing tier and limits for merchants.</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-[#e0e2ec] shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-[#0b1c30] mb-2">Plan Name</label>
          <input
            type="text"
            required
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="w-full px-4 py-2 border border-[#e0e2ec] rounded-lg text-sm focus:outline-none focus:border-primary"
            placeholder="e.g. Scale Plan"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0b1c30] mb-2">Monthly Price ($)</label>
          <input
            type="number"
            required
            min="0"
            value={planPrice}
            onChange={(e) => setPlanPrice(e.target.value)}
            className="w-full px-4 py-2 border border-[#e0e2ec] rounded-lg text-sm focus:outline-none focus:border-primary"
            placeholder="49"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0b1c30] mb-2">Plan Description</label>
          <textarea
            rows={3}
            value={planDescription}
            onChange={(e) => setPlanDescription(e.target.value)}
            className="w-full px-4 py-2 border border-[#e0e2ec] rounded-lg text-sm focus:outline-none focus:border-primary"
            placeholder="Target audience and highlight features..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e2ec]">
          <button
            type="button"
            onClick={() => navigate('/admin/subscriptions')}
            className="px-4 py-2 border border-[#e0e2ec] rounded-lg text-sm text-[#414753] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Create Plan'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SuperAdminPlanCreate;

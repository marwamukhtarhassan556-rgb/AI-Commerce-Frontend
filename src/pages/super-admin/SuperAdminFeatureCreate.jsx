import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFeature } from '../../services/adminService';

function SuperAdminFeatureCreate() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createFeature({ name, description, enabled });
      navigate('/admin/features');
    } catch (err) {
      setError(err.message || 'Failed to create feature');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-outfit text-[#0b1c30]">Create New Feature</h1>
        <p className="text-sm text-[#414753] mt-1">Define a feature module that can be linked to subscription tiers.</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-[#e0e2ec] shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-[#0b1c30] mb-2">Feature Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-[#e0e2ec] rounded-lg text-sm focus:outline-none focus:border-primary"
            placeholder="e.g. Smart Recommendation Engine"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0b1c30] mb-2">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-[#e0e2ec] rounded-lg text-sm focus:outline-none focus:border-primary"
            placeholder="Detailed description of what this feature enables..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="enabled"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-4 h-4 text-primary rounded"
          />
          <label htmlFor="enabled" className="text-sm font-medium text-[#0b1c30]">Enable feature immediately</label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e2ec]">
          <button
            type="button"
            onClick={() => navigate('/admin/features')}
            className="px-4 py-2 border border-[#e0e2ec] rounded-lg text-sm text-[#414753] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Save Feature'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SuperAdminFeatureCreate;

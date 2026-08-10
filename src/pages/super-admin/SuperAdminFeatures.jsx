import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFeatures } from '../../services/super-admin/adminService';
import AdminPageState from '../../components/ui/AdminPageState';

function SuperAdminFeatures() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFeatures();
      setFeatures(res);
    } catch (err) {
      setError(err.message || 'Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadData}>
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-outfit text-[#0b1c30]">Feature Modules</h1>
            <p className="text-sm text-[#414753] mt-1">Manage global AI capabilities available across merchant subscription plans.</p>
          </div>
          <button
            onClick={() => navigate('/admin/features/create')}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:opacity-90 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create Feature
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#e0e2ec] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#e0e2ec] text-xs font-semibold text-[#414753] uppercase">
                <th className="py-3.5 px-6">Feature Name</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e2ec] text-sm">
              {features.map((feature) => (
                <tr key={feature.id} className="hover:bg-[#f8f9ff]/50">
                  <td className="py-4 px-6 font-semibold text-[#0b1c30]">{feature.name}</td>
                  <td className="py-4 px-6 text-[#414753]">{feature.description}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${feature.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                      {feature.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageState>
  );
}

export default SuperAdminFeatures;

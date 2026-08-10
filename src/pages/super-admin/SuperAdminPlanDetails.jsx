import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPlanById } from '../../services/adminService';
import AdminPageState from '../../components/ui/AdminPageState';

function SuperAdminPlanDetails() {
  const { planId, id } = useParams();
  const targetId = planId || id || 'plan-1';
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPlanById(targetId);
      setPlan(res);
    } catch (err) {
      setError(err.message || 'Failed to load plan details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [targetId]);

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadData}>
      <div className="p-8 space-y-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-outfit text-[#0b1c30]">{plan?.name}</h1>
            <p className="text-sm text-[#414753] mt-1">{plan?.description}</p>
          </div>
          <button
            onClick={() => navigate('/admin/subscriptions')}
            className="px-4 py-2 border border-[#e0e2ec] rounded-lg text-sm text-[#414753] hover:bg-gray-50"
          >
            Back to Subscriptions
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#e0e2ec]">
            <p className="text-xs text-[#414753] uppercase font-semibold">Monthly Price</p>
            <p className="text-2xl font-bold text-[#0b1c30] mt-2">${plan?.price} <span className="text-xs font-normal text-[#717784]">/mo</span></p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#e0e2ec]">
            <p className="text-xs text-[#414753] uppercase font-semibold">Subscribers</p>
            <p className="text-2xl font-bold text-[#0b1c30] mt-2">{plan?.metrics?.subscribers?.value}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#e0e2ec]">
            <p className="text-xs text-[#414753] uppercase font-semibold">Status</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{plan?.status}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#e0e2ec] space-y-4">
          <h2 className="text-lg font-semibold text-[#0b1c30]">Included Features</h2>
          <div className="space-y-3">
            {plan?.includedFeatures?.map((feat) => (
              <div key={feat.id} className="flex items-center justify-between py-2 border-b border-[#e0e2ec] last:border-0">
                <span className="text-sm font-medium text-[#0b1c30]">{feat.label}</span>
                <span className={`material-symbols-outlined text-xl ${feat.enabled ? 'text-emerald-600' : 'text-gray-300'}`}>
                  {feat.enabled ? 'check_circle' : 'cancel'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageState>
  );
}

export default SuperAdminPlanDetails;

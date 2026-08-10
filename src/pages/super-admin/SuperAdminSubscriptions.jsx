import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSubscriptions, fetchPlans } from '../../services/super-admin/adminService';
import AdminPageState from '../../components/ui/AdminPageState';

function SuperAdminSubscriptions() {
  const [data, setData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [subsRes, plansRes] = await Promise.all([
        fetchSubscriptions(),
        fetchPlans(),
      ]);
      setData(subsRes);
      setPlans(plansRes);
    } catch (err) {
      setError(err.message || 'Failed to load subscriptions');
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
            <h1 className="text-2xl font-bold font-outfit text-[#0b1c30]">Subscriptions & Plans</h1>
            <p className="text-sm text-[#414753] mt-1">Manage pricing structures and active billing agreements.</p>
          </div>
          <button
            onClick={() => navigate('/admin/plans/create')}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:opacity-90 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create Plan
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.metrics?.map((m, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-[#e0e2ec] shadow-sm flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${m.iconBg}`}>
                <span className="material-symbols-outlined text-2xl">{m.icon}</span>
              </div>
              <div>
                <p className="text-xs text-[#414753] uppercase font-semibold">{m.label}</p>
                <p className="text-2xl font-bold text-[#0b1c30]">{m.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Available Tiers */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0b1c30]">Active Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white p-6 rounded-xl border border-[#e0e2ec] shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[#0b1c30]">{plan.name}</h3>
                  <p className="text-xs text-[#414753] mt-1">{plan.description}</p>
                  <p className="text-2xl font-extrabold text-primary mt-4">${plan.price} <span className="text-xs text-[#717784] font-normal">/month</span></p>
                </div>
                <button
                  onClick={() => navigate(`/admin/subscriptions/${plan.id}`)}
                  className="w-full py-2 border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors"
                >
                  Manage Tier
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="bg-white rounded-xl border border-[#e0e2ec] shadow-sm overflow-hidden space-y-4 p-6">
          <h2 className="text-lg font-semibold text-[#0b1c30]">Recent Transactions</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#e0e2ec] text-xs font-semibold text-[#414753] uppercase">
                <th className="py-3.5 px-4">Merchant</th>
                <th className="py-3.5 px-4">Plan</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e2ec] text-sm">
              {data?.rows?.map((row) => (
                <tr key={row.id}>
                  <td className="py-3 px-4 font-medium text-[#0b1c30]">{row.merchant?.name}</td>
                  <td className="py-3 px-4 text-[#414753]">{row.plan}</td>
                  <td className="py-3 px-4 text-[#414753]">{row.date}</td>
                  <td className="py-3 px-4 font-semibold text-[#0b1c30]">{row.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${row.status === 'successful' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {row.status}
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

export default SuperAdminSubscriptions;

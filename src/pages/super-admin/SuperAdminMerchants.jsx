import { useState, useEffect } from 'react';
import { fetchMerchants } from '../../services/super-admin/adminService';
import AdminPageState from '../../components/ui/AdminPageState';

function SuperAdminMerchants() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMerchants();
      setMerchants(res);
    } catch (err) {
      setError(err.message || 'Failed to load merchants');
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
        <div>
          <h1 className="text-2xl font-bold font-outfit text-[#0b1c30]">Stores & Merchants</h1>
          <p className="text-sm text-[#414753] mt-1">Directory of connected e-commerce stores across platforms.</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e0e2ec] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#e0e2ec] text-xs font-semibold text-[#414753] uppercase">
                <th className="py-3.5 px-6">Store Name</th>
                <th className="py-3.5 px-6">Platform</th>
                <th className="py-3.5 px-6">Owner Email</th>
                <th className="py-3.5 px-6">Plan</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e2ec] text-sm">
              {merchants.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-[#f8f9ff]/50">
                  <td className="py-4 px-6 font-semibold text-[#0b1c30]">{merchant.name}</td>
                  <td className="py-4 px-6 text-[#414753] capitalize">{merchant.platform}</td>
                  <td className="py-4 px-6 text-[#414753]">{merchant.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${merchant.plan?.className}`}>
                      {merchant.plan?.label}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${merchant.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                      {merchant.status}
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

export default SuperAdminMerchants;

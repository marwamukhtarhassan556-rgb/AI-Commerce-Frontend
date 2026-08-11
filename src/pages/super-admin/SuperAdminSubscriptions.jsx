import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchSubscriptions, fetchPlans } from '../../services/super-admin/adminService';
import AdminPageState from '../../components/ui/AdminPageState';
import axios from 'axios';

function SuperAdminSubscriptions() {
  const [data, setData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
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

  // دالة حذف البلان المربوطة بالـ API الفعلي
  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    setDeletingId(planId);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      // إرسال طلب الحذف للـ API الأساسي (مع مراعاة الـ Base URL أو الرابط كاملاً حسب إعدادات الـ Axios لديك)
      await axios.delete(`https://aisales123.runasp.net/api/admin/plans/${planId}`, { headers });

      // تحديث القائمة محلياً بعد نجاح الحذف من السيرفر
      setPlans((prevPlans) => prevPlans.filter((p) => p.id !== planId));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete the plan.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadData}>
      <div className="p-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="font-outfit text-[32px] font-semibold text-[#0b1c30] leading-tight">Subscriptions & Plans</h1>
            <p className="text-on-surface-variant mt-1">Manage pricing structures and active billing agreements.</p>
          </div>
          <button
            onClick={() => navigate('/admin/plans/create')}
            className="px-4 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:opacity-95 transition-all flex items-center gap-2 shadow-sm hover:shadow"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create Plan
          </button>
        </div>

        {/* Compact & Stylish Modern Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data?.metrics?.map((metric) => (
            <div
              key={metric.label}
              className="bg-white px-5 py-4 rounded-xl border border-[#e0e2ec] shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 relative overflow-hidden group flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-[#64748b] text-xs font-bold tracking-wider uppercase">{metric.label}</p>
                <h3 className="font-outfit text-2xl font-bold text-[#0b1c30] tracking-tight">{metric.value}</h3>
                {metric.change && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 pt-0.5">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>{metric.change}</span>
                  </div>
                )}
              </div>
              
              <div className={`p-3 rounded-xl ${metric.iconBg || 'bg-primary/10 text-primary'} flex items-center justify-center transition-transform group-hover:scale-110 duration-200 shadow-inner`}>
                <span className="material-symbols-outlined text-2xl">{metric.icon}</span>
              </div>

              <div className={`absolute top-0 left-0 w-1 h-full ${metric.accentBar || 'bg-primary'}`} />
            </div>
          ))}
        </div>

        {/* Active Tiers / Plans */}
        <div className="space-y-4">
          <h2 className="font-outfit text-xl font-semibold text-[#0b1c30]">Active Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`admin-glass-card rounded-2xl p-8 flex flex-col transition-all group bg-white border border-[#e0e2ec] shadow-sm relative ${
                  plan.popular
                    ? 'border-primary/40 shadow-xl shadow-primary/5'
                    : 'hover:border-primary/30'
                }`}
              >
                {/* زر الحذف الخارجي في أعلى الكارد مع حالة التحميل */}
                <button
                  type="button"
                  disabled={deletingId === plan.id}
                  onClick={() => handleDeletePlan(plan.id)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm flex items-center justify-center disabled:opacity-50"
                  title="Delete Plan"
                >
                  {deletingId === plan.id ? (
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-base">delete</span>
                  )}
                </button>

                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-semibold shadow-sm">
                    Most Popular
                  </div>
                )}

                <div className="flex justify-between items-start mb-6 pr-8">
                  <div>
                    <h4 className={`font-outfit text-xl font-medium ${plan.popular ? 'text-primary' : 'text-on-surface'}`}>
                      {plan.name}
                    </h4>
                    <p className="text-on-surface-variant text-sm mt-1">{plan.description}</p>
                  </div>
                </div>

                {/* عرض عدد المستخدمين والـ Edit بشكل أنيق بجانب السعر أو تحته */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="font-outfit text-[42px] font-bold text-[#0b1c30] leading-none">${plan.price}</span>
                    <span className="text-on-surface-variant text-sm">/mo</span>
                  </div>
                  {plan.users !== undefined && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {Number(plan.users).toLocaleString()} Users
                    </span>
                  )}
                </div>

                {Array.isArray(plan.features) && plan.features.length > 0 && (
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.label || feature}
                        className={`flex items-center gap-3 text-sm ${
                          feature.included !== false ? 'text-on-surface' : 'text-on-surface-variant/50 line-through'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-lg ${
                            feature.included !== false ? 'text-emerald-500' : 'text-slate-300'
                          }`}
                        >
                          {feature.included !== false ? 'check_circle' : 'cancel'}
                        </span>
                        {feature.label || feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* زر Manage Tier بلون كحلي أنيق وفعال */}
                <button
                  onClick={() => navigate(`/admin/subscriptions/${plan.id}`)}
                  className="w-full py-3 px-4 bg-[#0b1c30] hover:bg-[#132847] text-white font-semibold text-sm rounded-xl text-center transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2 group/btn"
                >
                  <span>Manage Tier</span>
                  <span className="material-symbols-outlined text-base transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Subscriptions / Transactions */}
        <div className="bg-white rounded-2xl border border-[#e0e2ec] shadow-sm overflow-hidden space-y-4 p-6">
          <h2 className="font-outfit text-lg font-semibold text-[#0b1c30]">Recent Transactions</h2>
          <div className="overflow-x-auto">
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
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#0b1c30]">{row.merchant?.name}</td>
                    <td className="py-3.5 px-4 text-[#414753]">{row.plan}</td>
                    <td className="py-3.5 px-4 text-[#414753]">{row.date}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#0b1c30]">{row.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        row.status === 'successful' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminPageState>
  );
}

export default SuperAdminSubscriptions;
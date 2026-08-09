import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

function RecentStoresTable({ stores }) {
  return (
    <div className="admin-glass-card rounded-xl overflow-hidden">
      <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
        <h3 className="font-outfit text-xl font-medium">Recent Registered Stores</h3>
        <Link to="/admin/merchants" className="text-primary text-sm font-semibold hover:underline transition-all">
          View All Stores
        </Link>
      </div>
      <div className="overflow-x-auto admin-custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff4ff]/50">
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Store Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Platform</th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Plan Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {stores.map((store) => (
              <tr key={store.id || store.name} className="hover:bg-[#eff4ff] transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold overflow-hidden">
                      {store.logo ? (
                        <img className="w-full h-full object-cover" src={store.logo} alt={store.name} />
                      ) : (
                        <span className="material-symbols-outlined text-xl">storefront</span>
                      )}
                    </div>
                    <span className="text-sm font-bold">{store.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">{store.platform}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${store.plan.className}`}>
                    {store.plan.label}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={store.status} />
                </td>
                <td className="px-6 py-5 text-right">
                  <Link to="/admin/merchants" className="p-2 rounded-lg hover:bg-[#d3e4fe] transition-all inline-block text-outline">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentStoresTable;

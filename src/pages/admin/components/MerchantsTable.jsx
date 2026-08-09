import StatusBadge from './StatusBadge';

function MerchantsTable({ merchants, onStatusChange }) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-[0_24px_48px_rgba(77,68,227,0.03)] overflow-hidden">
      <div className="overflow-x-auto admin-custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff4ff]/50">
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">Store Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">Platform</th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">Seller Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">Active Plan</th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">Shop Domain</th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {merchants.length ? (
              merchants.map((merchant) => (
                <tr key={merchant.id ?? merchant.name} className="group hover:bg-[#eff4ff] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${merchant.initialsBg}`}>
                        {merchant.initials}
                      </div>
                      <div className="text-sm font-semibold text-on-surface">{merchant.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">{merchant.platformIcon}</span>
                      <span className="text-sm text-on-surface-variant">{merchant.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">{merchant.email}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${merchant.plan.className}`}>
                      {merchant.plan.label}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-primary underline decoration-primary/30 underline-offset-4">
                    {merchant.domain}
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={merchant.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      type="button"
                      onClick={() => onStatusChange?.(merchant)}
                      className="px-4 py-2 rounded-lg border border-outline-variant/30 text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all"
                    >
                      {merchant.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-sm text-on-surface-variant text-center">
                  No stores found for the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MerchantsTable;

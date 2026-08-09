const statusStyles = {
  active: {
    text: 'text-[#0f5132] bg-[#d1e7dd] px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 w-fit',
    dot: 'bg-[#0f5132]',
  },
  inactive: {
    text: 'text-[#842029] bg-[#f8d7da] px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 w-fit',
    dot: 'bg-[#842029]',
  },
};

function FeaturesTable({ features, onRowClick }) {
  return (
    <div className="admin-glass-card rounded-xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/30">
            <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant">Feature Name</th>
            <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant">Status</th>
            <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {features.map((feature) => {
            const normalizedStatus = String(feature.status || 'Active').toLowerCase();
            const statusStyle = statusStyles[normalizedStatus] ?? statusStyles.active;
            const displayStatus = feature.status || 'Active';

            return (
              <tr
                key={feature.id}
                className="group hover:bg-surface-container-low transition-colors cursor-pointer"
                onClick={() => onRowClick(feature)}
              >
                <td className="px-6 py-5">
                  <div>
                    <div className="text-sm font-semibold text-on-surface">{feature.name}</div>
                    <div className="text-sm text-on-surface-variant mt-0.5">{feature.subtitle}</div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center gap-1.5 ${statusStyle.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {displayStatus}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                    chevron_right
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default FeaturesTable;

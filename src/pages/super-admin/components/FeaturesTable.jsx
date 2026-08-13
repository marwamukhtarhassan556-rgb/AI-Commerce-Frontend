function FeaturesTable({ features = [], onRowClick }) {
  return (
    <div className="bg-white rounded-xl border border-[#e0e2ec] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8f9ff] border-b border-[#e0e2ec] text-xs font-semibold text-[#414753] uppercase tracking-wider">
              <th className="py-3.5 px-6">Feature Name</th>
              <th className="py-3.5 px-6">Description</th>
              <th className="py-3.5 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e2ec] text-sm">
            {features.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-8 text-center text-[#414753]">
                  No features available.
                </td>
              </tr>
            ) : (
              features.map((feature) => {
                const isActive = feature.status === 'Active' || feature.enabled;

                return (
                  <tr
                    key={feature.id}
                    onClick={() => onRowClick(feature)}
                    className="hover:bg-[#f8f9ff]/50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-[#0b1c30]">
                      {feature.name}
                    </td>
                    <td className="py-4 px-6 text-[#414753]">
                      {feature.description || feature.subtitle || '—'}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeaturesTable;
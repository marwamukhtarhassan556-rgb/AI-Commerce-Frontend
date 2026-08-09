function ServiceStatusTable({ services }) {
  return (
    <section className="admin-glass-card rounded-xl overflow-hidden">
      <div className="px-8 py-6 border-b border-outline-variant/30 flex justify-between items-center bg-[#eff4ff]/50">
        <h2 className="font-outfit text-xl font-bold text-on-surface">Service Status</h2>
        <span className="flex items-center gap-2 text-xs font-semibold text-secondary">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          All systems operational
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#eff4ff]/30">
              <th className="px-8 py-4 text-sm font-semibold text-on-surface-variant">Service</th>
              <th className="px-8 py-4 text-sm font-semibold text-on-surface-variant">Status</th>
              <th className="px-8 py-4 text-sm font-semibold text-on-surface-variant">Latency</th>
              <th className="px-8 py-4 text-sm font-semibold text-on-surface-variant">Uptime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {services.map((svc) => (
              <tr key={svc.service} className="hover:bg-[#eff4ff] transition-colors">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">{svc.icon}</span>
                    <span className="text-sm font-semibold">{svc.service}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      svc.status === 'Healthy'
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-tertiary-fixed-dim/20 text-tertiary'
                    }`}
                  >
                    {svc.status}
                  </span>
                </td>
                <td className="px-8 py-4 text-sm text-on-surface-variant">{svc.latency}</td>
                <td className="px-8 py-4 text-sm font-semibold">{svc.uptime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ServiceStatusTable;

function MerchantsBottomWidgets() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="admin-glass-panel p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center mb-4">
            <span className="material-symbols-outlined">verified</span>
          </div>
          <h3 className="font-outfit text-xl font-medium text-on-surface">Active Rate</h3>
          <p className="font-outfit text-[48px] font-semibold text-secondary tracking-tight leading-none mt-2">94.2%</p>
        </div>
        <p className="text-sm text-on-surface-variant mt-2">+2.4% increase from last quarter</p>
      </div>
      <div className="md:col-span-2 bg-inverse-surface text-inverse-on-surface p-8 rounded-2xl relative overflow-hidden flex items-center">
        <div className="relative z-10">
          <h3 className="font-outfit text-2xl font-medium mb-2">Advanced Enterprise Controls</h3>
          <p className="text-base opacity-80 max-w-lg mb-6">
            Access global overrides for store policies, payment gateways, and AI automation levels. These settings
            apply to all managed accounts under your enterprise license.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button type="button" className="px-6 py-2.5 bg-[#4f46e5] text-white rounded-xl text-sm font-semibold hover:scale-105 transition-all">
              Launch Console
            </button>
            <button type="button" className="px-6 py-2.5 border border-white/20 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all">
              Documentation
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none">
          <span className="material-symbols-outlined text-[240px] absolute -right-12 -top-12 rotate-12">hub</span>
        </div>
      </div>
    </div>
  );
}

export default MerchantsBottomWidgets;

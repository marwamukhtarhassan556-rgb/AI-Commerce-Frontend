import { useState } from 'react';
import { ADMIN_AVATAR } from './SuperAdminNav';

function SuperAdminHeader({
  title,
  searchPlaceholder = null,
  showSystemAdmin = false,
}) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <header className="fixed top-0 right-0 left-64 h-20 bg-[#f8f9ff] border-b border-outline-variant/30 flex justify-between items-center px-8 z-40">
      <div className="flex items-center gap-4 flex-1">
        {title && (
          <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-on-surface-variant">
            <span>Platform</span>
            <span>/</span>
            <h1 className="font-outfit text-2xl font-extrabold text-primary whitespace-nowrap">
              {title}
            </h1>
          </div>
        )}
        {searchPlaceholder && (
          <div className="relative w-full max-w-md group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full bg-[#eff4ff] border border-outline-variant rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-secondary text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          MongoDB Status: Healthy
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleRefresh}
            className={`p-2 rounded-full hover:bg-[#eff4ff] transition-all text-on-surface-variant ${refreshing ? 'animate-spin' : ''}`}
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>

          {showSystemAdmin && (
            <>
              <div className="h-8 w-px bg-outline-variant/30 mx-1 hidden xl:block" />
              <div className="text-right hidden xl:block">
                <p className="text-sm font-semibold text-on-surface">System Admin</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Enterprise Mode</p>
              </div>
            </>
          )}

          <div className="h-10 w-10 rounded-full border-2 border-primary/20 overflow-hidden p-0.5">
            <img className="w-full h-full rounded-full object-cover" src={ADMIN_AVATAR} alt="Admin profile" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default SuperAdminHeader;

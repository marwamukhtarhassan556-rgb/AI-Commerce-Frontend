import { NavLink, useLocation } from 'react-router-dom';
import { adminNavItems } from './SuperAdminNav';

function SuperAdminSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-[#eff4ff] border-r border-outline-variant flex flex-col p-4 gap-2 z-50">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-10 h-10 bg-[#4f46e5] rounded-xl flex items-center justify-center text-white">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            dataset
          </span>
        </div>
        <div>
          <h1 className="font-outfit text-xl font-bold text-primary leading-tight">AI-Commerce Super Admin</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
            AI-Powered Enterprise
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-grow">
        {adminNavItems.map((item) => {
          if (item.disabled) {
            return (
              <span
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant/50 cursor-not-allowed"
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm font-semibold">{item.label}</span>
              </span>
            );
          }

          const isItemActive =
            item.id === 'subscriptions'
              ? pathname.startsWith('/admin/subscriptions') || pathname.startsWith('/admin/plans')
              : undefined;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.id === 'dashboard'}
              className={({ isActive }) => {
                const active = isItemActive ?? isActive;
                return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-[#d3e4fe] text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-[#dce9ff]'
                }`;
              }}
            >
              {({ isActive }) => {
                const active = isItemActive ?? isActive;
                return (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </>
                );
              }}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-outline-variant/30">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#eff4ff]">
          <div className="w-8 h-8 rounded-full bg-[#885500] flex items-center justify-center text-[#ffd4a4]">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">Super Admin</p>
            <p className="text-[10px] text-on-surface-variant">System Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SuperAdminSidebar;

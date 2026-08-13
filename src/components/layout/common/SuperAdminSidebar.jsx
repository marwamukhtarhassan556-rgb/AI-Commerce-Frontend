import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { adminNavItems } from './SuperAdminNav';
import { resolveProfilePicture } from '../../../utils/profilePicture';

function SuperAdminSidebar({ isOpen = false, onClose = null }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const adminProfile = (() => {
    try { return JSON.parse(localStorage.getItem('merchantProfile') || '{}'); } catch { return {}; }
  })();
  const adminName = [adminProfile.firstName, adminProfile.lastName].filter(Boolean).join(' ') || adminProfile.name || adminProfile.email || 'Super Admin';
  const adminInitials = adminName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'SA';
  const profilePicture = resolveProfilePicture(adminProfile.profilePictureUrl || '');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <aside
      className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto flex flex-col transition-transform duration-300 shadow-2xl lg:translate-x-0 navi-sidebar`}
    >
      {/* ── Brand Header ── */}
      <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-full h-24 rounded-3xl overflow-hidden bg-slate-900 shadow-lg">
          <img
            src="/assets/logos/logo.png"
            alt="Navi AI logo"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        ) : null}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex flex-col gap-0.5 flex-grow px-3 py-4">
        {adminNavItems.map((item) => {
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
                return active ? 'navi-sidebar-link navi-sidebar-link-active' : 'navi-sidebar-link';
              }}
              onClick={() => onClose?.()}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* ── Footer: Admin Profile & Logout ── */}
      <div className="px-3 py-4 border-t border-white/5">
        <NavLink
          to="/admin/profile"
          className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2 transition-all navi-sidebar-footer-link"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-slate-800 text-white text-xs font-semibold">
            {profilePicture ? (
              <img src={profilePicture} alt={adminName} className="w-full h-full object-cover" />
            ) : (
              adminInitials
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold m-0">{adminName}</p>
            <p className="text-slate-400 text-[0.65rem] m-0">Platform Administrator</p>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          className="navi-sidebar-logout flex items-center gap-3 px-3 py-2.5 rounded-xl"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default SuperAdminSidebar;

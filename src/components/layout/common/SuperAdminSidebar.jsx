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
      className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto flex flex-col transition-transform duration-300 shadow-2xl lg:translate-x-0`}
      style={{
        background: 'linear-gradient(180deg, #0D1B2A 0%, #112240 100%)',
        borderRight: '1px solid rgba(37,99,235,0.15)',
      }}
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
          // Special multi-path active check for subscriptions
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
                return active ? 'nav-item-active' : 'nav-item';
              }}
              style={({ isActive }) => {
                const active = isItemActive ?? isActive;
                return active
                  ? {
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.6rem 0.9rem', borderRadius: '0.6rem',
                      background: 'linear-gradient(90deg, rgba(37,99,235,0.25) 0%, rgba(56,189,248,0.08) 100%)',
                      color: '#38BDF8', fontWeight: 600, fontSize: '0.875rem',
                      textDecoration: 'none', marginBottom: '2px',
                      borderLeft: '3px solid #2563EB',
                    }
                  : {
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.6rem 0.9rem', borderRadius: '0.6rem',
                      color: '#94A3B8', fontWeight: 500, fontSize: '0.875rem',
                      textDecoration: 'none', marginBottom: '2px',
                      borderLeft: '3px solid transparent',
                      transition: 'all 0.15s ease',
                    };
              }}
              onClick={() => onClose?.()}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#CBD5E1';
                }
              }}
              onMouseLeave={(e) => {
                if (!pathname.startsWith(item.path.replace('/admin/', '/admin/'))) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94A3B8';
                }
              }}
            >
              {({ isActive }) => {
                const active = isItemActive ?? isActive;
                return (
                  <>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '1.15rem',
                        color: active ? '#38BDF8' : '#64748B',
                        fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </>
                );
              }}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Footer: Admin Profile & Logout ── */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <NavLink
          to="/admin/profile"
          className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2 transition-all"
          style={{ background: 'rgba(37,99,235,0.08)' }}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-slate-800 text-white text-xs font-semibold">
            {profilePicture ? (
              <img src={profilePicture} alt={adminName} className="w-full h-full object-cover" />
            ) : (
              adminInitials
            )}
          </div>
          <div className="min-w-0">
            <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>{adminName}</p>
            <p style={{ color: '#64748B', fontSize: '0.65rem', margin: 0 }}>Platform Administrator</p>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#F87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = 'transparent'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default SuperAdminSidebar;

import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { adminNavItems } from './SuperAdminNav';

function SuperAdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <aside
      className="h-screen w-64 fixed left-0 top-0 overflow-y-auto flex flex-col z-50"
      style={{
        background: 'linear-gradient(180deg, #0D1B2A 0%, #112240 100%)',
        borderRight: '1px solid rgba(37,99,235,0.15)',
      }}
    >
      {/* ── Brand Header ── */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
        <div
          className="w-11 h-11 flex items-center justify-center flex-shrink-0"
          style={{ borderRadius: '10px', background: 'linear-gradient(145deg, #0D1B2A 0%, #2563EB 100%)', boxShadow: '0 10px 24px rgba(37,99,235,0.28)' }}
        >
          <svg width="29" height="29" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M8 12.2C8 9.35 10.35 7 13.2 7H18.8C21.65 7 24 9.35 24 12.2V26H8V12.2Z" fill="#0B2545"/>
            <path d="M11 12.4V10.8C11 7.85 13.15 5.5 16 5.5C18.85 5.5 21 7.85 21 10.8V12.4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10.6 22.8L15.3 9.2L18.2 17.9L23.3 8.8L20 23.1L16.9 14.2L10.6 22.8Z" fill="white"/>
            <path d="M18.2 17.9L23.3 8.8L22.1 14.1L19.5 18.8L18.2 17.9Z" fill="#38BDF8"/>
          </svg>
        </div>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', color: 'white', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
            Navi <span style={{ color: '#38BDF8' }}>AI</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>
            Navigate. Engage. Grow.
          </p>
        </div>
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
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2"
          style={{ background: 'rgba(37,99,235,0.08)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563EB, #38BDF8)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'white' }}>
              admin_panel_settings
            </span>
          </div>
          <div className="min-w-0">
            <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>Super Admin</p>
            <p style={{ color: '#64748B', fontSize: '0.65rem', margin: 0 }}>Platform Administrator</p>
          </div>
        </div>
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

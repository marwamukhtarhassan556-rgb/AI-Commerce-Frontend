import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_AVATAR } from './SuperAdminNav';
import { fetchAiLiveness } from '../../../api/aiService';
import { resolveProfilePicture } from '../../../utils/profilePicture';

function SuperAdminHeader({ title, searchPlaceholder = null, onMenuToggle = null }) {
  const [liveStatus, setLiveStatus] = useState('checking'); // 'live' | 'offline' | 'checking'
  const [refreshing, setRefreshing] = useState(false);
  const [adminProfile, setAdminProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('merchantProfile') || '{}'); } catch { return {}; }
  });

  const adminName = [adminProfile.firstName, adminProfile.lastName].filter(Boolean).join(' ') || adminProfile.name || adminProfile.email || 'Super Admin';
  const adminInitials = adminName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'SA';
  const profilePicture = resolveProfilePicture(adminProfile.profilePictureUrl || '');

  const checkLiveness = async () => {
    try {
      const data = await fetchAiLiveness();
      setLiveStatus(data?.status?.toLowerCase().includes('live') ? 'live' : 'offline');
    } catch {
      setLiveStatus('offline');
    }
  };

  useEffect(() => {
    checkLiveness();
    const interval = setInterval(checkLiveness, 30000);
    const refreshProfile = () => {
      try { setAdminProfile(JSON.parse(localStorage.getItem('merchantProfile') || '{}')); } catch { setAdminProfile({}); }
    };
    window.addEventListener('merchant-profile-updated', refreshProfile);
    return () => {
      clearInterval(interval);
      window.removeEventListener('merchant-profile-updated', refreshProfile);
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    checkLiveness().finally(() => setTimeout(() => setRefreshing(false), 800));
  };

  const statusConfig = {
    live:     { dot: '#22C55E', bg: 'rgba(34,197,94,0.08)',  text: '#22C55E', label: 'AI Service Live' },
    offline:  { dot: '#F87171', bg: 'rgba(248,113,113,0.08)', text: '#F87171', label: 'AI Service Offline' },
    checking: { dot: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  text: '#F59E0B', label: 'Checking...' },
  };
  const s = statusConfig[liveStatus];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-200 backdrop-blur lg:left-64 lg:right-0 lg:px-6"
      style={{ height: '64px', background: 'var(--admin-header)' }}
    >
      {onMenuToggle ? (
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white/80 p-2 text-slate-700 transition hover:bg-slate-100"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      ) : null}
      {/* Left: Breadcrumb + Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {title && (
          <div className="flex items-center gap-2 min-w-0">
            <span style={{ color: '#64748B', fontSize: '0.8rem' }}>Navi Platform</span>
            <span style={{ color: '#CBD5E1', fontSize: '0.8rem' }}>/</span>
            <h1
              style={{
                color: '#0D1B2A',
                fontSize: '1.1rem',
                fontWeight: 700,
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </h1>
          </div>
        )}
        {searchPlaceholder && (
          <div className="relative ml-4 w-full max-w-[320px]">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              style={{ fontSize: '1rem' }}
            >
              search
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 pl-10 text-sm text-[#0D1B2A] outline-none focus:border-primary"
            />
          </div>
        )}
      </div>

      {/* Right: AI Status Badge + Refresh + Avatar */}
      <div className="flex items-center gap-4">
        {/* Liveness Badge */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: s.bg }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: s.dot,
              boxShadow: `0 0 6px ${s.dot}`,
              animation: liveStatus === 'live' ? 'pulse 2s infinite' : 'none',
            }}
          />
          <span style={{ color: s.text, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {s.label}
          </span>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={handleRefresh}
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1D4ED8',
            cursor: 'pointer',
          }}
          title="Refresh status"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '1.1rem', color: '#1D4ED8', animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
          >
            refresh
          </span>
        </button>

        {/* Avatar */}
        <Link
          to="/admin/profile"
          className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 block"
          style={{ border: '2px solid rgba(37,99,235,0.4)' }}
          title="Open profile"
        >
          {profilePicture ? (
            <img className="w-full h-full object-cover" src={profilePicture} alt={adminName} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-xs font-semibold">
              {adminInitials}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}

export default SuperAdminHeader;

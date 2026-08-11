import { useLocation, Outlet } from 'react-router-dom';
import SuperAdminSidebar from './common/SuperAdminSidebar';
import SuperAdminHeader from './common/SuperAdminHeader';

function getHeaderConfig(pathname) {
  if (pathname.startsWith('/admin/dashboard'))       return { title: 'Dashboard' };
  if (pathname.startsWith('/admin/features/create')) return { title: 'Create Feature' };
  if (pathname.startsWith('/admin/features'))        return { title: 'Features' };
  if (pathname.startsWith('/admin/merchants'))       return { title: 'Stores Management', searchPlaceholder: 'Search stores...' };
  if (pathname.startsWith('/admin/plans/create'))    return { title: 'Create Plan' };
  if (pathname.match(/^\/admin\/plans\/.*\/edit/))   return { title: 'Edit Plan' };
  if (pathname.match(/^\/admin\/subscriptions\/.+/)) return { title: 'Plan Details' };
  if (pathname.startsWith('/admin/subscriptions'))   return { title: 'Subscriptions & Plans' };
  if (pathname.startsWith('/admin/models-health'))   return { title: 'AI Models & Health' };
  if (pathname.startsWith('/admin/prompts'))         return { title: 'Prompt Manager' };
  if (pathname.startsWith('/admin/bundles'))         return { title: 'Bundle Promos' };
  if (pathname.startsWith('/admin/diagnostics'))     return { title: 'AI Analytics' };
  if (pathname.startsWith('/admin/audit-logs'))      return { title: 'Audit Logs' };
  if (pathname.startsWith('/admin/assistant'))       return { title: 'Navi Assistant' };
  // if (pathname.startsWith('/admin/settings'))        return { title: 'Settings' };
  if (pathname.startsWith('/admin/plan-details'))    return { title: 'Plan Details' };
  return { title: 'Admin Panel' };
}

function SuperAdminLayout() {
  const { pathname } = useLocation();
  const config = getHeaderConfig(pathname);

  return (
    <div
      className="super-admin-shell min-h-screen font-sans antialiased"
      style={{ background: '#F8FAFF', color: '#0D1B2A' }}
    >
      <SuperAdminSidebar />
      <SuperAdminHeader {...config} />
      <main
        className="super-admin-main min-h-screen"
        style={{ marginLeft: '256px', paddingTop: '64px' }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default SuperAdminLayout;

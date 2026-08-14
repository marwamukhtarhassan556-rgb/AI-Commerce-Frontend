import { useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const config = getHeaderConfig(pathname);

  const toggleSidebar = () => setSidebarOpen((current) => !current);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-shell super-admin-shell min-h-screen font-sans antialiased">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      <SuperAdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <SuperAdminHeader {...config} onMenuToggle={toggleSidebar} />
      <main className="super-admin-main min-h-screen pt-16 lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
}

export default SuperAdminLayout;

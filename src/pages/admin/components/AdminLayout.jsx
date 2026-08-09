import { useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

function getHeaderConfig(pathname) {
  let title = 'Dashboard';
  let showSystemAdmin = false;

  if (pathname.startsWith('/admin/dashboard')) {
    title = 'Dashboard';
  } else if (pathname.startsWith('/admin/features/create')) {
    title = 'Create Feature';
  } else if (pathname.startsWith('/admin/features')) {
    title = 'Features';
  } else if (pathname.startsWith('/admin/merchants')) {
    title = 'Merchants';
    showSystemAdmin = true;
  } else if (pathname.startsWith('/admin/plans/create')) {
    title = 'Create Plan';
  } else if (pathname.match(/^\/admin\/plans\/.*\/edit/)) {
    title = 'Edit Plan';
  } else if (pathname.match(/^\/admin\/subscriptions\/.+/)) {
    title = 'Plan Details';
  } else if (pathname.startsWith('/admin/subscriptions')) {
    title = 'Subscriptions';
  } else if (pathname.startsWith('/admin/diagnostics')) {
    title = 'Diagnostics';
  } else if (pathname.startsWith('/admin/audit-logs')) {
    title = 'Audit Logs';
  } else if (pathname.startsWith('/admin/settings')) {
    title = 'Settings';
  } else if (pathname.startsWith('/admin/plan-details')) {
    title = 'Plan Details';
  }

  return { title, showSystemAdmin };
}

import { Outlet } from 'react-router-dom';

function AdminLayout() {
  const { pathname } = useLocation();
  const config = getHeaderConfig(pathname);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased">
      <AdminSidebar />
      <AdminHeader {...config} />
      <main className="ml-64 pt-20 min-h-screen"><Outlet /></main>
    </div>
  );
}

export default AdminLayout;

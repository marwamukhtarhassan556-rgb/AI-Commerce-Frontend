import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Store, 
  Ticket, 
  BookOpen,
  CreditCard,
  UserCircle 
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/merchant/dashboard', icon: LayoutDashboard },
  { name: 'Product Catalog', path: '/merchant/catalog', icon: Package },
  { name: 'My Store', path: '/merchant/store', icon: Store },
  { name: 'Tickets', path: '/merchant/tickets', icon: Ticket },
  { name: 'AI Knowledge', path: '/merchant/knowledge', icon: BookOpen },
  { name: 'Subscription', path: '/merchant/subscription', icon: CreditCard },
  { name: 'Profile', path: '/merchant/profile', icon: UserCircle },
];

const MerchantSidebar = () => {
  return (
    <aside className="fixed h-full w-70 left-0 top-0 bg-surface-container-low border-r border-outline-variant z-50 hidden lg:flex flex-col py-6">
      {/* Header */}
      <div className="px-6 mb-10">
        <h1 className="text-2xl font-extrabold text-primary">AICommerce</h1>
        <p className="text-xs font-medium text-on-surface-variant">Pro Merchant</p>
      </div>

      {/* Navigation Links */}
      <nav className="grow space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white rounded-full'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="mt-auto px-4">
        <NavLink to="/merchant/profile" className="flex items-center gap-3 rounded-xl bg-surface-container-highest/50 p-4 transition hover:bg-surface-container-high">
          <UserCircle className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">{(() => { try { const profile = JSON.parse(localStorage.getItem('merchantProfile') || '{}'); return [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.name || profile.email || 'Merchant'; } catch { return 'Merchant'; } })()}</span>
            <span className="text-[10px] uppercase tracking-wider text-outline">Manage Account</span>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};

export default MerchantSidebar;

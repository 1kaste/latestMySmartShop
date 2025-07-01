import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, NavLink, Link } from 'react-router-dom';
import { Icons } from '../../components/icons';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onClick }) => {
  const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";
  const activeClasses = "bg-gray-900 text-white";

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </NavLink>
  );
};


const AdminLayout: React.FC = () => {
  const { settings, reviews } = useData();
  const { adminLogout, lastUserPath } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pendingReviewsCount = reviews.filter(r => r.status === 'Pending').length;
  
  // Close sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);


  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(p => p.length > 0 && p !== 'admin');
    const baseTitle = `${settings.shopName} - Admin`;
    if (pathParts.length === 0 || pathParts[0] === 'dashboard') {
        document.title = `Dashboard | ${baseTitle}`;
    } else {
        const pageName = pathParts[pathParts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        document.title = `${pageName} | ${baseTitle}`;
    }
  }, [location.pathname, settings.shopName]);
  
  const handleExit = () => {
    adminLogout();
  };
  
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background-dark font-sans md:flex">
      {/* Backdrop for mobile */}
       <div 
          className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={closeSidebar}
       ></div>

      <aside className={`fixed top-0 left-0 h-full w-64 bg-primary-dark text-white flex flex-col z-40 transform transition-transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700 flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 text-white overflow-hidden">
            {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={`${settings.shopName} logo`} className="h-8 w-auto flex-shrink-0" />
            ) : (
                <Icons.Store className="h-6 w-6 flex-shrink-0" />
            )}
            <span className="font-bold text-lg truncate">{settings.shopName}</span>
          </Link>
          <div className="hidden md:block">
             <ThemeToggleButton />
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem to="/admin/dashboard" icon={<Icons.LayoutDashboard className="h-5 w-5" />} label="Dashboard" onClick={closeSidebar} />
          <NavItem to="/admin/inventory" icon={<Icons.Package className="h-5 w-5" />} label="Inventory" onClick={closeSidebar} />
          <NavItem to="/admin/orders" icon={<Icons.ListOrdered className="h-5 w-5" />} label="Orders" onClick={closeSidebar} />
          <div className="relative">
            <NavItem to="/admin/reviews" icon={<Icons.Star className="h-5 w-5" />} label="Reviews" onClick={closeSidebar} />
            {pendingReviewsCount > 0 && (
              <span className="absolute top-1.5 right-3 h-5 w-5 bg-accent-teal text-white text-xs flex items-center justify-center rounded-full">
                {pendingReviewsCount}
              </span>
            )}
          </div>
          <NavItem to="/admin/settings" icon={<Icons.Settings className="h-5 w-5" />} label="Settings" onClick={closeSidebar} />
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
          <Link to="/" onClick={handleExit} className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
             <Icons.LogOut className="h-5 w-5" />
             <span className="ml-3">Exit Admin</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
          <header className="md:hidden h-16 bg-white dark:bg-primary-dark border-b dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-20">
               <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                    <Icons.Menu className="h-6 w-6" />
               </Button>
               <h2 className="text-lg font-bold">Admin Panel</h2>
               <ThemeToggleButton />
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
              <Outlet />
          </main>
      </div>
      <Link
            to={lastUserPath}
            className="fixed bottom-6 left-6 h-16 w-16 rounded-full bg-accent-teal hover:scale-110 flex items-center justify-center shadow-lg transition-transform z-50"
            aria-label="View Store"
        >
            <Icons.Store className="h-8 w-8 text-white" />
        </Link>
    </div>
  );
};

export default AdminLayout;
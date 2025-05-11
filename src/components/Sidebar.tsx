
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Users, Package, Tag, Percent, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import InventorySidebar from './InventorySidebar';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems: NavItem[] = [
    { 
      title: 'Customers', 
      icon: Users, 
      path: '/customers'
    },
    { 
      title: 'Category', 
      icon: Tag, 
      path: '/categories'
    },
    { 
      title: 'Inventory', 
      icon: Package, 
      path: '/products'
    },
    { 
      title: 'Offers', 
      icon: Percent, 
      path: '/offers'
    },
    { 
      title: 'Orders', 
      icon: ClipboardList, 
      path: '/',
      badge: 5
    },
  ];

  // Check if we're on the Products page
  const isProductsPage = currentPath === '/products';

  return (
    <>
      <aside 
        className={cn(
          'flex flex-col bg-coffee-green text-white transition-all duration-300 ease-in-out relative border-r border-coffee-green/20',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
      >
        {/* Logo */}
        <div className="flex items-center p-4 h-16">
          {!collapsed && (
            <div className="font-hackney text-xl tracking-wide">
              <span className="text-white">Parse</span>
              <span className="text-bisi-orange">Nue</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-to-r from-bisi-orange to-bisi-orange/80 rounded flex items-center justify-center text-white font-hackney">
              P
            </div>
          )}
        </div>
        
        {/* Toggle button */}
        <button 
          className="absolute -right-3 top-16 bg-coffee-green text-white rounded-full p-1 shadow-md hover:bg-coffee-green/90 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Navigation */}
        <nav className="mt-6 flex-1">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    'flex items-center py-3 px-3 rounded-md transition-colors',
                    isActive 
                      ? 'bg-bisi-orange text-white' 
                      : 'text-white/80 hover:bg-coffee-green/60 hover:text-white'
                  )}
                >
                  <item.icon size={20} className={cn('flex-shrink-0', collapsed ? 'mx-auto' : 'mr-3')} />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.title}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="bg-white text-coffee-green text-xs font-semibold rounded-full px-1.5 py-0.5 ml-2">
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute top-0 right-0 bg-white text-coffee-green text-xs font-semibold rounded-full px-1 py-0">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="p-4 mt-auto">
          {!collapsed && (
            <div className="text-white/70 text-xs text-center">
              <p>ಸ್ವಾಗತ!</p>
              <p>Welcome, Admin</p>
            </div>
          )}
        </div>
      </aside>

      {/* Inventory Sidebar - Show only when on the Products page */}
      {isProductsPage && <InventorySidebar />}
    </>
  );
}

export default Sidebar;

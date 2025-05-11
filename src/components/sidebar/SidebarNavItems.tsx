
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  personas?: string[];
}

interface SidebarNavItemsProps {
  navItems: NavItem[];
  collapsed: boolean;
  isMobile: boolean;
  mobileMenuOpen: boolean;
  onMobileItemClick?: () => void;
}

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({
  navItems,
  collapsed,
  isMobile,
  mobileMenuOpen,
  onMobileItemClick
}) => {
  return (
    <nav className="mt-6 flex-1">
      <ul className={`space-y-1 px-2 ${isMobile && mobileMenuOpen ? 'block' : ''}`}>
        {((!isMobile) || (isMobile && mobileMenuOpen)) && 
          navItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.path}
                onClick={() => isMobile && onMobileItemClick?.()}
                className={({ isActive }) => cn(
                  'flex items-center py-3 px-3 rounded-md transition-colors',
                  isActive 
                    ? 'bg-bisi-orange text-white' 
                    : 'text-white/80 hover:bg-coffee-green/60 hover:text-white'
                )}
              >
                <item.icon size={20} className={cn('flex-shrink-0', collapsed && !mobileMenuOpen ? 'mx-auto' : 'mr-3')} />
                {(!collapsed || (isMobile && mobileMenuOpen)) && (
                  <span className="flex-1 truncate">{item.title}</span>
                )}
                {(!collapsed || (isMobile && mobileMenuOpen)) && item.badge && (
                  <span className="bg-white text-coffee-green text-xs font-semibold rounded-full px-1.5 py-0.5 ml-2">
                    {item.badge}
                  </span>
                )}
                {collapsed && !mobileMenuOpen && item.badge && (
                  <span className="absolute top-0 right-0 bg-white text-coffee-green text-xs font-semibold rounded-full px-1 py-0">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))
        }
      </ul>
    </nav>
  );
};

export default SidebarNavItems;


import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Package, 
  Tag, 
  Percent, 
  ClipboardList, 
  ChevronLeft, 
  ChevronRight,
  BarChart,
  Users as StaffIcon,
  MapPin,
  DatabaseIcon,
  User,
  Building,
  Store,
  Shield
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedPersona, setSelectedPersona] = useState<string>("Customer");

  const navItems: NavItem[] = [
    { 
      title: 'Orders', 
      icon: ClipboardList, 
      path: '/',
      badge: 5
    },
    { 
      title: 'Inventory', 
      icon: DatabaseIcon, 
      path: '/inventory'
    },
    { 
      title: 'Customers', 
      icon: Users, 
      path: '/customers'
    },
    { 
      title: 'Staff', 
      icon: StaffIcon, 
      path: '/staff'
    },
    { 
      title: 'Outlets', 
      icon: MapPin, 
      path: '/outlets'
    },
    { 
      title: 'Products', 
      icon: Package, 
      path: '/products'
    },
    { 
      title: 'Categories', 
      icon: Tag, 
      path: '/categories'
    },
    { 
      title: 'Offers', 
      icon: Percent, 
      path: '/offers'
    },
    { 
      title: 'Reports', 
      icon: BarChart, 
      path: '/reports'
    },
  ];

  const personas = [
    { value: "customer", label: "Customer", icon: User },
    { value: "staff", label: "Staff", icon: StaffIcon },
    { value: "franchise", label: "Franchise Owner", icon: Store },
    { value: "brand", label: "Brand Owner", icon: Shield },
  ];

  const handlePersonaChange = (value: string) => {
    setSelectedPersona(value);
    // Here you would typically switch contexts, update permissions, or redirect
    console.log(`Switched to ${value} persona`);
  };

  return (
    <aside 
      className={cn(
        'flex flex-col bg-coffee-green text-white transition-all duration-300 ease-in-out relative border-r border-coffee-green/20',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo and Persona Selector */}
      <div className="flex flex-col p-4 h-auto">
        <div className="flex items-center h-16">
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
        
        {!collapsed && (
          <div className="mt-4">
            <Select 
              defaultValue={personas[0].value} 
              onValueChange={handlePersonaChange}
            >
              <SelectTrigger className="w-full bg-coffee-green/50 border-coffee-green/30 text-white">
                <SelectValue placeholder="Select Persona" />
              </SelectTrigger>
              <SelectContent>
                {personas.map((persona) => (
                  <SelectItem key={persona.value} value={persona.value}>
                    <div className="flex items-center gap-2">
                      <persona.icon className="h-4 w-4" />
                      <span>{persona.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger className="mt-4 w-8 h-8 flex items-center justify-center bg-coffee-green/50 rounded hover:bg-coffee-green/70 transition-colors">
              <User size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right">
              {personas.map((persona) => (
                <DropdownMenuItem 
                  key={persona.value}
                  onClick={() => handlePersonaChange(persona.value)}
                  className="cursor-pointer"
                >
                  <persona.icon className="mr-2 h-4 w-4" />
                  <span>{persona.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
            <p>Welcome, {selectedPersona}</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

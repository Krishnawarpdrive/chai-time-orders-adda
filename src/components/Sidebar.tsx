
import React, { useState, useEffect } from 'react';
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
  Shield,
  Home,
  CreditCard,
  Menu as MenuIcon
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
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  personas?: string[]; // Limit visibility to specific personas
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const [selectedPersona, setSelectedPersona] = useState<string>("customer");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const navItems: NavItem[] = [
    { 
      title: 'Orders', 
      icon: ClipboardList, 
      path: '/',
      badge: 5,
      personas: ['staff', 'franchise', 'brand']
    },
    { 
      title: 'Inventory', 
      icon: DatabaseIcon, 
      path: '/inventory',
      personas: ['staff', 'franchise', 'brand']
    },
    { 
      title: 'Customers', 
      icon: Users, 
      path: '/customers',
      personas: ['staff', 'franchise', 'brand']
    },
    { 
      title: 'Staff', 
      icon: StaffIcon, 
      path: '/staff',
      personas: ['franchise', 'brand']
    },
    { 
      title: 'Outlets', 
      icon: MapPin, 
      path: '/outlets',
      personas: ['franchise', 'brand']
    },
    { 
      title: 'Products', 
      icon: Package, 
      path: '/products',
      personas: ['staff', 'franchise', 'brand']
    },
    { 
      title: 'Categories', 
      icon: Tag, 
      path: '/categories',
      personas: ['staff', 'franchise', 'brand']
    },
    { 
      title: 'Offers', 
      icon: Percent, 
      path: '/offers',
      personas: ['staff', 'franchise', 'brand']
    },
    { 
      title: 'Reports', 
      icon: BarChart, 
      path: '/reports',
      personas: ['staff', 'franchise', 'brand']
    },
  ];

  // Customer-specific menu items
  const customerNavItems: NavItem[] = [
    { 
      title: 'Home', 
      icon: Home, 
      path: '/',
    },
    { 
      title: 'Profile', 
      icon: User, 
      path: '/profile',
    },
    { 
      title: 'Orders', 
      icon: ClipboardList, 
      path: '/orders',
    },
    { 
      title: 'Refer & Earn', 
      icon: Percent, 
      path: '/refer',
    },
    { 
      title: 'My Cart', 
      icon: CreditCard, 
      path: '/cart',
      badge: 2
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
    setMobileMenuOpen(false); // Close mobile menu after selection
    // Here you would typically switch contexts, update permissions, or redirect
    console.log(`Switched to ${value} persona`);
  };

  // Get the current active navigation items based on selected persona
  const activeNavItems = selectedPersona === 'customer' ? customerNavItems : 
    navItems.filter(item => !item.personas || item.personas.includes(selectedPersona));

  return (
    <aside 
      className={cn(
        'flex flex-col bg-coffee-green text-white transition-all duration-300 ease-in-out relative border-r border-coffee-green/20',
        collapsed ? 'w-16' : 'w-64',
        isMobile && mobileMenuOpen ? 'absolute z-50 h-full' : '',
        isMobile && !mobileMenuOpen && collapsed ? 'w-16' : '',
        className
      )}
    >
      {/* Logo and Persona Selector */}
      <div className="flex flex-col p-4 h-auto">
        <div className="flex items-center h-16">
          {(!collapsed || (isMobile && mobileMenuOpen)) && (
            <div className="font-hackney text-xl tracking-wide">
              <span className="text-white">Parse</span>
              <span className="text-bisi-orange">Nue</span>
            </div>
          )}
          {collapsed && !mobileMenuOpen && (
            <div className="w-8 h-8 bg-gradient-to-r from-bisi-orange to-bisi-orange/80 rounded flex items-center justify-center text-white font-hackney">
              P
            </div>
          )}
          
          {/* Mobile menu button */}
          {isMobile && (
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-auto p-2"
            >
              <MenuIcon size={24} />
            </button>
          )}
        </div>
        
        {/* Persona Selector - Desktop Expanded View */}
        {!collapsed && !isMobile && (
          <div className="mt-4">
            <Select 
              defaultValue={personas[0].value} 
              value={selectedPersona}
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
        
        {/* Persona Selector - Mobile View or Collapsed */}
        {(collapsed || isMobile) && !mobileMenuOpen && (
          <DropdownMenu>
            <DropdownMenuTrigger className="mt-4 w-8 h-8 flex items-center justify-center bg-coffee-green/50 rounded hover:bg-coffee-green/70 transition-colors">
              {personas.find(p => p.value === selectedPersona)?.icon({ size: 16 }) || <User size={16} />}
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="bg-coffee-green border-coffee-green/30 text-white">
              {personas.map((persona) => (
                <DropdownMenuItem 
                  key={persona.value}
                  onClick={() => handlePersonaChange(persona.value)}
                  className="cursor-pointer hover:bg-coffee-green/70 text-white focus:bg-coffee-green/70 focus:text-white"
                >
                  <persona.icon className="mr-2 h-4 w-4" />
                  <span>{persona.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Mobile Expanded Persona Selector */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-4 border-b border-coffee-green/30 pb-4">
            <p className="text-sm text-white/70 mb-2">Switch Persona:</p>
            {personas.map((persona) => (
              <button
                key={persona.value}
                onClick={() => handlePersonaChange(persona.value)}
                className={`flex items-center w-full p-2 rounded-md ${
                  selectedPersona === persona.value 
                    ? 'bg-bisi-orange text-white' 
                    : 'text-white/80 hover:bg-coffee-green/60'
                }`}
              >
                <persona.icon className="mr-3 h-5 w-5" />
                <span>{persona.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Toggle button - only show on desktop */}
      {!isMobile && (
        <button 
          className="absolute -right-3 top-16 bg-coffee-green text-white rounded-full p-1 shadow-md hover:bg-coffee-green/90 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}

      {/* Navigation */}
      <nav className="mt-6 flex-1">
        <ul className={`space-y-1 px-2 ${isMobile && mobileMenuOpen ? 'block' : ''}`}>
          {/* Only show navigation when mobile menu is open or not on mobile */}
          {((!isMobile) || (isMobile && mobileMenuOpen)) && 
            activeNavItems.map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.path}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
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

      {/* Bottom section */}
      <div className="p-4 mt-auto">
        {(!collapsed || (isMobile && mobileMenuOpen)) && (
          <div className="text-white/70 text-xs text-center">
            <p>ಸ್ವಾಗತ!</p>
            <p>Welcome, {personas.find(p => p.value === selectedPersona)?.label || "Customer"}</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

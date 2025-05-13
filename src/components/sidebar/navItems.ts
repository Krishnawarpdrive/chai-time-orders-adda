
import {
  Users,
  Package,
  Tag,
  Percent,
  ClipboardList,
  BarChart,
  Users as StaffIcon,
  MapPin,
  DatabaseIcon,
  User,
  Home,
  CreditCard
} from 'lucide-react';

export interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  personas?: string[];
}

// Regular navigation items for staff, franchise, brand with prefixed routes
export const standardNavItems: NavItem[] = [
  { 
    title: 'Orders', 
    icon: ClipboardList, 
    path: 'orders',
    badge: 5,
    personas: ['staff', 'franchise', 'brand']
  },
  { 
    title: 'Inventory', 
    icon: DatabaseIcon, 
    path: 'inventory',
    personas: ['staff', 'franchise', 'brand']
  },
  { 
    title: 'Customers', 
    icon: Users, 
    path: 'customers',
    personas: ['staff', 'franchise', 'brand']
  },
  { 
    title: 'Staff', 
    icon: StaffIcon, 
    path: 'staff',
    personas: ['franchise', 'brand']
  },
  { 
    title: 'Outlets', 
    icon: MapPin, 
    path: 'outlets',
    personas: ['franchise', 'brand']
  },
  { 
    title: 'Products', 
    icon: Package, 
    path: 'products',
    personas: ['staff', 'franchise', 'brand']
  },
  { 
    title: 'Categories', 
    icon: Tag, 
    path: 'categories',
    personas: ['staff', 'franchise', 'brand']
  },
  { 
    title: 'Offers', 
    icon: Percent, 
    path: 'offers',
    personas: ['staff', 'franchise', 'brand']
  },
  { 
    title: 'Reports', 
    icon: BarChart, 
    path: 'reports',
    personas: ['staff', 'franchise', 'brand']
  }
];

// Customer-specific menu items
export const customerNavItems: NavItem[] = [
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

// Get active nav items based on selected persona with prefixed paths
export const getActiveNavItems = (selectedPersona: string): NavItem[] => {
  if (selectedPersona === 'customer') {
    return customerNavItems;
  }
  
  // Filter items based on persona and add the persona prefix to the path
  return standardNavItems
    .filter(item => !item.personas || item.personas.includes(selectedPersona))
    .map(item => ({
      ...item,
      path: `/${selectedPersona}/${item.path}` // Add persona prefix to path
    }));
};


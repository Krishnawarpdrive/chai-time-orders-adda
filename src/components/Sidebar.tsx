
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
  BoxIcon
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [requestQuantities, setRequestQuantities] = useState<Record<string, number>>({});
  const { toast } = useToast();

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
      title: 'Products', 
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
    {
      title: 'Inventory',
      icon: BoxIcon,
      path: '/inventory'
    }
  ];
  
  // Sample inventory data - in a real app, this would come from an API/database
  useEffect(() => {
    // Simulating API call to fetch inventory
    const fetchInventory = () => {
      const sampleInventory: InventoryItem[] = [
        { id: '1', name: 'Coffee Powder', quantity: 50, unit: 'kg' },
        { id: '2', name: 'Cups', quantity: 2000, unit: 'units' },
        { id: '3', name: 'Ginger', quantity: 10, unit: 'kg' },
        { id: '4', name: 'Sugar', quantity: 75, unit: 'kg' },
        { id: '5', name: 'Milk', quantity: 100, unit: 'liters' },
      ];
      
      setInventoryItems(sampleInventory);
      
      // Initialize request quantities
      const initialQuantities: Record<string, number> = {};
      sampleInventory.forEach(item => {
        initialQuantities[item.id] = 0;
      });
      setRequestQuantities(initialQuantities);
    };
    
    fetchInventory();
  }, []);
  
  const handleRequestChange = (itemId: string, value: number) => {
    setRequestQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));
  };
  
  const handleSubmitRequest = () => {
    // In a real app, this would send the request to a backend API
    console.log('Submitting inventory request:', requestQuantities);
    
    toast({
      title: "Inventory Request Submitted",
      description: "Your inventory request has been sent successfully.",
    });
    
    // Reset request quantities
    const resetQuantities: Record<string, number> = {};
    inventoryItems.forEach(item => {
      resetQuantities[item.id] = 0;
    });
    setRequestQuantities(resetQuantities);
    
    // Close dialog
    setIsInventoryDialogOpen(false);
  };

  return (
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

      {/* Inventory Section */}
      {!collapsed && (
        <div className="border-t border-white/20 p-4 mt-auto">
          <div className="sidebar-inventory">
            <h3 className="font-medium text-white/90 mb-2">Product Inventory</h3>
            <ul className="space-y-2 mb-4">
              {inventoryItems.slice(0, 3).map((item) => (
                <li key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.name}</span>
                  <span className="text-white/80">{item.quantity} {item.unit}</span>
                </li>
              ))}
              {inventoryItems.length > 3 && (
                <li className="text-xs text-white/60 text-center">
                  {inventoryItems.length - 3} more items...
                </li>
              )}
            </ul>
            <Button 
              className="w-full bg-white text-coffee-green hover:bg-white/90" 
              size="sm"
              onClick={() => setIsInventoryDialogOpen(true)}
            >
              Send Inventory Request
            </Button>
          </div>
        </div>
      )}
      
      {/* Collapsed Inventory Button */}
      {collapsed && (
        <div className="p-2 mt-auto border-t border-white/20">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-full h-10 border-white/30 text-white hover:bg-white/10 hover:text-white"
            onClick={() => setIsInventoryDialogOpen(true)}
          >
            <BoxIcon size={18} />
          </Button>
        </div>
      )}

      {/* Bottom section */}
      <div className="p-4">
        {!collapsed && (
          <div className="text-white/70 text-xs text-center">
            <p>ಸ್ವಾಗತ!</p>
            <p>Welcome, Admin</p>
          </div>
        )}
      </div>
      
      {/* Inventory Request Dialog */}
      <Dialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Inventory Request</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              {inventoryItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <label className="text-sm font-medium">{item.name}</label>
                  </div>
                  <div className="col-span-3 text-sm text-gray-500">
                    Current: {item.quantity} {item.unit}
                  </div>
                  <div className="col-span-4">
                    <Input 
                      type="number" 
                      min="0"
                      value={requestQuantities[item.id] || 0}
                      onChange={(e) => handleRequestChange(item.id, parseInt(e.target.value) || 0)}
                      placeholder="Requested Quantity"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInventoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitRequest}
              disabled={Object.values(requestQuantities).every(qty => qty === 0)}
            >
              Confirm Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}

export default Sidebar;

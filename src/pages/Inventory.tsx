
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import InventoryRequestsManager from '@/components/inventory/InventoryRequestsManager';
import InventoryTable from '@/components/inventory/InventoryTable';
import { useLocation } from 'react-router-dom';

const InventoryPage = () => {
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Check if we're on a franchise or brand route
  const isOwnerOrFranchiseRoute = location.pathname.includes('/franchise') || location.pathname.includes('/brand');
  
  // Handle scroll events to detect when to collapse the header
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 40);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'h-12 py-1' : 'h-auto'}`}>
          <h1 className={`font-hackney ${isScrolled ? 'text-xl' : 'text-2xl'} text-coffee-green transition-all duration-300`}>
            Inventory Management
          </h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className={`${isScrolled ? 'h-4 w-4' : 'h-5 w-5'} transition-all duration-300`} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-bisi-orange rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium hidden md:block ${isScrolled ? 'opacity-0 w-0' : ''} transition-all duration-300`}>Admin User</span>
              <Avatar className={isScrolled ? 'h-6 w-6' : 'h-8 w-8'}>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-milk-sugar overflow-y-auto pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="font-hackney text-3xl text-coffee-green mb-1">Inventory Control</h2>
              <p className="text-gray-600 text-sm">Manage and track your inventory levels</p>
            </div>

            <Tabs defaultValue={isOwnerOrFranchiseRoute ? "requests" : "inventory"} className="w-full">
              <TabsList className="mb-6 bg-white border border-gray-200">
                <TabsTrigger 
                  value="inventory" 
                  className="data-[state=active]:bg-coffee-green data-[state=active]:text-white"
                >
                  Inventory Items
                </TabsTrigger>
                {isOwnerOrFranchiseRoute && (
                  <>
                    <TabsTrigger 
                      value="requests" 
                      className="data-[state=active]:bg-coffee-green data-[state=active]:text-white"
                    >
                      Request Management
                    </TabsTrigger>
                    <TabsTrigger 
                      value="history" 
                      className="data-[state=active]:bg-coffee-green data-[state=active]:text-white"
                    >
                      Order History
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
              
              <TabsContent value="inventory">
                <InventoryTable />
              </TabsContent>
              
              {isOwnerOrFranchiseRoute && (
                <>
                  <TabsContent value="requests">
                    <InventoryRequestsManager />
                  </TabsContent>
                  <TabsContent value="history">
                    <div className="bg-white shadow rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">Order History</h3>
                      <p className="text-gray-500">View all previous order history and status updates.</p>
                      {/* Order history component would go here */}
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InventoryPage;

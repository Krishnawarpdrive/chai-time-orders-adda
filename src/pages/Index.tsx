
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerView } from '@/components/views/CustomerView';
import { ItemView } from '@/components/views/ItemView';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import NewOrderFormDialog from '@/components/NewOrderFormDialog';
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { toast } = useToast();
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  
  // Handle scroll events to detect when to collapse the header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 40);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNewOrder = () => {
    toast({
      title: "New Order",
      description: "Creating a new order...",
    });
    setIsNewOrderDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - Collapsing on scroll */}
        <header className={`bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'h-12 py-1' : 'h-auto'}`}>
          <h1 className={`font-hackney ${isScrolled ? 'text-xl' : 'text-2xl'} text-coffee-green transition-all duration-300`}>
            {isMobile ? 'Orders' : 'Staff Dashboard'}
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
        <main className="flex-1 p-6 bg-milk-sugar overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className={`mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all duration-300 ${isScrolled ? 'opacity-70 h-12 overflow-hidden' : ''}`}>
              <div>
                <h2 className="font-hackney text-3xl text-coffee-green mb-1">Orders Management</h2>
                <p className="text-gray-600 text-sm">ಬಿಸಿ ಬಿಸಿ ಆರ್ಡರ್‌ಗಳು! Manage your hot orders here.</p>
              </div>
              <Button 
                className={`mt-4 sm:mt-0 bg-bisi-orange hover:bg-bisi-orange/90 ${isScrolled ? 'h-10 text-sm' : 'h-12 text-base'}`}
                onClick={handleNewOrder}
              >
                <Plus className={`${isScrolled ? 'h-4 w-4 mr-1' : 'h-5 w-5 mr-2'}`} />
                New Order
              </Button>
            </div>

            <Tabs defaultValue="customer" className="w-full">
              <TabsList className={`mb-4 bg-white border border-gray-200 transition-all duration-300 ${isScrolled ? 'sticky top-12 z-30 h-10' : 'h-12'}`}>
                <TabsTrigger 
                  value="customer" 
                  className="data-[state=active]:bg-coffee-green data-[state=active]:text-white text-base h-full"
                >
                  Customer View
                </TabsTrigger>
                <TabsTrigger 
                  value="item" 
                  className="data-[state=active]:bg-coffee-green data-[state=active]:text-white text-base h-full"
                >
                  Item View
                </TabsTrigger>
              </TabsList>
              <TabsContent value="customer" className="mt-0">
                <CustomerView />
              </TabsContent>
              <TabsContent value="item" className="mt-0">
                <ItemView />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* New Order Dialog */}
      <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
        <DialogContent className="p-0 max-w-6xl">
          <NewOrderFormDialog onClose={() => setIsNewOrderDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

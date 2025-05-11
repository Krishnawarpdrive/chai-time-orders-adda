
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Bell, Plus, MapPin } from 'lucide-react';
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
import { Link, useLocation } from 'react-router-dom';

const Index = () => {
  const { toast } = useToast();
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [selectedPersona, setSelectedPersona] = useState('customer');
  const location = useLocation();
  const [cartItems, setCartItems] = useState(2); // Example cart count
  
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

  // Get selected persona from sidebar
  useEffect(() => {
    const handleStorageChange = () => {
      const storedPersona = localStorage.getItem('selected_persona');
      if (storedPersona) {
        setSelectedPersona(storedPersona);
      }
    };

    // Initial check
    handleStorageChange();

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleNewOrder = () => {
    toast({
      title: "New Order",
      description: "Creating a new order...",
    });
    setIsNewOrderDialogOpen(true);
  };

  const handleToggleMobileMenu = () => {
    const event = new Event('toggle-mobile-menu');
    window.dispatchEvent(event);
  };

  // Render customer mobile view based on screenshots
  if (isMobile && selectedPersona === 'customer') {
    return (
      <div className="min-h-screen bg-[#f8f3e3]">
        {/* Mobile Header for Customer */}
        <header className="bg-[#1e483c] text-white p-4 flex justify-between items-center">
          <button className="text-white" onClick={handleToggleMobileMenu}>
            <span className="sr-only">Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-center">COASTERS</h1>
          <Link to="/cart" className="relative">
            <Bell size={24} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-[#e46546] rounded-full"></span>
          </Link>
        </header>

        {/* Location Bar */}
        <div className="bg-[#e9c766] text-[#1e483c] p-4 flex items-center">
          <MapPin className="mr-2" />
          <span>37th A Cross Rd, Jaya Nagar</span>
        </div>

        {/* Main Content Area - Content varies based on current route */}
        <main className="p-4">
          {location.pathname === '/refer' ? (
            <div className="py-4">
              <h1 className="text-3xl font-bold text-[#1e483c] mb-8">YOUR REFERRALS</h1>
              
              <div className="bg-white rounded-lg border-2 border-[#e9c766] overflow-hidden mb-6">
                <div className="bg-[#f8f3e3] p-6">
                  <h2 className="text-2xl text-[#1e483c] font-bold mb-2">Your Referral Code</h2>
                  <div className="bg-white border border-gray-300 rounded p-3 text-center mb-4 text-xl">
                    COFFEE123
                  </div>
                  <Button className="w-full bg-[#e46546] hover:bg-[#d35535] text-white">
                    Share via WhatsApp
                  </Button>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-[#1e483c] mb-4">How it works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-[#1e483c] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                      <p>Share your code with friends</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-[#1e483c] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                      <p>Friend gets ₹50 off their first order</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-[#1e483c] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                      <p>You earn ₹50 after their purchase</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border-2 border-[#e9c766] overflow-hidden">
                <h3 className="bg-[#1e483c] text-white p-4 font-bold">Referral Statistics</h3>
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <span>Total Referrals</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rewards Earned</span>
                    <span className="font-bold">₹150</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Default home screen with coffee products */}
              <h1 className="text-3xl font-bold text-[#1e483c] leading-tight mb-8">
                HELLO COFFEE LOVER,<br />
                LET'S ORDER HAPPINESS!
              </h1>
              
              {/* Product Cards */}
              <div className="space-y-6">
                {/* Cappuccino */}
                <div className="bg-white rounded-lg border-2 border-[#e9c766] p-4">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-[#1e483c]">Cappuccino</h2>
                      <p className="text-[#e46546] font-bold text-xl">₹100</p>
                      <p className="text-gray-600 mt-2">
                        The perfect balance of espresso, steamed milk and foam.
                      </p>
                      <div className="flex items-center mt-4">
                        <button className="bg-[#1e483c] text-white h-10 w-10 flex items-center justify-center">-</button>
                        <div className="h-10 w-10 border border-gray-300 flex items-center justify-center">1</div>
                        <button className="bg-[#1e483c] text-white h-10 w-10 flex items-center justify-center">+</button>
                        <button className="ml-4 bg-[#e46546] text-white px-8 py-2 rounded">ADD</button>
                      </div>
                    </div>
                    <div className="w-24 h-24 rounded border border-[#e9c766]">
                      {/* Product image would go here */}
                      <div className="w-full h-full bg-gray-200"></div>
                    </div>
                  </div>
                </div>
                
                {/* Latte */}
                <div className="bg-white rounded-lg border-2 border-[#e9c766] p-4">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-[#1e483c]">Latte</h2>
                      <p className="text-[#e46546] font-bold text-xl">₹120</p>
                      <p className="text-gray-600 mt-2">
                        Smooth espresso with steamed milk and a light layer of foam.
                      </p>
                      <div className="flex items-center mt-4">
                        <button className="bg-[#1e483c] text-white h-10 w-10 flex items-center justify-center">-</button>
                        <div className="h-10 w-10 border border-gray-300 flex items-center justify-center">1</div>
                        <button className="bg-[#1e483c] text-white h-10 w-10 flex items-center justify-center">+</button>
                        <button className="ml-4 bg-[#e46546] text-white px-8 py-2 rounded">ADD</button>
                      </div>
                    </div>
                    <div className="w-24 h-24 rounded border border-[#e9c766]">
                      {/* Product image would go here */}
                      <div className="w-full h-full bg-gray-200"></div>
                    </div>
                  </div>
                </div>
                
                {/* Espresso */}
                <div className="bg-white rounded-lg border-2 border-[#e9c766] p-4">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-[#1e483c]">Espresso</h2>
                      <p className="text-[#e46546] font-bold text-xl">₹80</p>
                      <p className="text-gray-600 mt-2">
                        Strong and concentrated shot of coffee.
                      </p>
                      <div className="flex items-center mt-4">
                        <button className="bg-[#1e483c] text-white h-10 w-10 flex items-center justify-center">-</button>
                        <div className="h-10 w-10 border border-gray-300 flex items-center justify-center">1</div>
                        <button className="bg-[#1e483c] text-white h-10 w-10 flex items-center justify-center">+</button>
                        <button className="ml-4 bg-[#e46546] text-white px-8 py-2 rounded">ADD</button>
                      </div>
                    </div>
                    <div className="w-24 h-24 rounded border border-[#e9c766]">
                      {/* Product image would go here */}
                      <div className="w-full h-full bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Mobile Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1e483c] text-white px-2 py-3">
          <div className="flex justify-around items-center">
            <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-[#e9c766]' : 'text-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/orders" className={`flex flex-col items-center ${location.pathname === '/orders' ? 'text-[#e9c766]' : 'text-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="m9 14 2 2 4-4" />
              </svg>
              <span className="text-xs mt-1">Orders</span>
            </Link>
            <Link to="/refer" className={`flex flex-col items-center ${location.pathname === '/refer' ? 'text-[#e9c766]' : 'text-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
              <span className="text-xs mt-1">Refer</span>
            </Link>
            <Link to="/cart" className={`flex flex-col items-center relative ${location.pathname === '/cart' ? 'text-[#e9c766]' : 'text-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e46546] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems}
                </span>
              )}
              <span className="text-xs mt-1">Cart</span>
            </Link>
          </div>
        </nav>
      </div>
    );
  }

  // Original staff dashboard view
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

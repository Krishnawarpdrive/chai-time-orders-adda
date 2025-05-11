
import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const Refer = () => {
  const isMobile = useIsMobile();
  const [selectedPersona, setSelectedPersona] = useState('customer');
  const navigate = useNavigate();
  
  // Get selected persona from local storage
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

  const shareCode = () => {
    // In a real app, this would use the Web Share API or create a deep link for WhatsApp
    alert("Sharing referral code via WhatsApp!");
  };

  const handleToggleMobileMenu = () => {
    const event = new Event('toggle-mobile-menu');
    window.dispatchEvent(event);
  };

  // Customer mobile view
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="absolute top-0 right-0 h-2 w-2 bg-[#e46546] rounded-full"></span>
          </Link>
        </header>

        <main className="p-4 pb-24"> {/* Add padding at bottom for mobile nav */}
          <h1 className="text-3xl font-bold text-[#1e483c] mb-8">YOUR REFERRALS</h1>
          
          <div className="bg-white rounded-lg border-2 border-[#e9c766] overflow-hidden mb-6">
            <div className="bg-[#f8f3e3] p-6">
              <h2 className="text-2xl text-[#1e483c] font-bold mb-2">Your Referral Code</h2>
              <div className="bg-white border border-gray-300 rounded p-3 text-center mb-4 text-xl font-bold">
                COFFEE123
              </div>
              <Button 
                className="w-full bg-[#e46546] hover:bg-[#d35535] text-white flex items-center justify-center gap-2"
                onClick={shareCode}
              >
                <Share2 size={18} />
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
        </main>

        {/* Mobile Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1e483c] text-white px-2 py-3">
          <div className="flex justify-around items-center">
            <Link to="/" className="flex flex-col items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/orders" className="flex flex-col items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="m9 14 2 2 4-4" />
              </svg>
              <span className="text-xs mt-1">Orders</span>
            </Link>
            <Link to="/refer" className="flex flex-col items-center text-[#e9c766]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
              <span className="text-xs mt-1">Refer</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center relative text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#e46546] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                2
              </span>
              <span className="text-xs mt-1">Cart</span>
            </Link>
          </div>
        </nav>
      </div>
    );
  }
  
  // Desktop view for other personas
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Refer & Earn Program</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Referral System</h2>
          <p className="mb-4">
            This is the desktop view of the referral system. When using the Customer persona on mobile,
            you'll see a mobile-optimized view that matches the provided design.
          </p>
          
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h3 className="font-medium">Your Referral Code</h3>
            <div className="bg-white border border-gray-300 rounded p-3 text-center my-2 font-bold">
              COFFEE123
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Referral Statistics</h3>
            <div className="flex justify-between border-b pb-2">
              <span>Total Referrals</span>
              <span className="font-bold">3</span>
            </div>
            <div className="flex justify-between pt-2">
              <span>Rewards Earned</span>
              <span className="font-bold">₹150</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refer;

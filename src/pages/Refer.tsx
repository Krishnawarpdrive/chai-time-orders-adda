
import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Refer = () => {
  const isMobile = useIsMobile();
  const [selectedPersona, setSelectedPersona] = useState('customer');
  
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

  // Customer mobile view
  if (isMobile && selectedPersona === 'customer') {
    return (
      <div className="min-h-screen bg-[#f8f3e3]">
        {/* Mobile Header for Customer */}
        <header className="bg-[#1e483c] text-white p-4 flex justify-between items-center">
          <button className="text-white" onClick={() => window.history.back()}>
            <span className="sr-only">Back</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-center">COASTERS</h1>
          <div className="w-8"></div> {/* Empty div for spacing */}
        </header>

        <main className="p-4">
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

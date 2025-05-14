
import React from 'react';
import { MapPin, Bell, Menu } from 'lucide-react';

interface CustomerHeaderProps {
  toggleMenu: () => void;
  notificationCount: number;
}

const CustomerHeader = ({ toggleMenu, notificationCount }: CustomerHeaderProps) => {
  return (
    <>
      {/* Header */}
      <header className="bg-[#1e483c] text-white p-4 flex justify-between items-center">
        <button onClick={toggleMenu} className="text-white">
          <Menu size={28} />
        </button>
        <h1 className="text-3xl font-bold tracking-wider">COASTERS</h1>
        <div className="relative">
          <Bell size={28} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#e46546] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
      </header>

      {/* Location Bar */}
      <div className="bg-[#e9c766] p-4 flex items-center">
        <MapPin className="text-[#1e483c] mr-2" size={24} />
        <span className="text-[#1e483c] text-lg">37th A Cross Rd, Jaya Nagar</span>
      </div>
    </>
  );
};

export default CustomerHeader;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Menu, Bell, Edit3 } from 'lucide-react';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Mock user data
  const userData = {
    name: 'Coffee Lover',
    email: 'user@example.com',
    phone: '6382529928',
    memberSince: 'June 2023'
  };

  return (
    <div className="bg-[#f5f3e7] min-h-screen">
      {/* Header */}
      <header className="bg-[#1e483c] text-white p-4 flex justify-between items-center">
        <button onClick={toggleMenu} className="text-white">
          <Menu size={28} />
        </button>
        <h1 className="text-3xl font-bold tracking-wider">COASTERS</h1>
        <div className="relative">
          <Bell size={28} />
          <span className="absolute -top-1 -right-1 bg-[#e46546] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            1
          </span>
        </div>
      </header>

      {/* Location Bar */}
      <div className="bg-[#e9c766] p-4 flex items-center">
        <MapPin className="text-[#1e483c] mr-2" size={24} />
        <span className="text-[#1e483c] text-lg">37th A Cross Rd, Jaya Nagar</span>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <h2 className="text-4xl font-bold text-[#1e483c] mb-6">YOUR PROFILE</h2>
        
        <div 
          className="border-2 border-[#e9c766] rounded-lg bg-white p-6 mb-6"
          style={{
            borderStyle: 'solid',
            borderWidth: '1px',
            borderImage: 'repeating-linear-gradient(45deg, #e9c766, #e9c766 10px, transparent 10px, transparent 20px) 1'
          }}
        >
          {/* User Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-[#1e483c]" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /></svg>
            </div>
          </div>
          
          {/* User Name and Email */}
          <h3 className="text-3xl font-bold text-center mb-1">{userData.name}</h3>
          <p className="text-gray-500 text-center text-lg mb-8">{userData.email}</p>
          
          {/* User Details */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <span className="text-xl text-gray-500">Phone</span>
              <span className="text-xl">{userData.phone}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <span className="text-xl text-gray-500">Email</span>
              <span className="text-xl">{userData.email}</span>
            </div>
            
            <div className="flex justify-between items-center pb-4">
              <span className="text-xl text-gray-500">Member Since</span>
              <span className="text-xl">{userData.memberSince}</span>
            </div>
          </div>
        </div>
        
        {/* Edit Profile Button */}
        <button 
          className="w-full border-2 border-[#1e483c] rounded-lg p-4 flex items-center justify-center text-[#1e483c] text-xl mb-6"
        >
          <Edit3 size={24} className="mr-2" />
          Edit Profile
        </button>
        
        {/* Logout Button */}
        <button 
          className="w-full bg-[#e46546] rounded-lg p-4 text-white text-xl"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Overlay - same as in Home */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#1e483c] text-white z-50 flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-white/20">
            <div className="text-2xl font-bold">Menu</div>
            <button onClick={toggleMenu} className="text-white p-2">
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <ul className="py-4 flex-1">
            <li className="px-4 py-3">
              <Link to="/" className="flex items-center text-xl" onClick={toggleMenu}>
                <Menu className="mr-4 h-6 w-6" />
                <span>Home</span>
              </Link>
            </li>
            <li className="px-4 py-3">
              <Link to="/profile" className="flex items-center text-xl" onClick={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /></svg>
                <span>Profile</span>
              </Link>
            </li>
            <li className="px-4 py-3">
              <Link to="/orders" className="flex items-center text-xl" onClick={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" /><path d="m9 14 2 2 4-4" /></svg>
                <span>Orders</span>
              </Link>
            </li>
            <li className="px-4 py-3">
              <Link to="/refer" className="flex items-center text-xl" onClick={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
                <span>Refer & Earn</span>
              </Link>
            </li>
          </ul>

          <div className="p-4 border-t border-white/20">
            <Link to="/cart" className="flex items-center text-xl" onClick={toggleMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              <span>My Cart</span>
            </Link>
          </div>

          <div className="p-4 border-t border-white/20">
            <button className="flex items-center text-xl text-white w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;

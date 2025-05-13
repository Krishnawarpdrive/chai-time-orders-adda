
import React, { useState, useEffect } from 'react';
import { MapPin, ShoppingCart, Menu, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import CoffeeCard from '@/components/CoffeeCard';

// Mock data for menu items
const menuItems = [
  {
    id: '1',
    name: 'Cappuccino',
    price: 100,
    description: 'The perfect balance of espresso, steamed milk and foam.',
    category: 'coffee',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Latte',
    price: 120,
    description: 'Smooth espresso with steamed milk and a light layer of foam.',
    category: 'coffee',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Espresso',
    price: 80,
    description: 'Strong and concentrated shot of pure coffee.',
    category: 'coffee',
    image: '/placeholder.svg'
  }
];

const CustomerHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{id: string, quantity: number}[]>([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const addToCart = (itemId: string) => {
    const existingItem = cartItems.find(item => item.id === itemId);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { id: itemId, quantity: 1 }]);
    }
  };
  
  const decreaseQuantity = (itemId: string) => {
    const existingItem = cartItems.find(item => item.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    } else {
      setCartItems(cartItems.filter(item => item.id !== itemId));
    }
  };

  const getQuantityInCart = (itemId: string) => {
    const item = cartItems.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="bg-[#f5f3e7] min-h-screen relative">
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

      {/* Hero Text */}
      <div className="p-6">
        <h2 className="text-4xl font-bold text-[#1e483c] leading-tight">
          HELLO COFFEE LOVER,<br />
          LET'S ORDER HAPPINESS!
        </h2>
      </div>

      {/* Menu Items */}
      <div className="px-4 pb-24">
        {menuItems.map((item) => (
          <CoffeeCard key={item.id} coffee={item} />
        ))}
      </div>

      {/* Mobile Menu Overlay */}
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
              <ShoppingCart className="mr-4 h-6 w-6" />
              <span>My Cart</span>
              {cartItems.length > 0 && (
                <span className="ml-auto bg-[#e46546] text-white text-xs px-2 py-1 rounded-full">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
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

      {/* Cart Button - Fixed at bottom */}
      <Link 
        to="/cart" 
        className="fixed bottom-5 right-5 bg-[#e46546] text-white p-3 rounded-full shadow-lg z-10"
      >
        <div className="relative">
          <ShoppingCart size={28} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-[#e46546] text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default CustomerHome;


import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu } from 'lucide-react';

interface SideMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  cartItems: {id: string, quantity: number}[];
}

const SideMenu = ({ isMenuOpen, toggleMenu, cartItems }: SideMenuProps) => {
  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  if (!isMenuOpen) return null;
  
  return (
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
          {totalCartItems > 0 && (
            <span className="ml-auto bg-[#e46546] text-white text-xs px-2 py-1 rounded-full">
              {totalCartItems}
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
  );
};

export default SideMenu;


import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import CustomerHeader from '@/components/customer/CustomerHeader';
import HeroSection from '@/components/customer/HeroSection';
import MenuSection from '@/components/customer/MenuSection';
import SideMenu from '@/components/customer/SideMenu';
import CartButton from '@/components/customer/CartButton';

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
  const { items: cartItems } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-[#f5f3e7] min-h-screen relative">
      {/* Header Components */}
      <CustomerHeader toggleMenu={toggleMenu} notificationCount={1} />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Menu Items */}
      <MenuSection menuItems={menuItems} />
      
      {/* Mobile Menu Overlay */}
      <SideMenu 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
        cartItems={cartItems.map(item => ({ id: item.id, quantity: item.quantity }))} 
      />

      {/* Cart Button - Fixed at bottom */}
      <CartButton 
        cartItems={cartItems.map(item => ({ id: item.id, quantity: item.quantity }))} 
      />
    </div>
  );
};

export default CustomerHome;

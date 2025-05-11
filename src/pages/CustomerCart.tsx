
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Menu, Bell, Trash2, Plus, Minus } from 'lucide-react';
import { MenuItem } from '@/types/supabase';

interface CartItem extends MenuItem {
  quantity: number;
}

const CustomerCart = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Cappuccino',
      price: 100,
      category: 'coffee',
      quantity: 2
    },
    {
      id: '2',
      name: 'Latte',
      price: 120,
      category: 'coffee',
      quantity: 1
    }
  ]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleIncreaseQuantity = (itemId: string) => {
    setCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId: string) => {
    setCart(
      cart.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter((item) => !(item.id === itemId && item.quantity === 1))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Mock discount
  const discount = 0;
  const total = subtotal - discount;

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

      {/* Cart Content */}
      <div className="p-6 pb-32">
        <h2 className="text-4xl font-bold text-[#1e483c] mb-6">YOUR CART</h2>
        
        {cart.length > 0 ? (
          <>
            {/* Cart Items */}
            <div className="mb-8">
              {cart.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white p-4 rounded-lg mb-4 shadow-sm flex items-center"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-medium">{item.name}</h3>
                    <p className="text-[#e46546] font-bold">₹{item.price}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleDecreaseQuantity(item.id)}
                      className="bg-gray-100 h-8 w-8 flex items-center justify-center rounded-l"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="bg-gray-100 h-8 px-4 flex items-center justify-center text-lg">
                      {item.quantity}
                    </div>
                    <button 
                      onClick={() => handleIncreaseQuantity(item.id)}
                      className="bg-gray-100 h-8 w-8 flex items-center justify-center rounded-r"
                    >
                      <Plus size={16} />
                    </button>
                    
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-4 text-gray-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cart Summary */}
            <div 
              className="border-2 border-[#e9c766] rounded-lg bg-white p-6"
              style={{
                borderStyle: 'solid',
                borderWidth: '1px',
                borderImage: 'repeating-linear-gradient(45deg, #e9c766, #e9c766 10px, transparent 10px, transparent 20px) 1'
              }}
            >
              <h3 className="text-xl font-medium mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                
                <div className="flex justify-between border-t border-dashed border-gray-300 pt-3">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-[#1e483c]">₹{total}</span>
                </div>
              </div>
              
              <button className="bg-[#e46546] text-white w-full py-3 rounded text-lg font-medium">
                Proceed to Checkout
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-2xl text-gray-400 mb-2">Your cart is empty</p>
            <p className="text-gray-500 mb-6">Add items to get started</p>
            <Link
              to="/"
              className="bg-[#1e483c] text-white px-6 py-2 rounded inline-block"
            >
              Browse Menu
            </Link>
          </div>
        )}
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

export default CustomerCart;

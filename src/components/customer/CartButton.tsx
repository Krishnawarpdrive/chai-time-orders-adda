
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface CartButtonProps {
  cartItems: {id: string, quantity: number}[];
}

const CartButton = ({ cartItems }: CartButtonProps) => {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  return (
    <Link 
      to="/cart" 
      className="fixed bottom-5 right-5 bg-[#e46546] text-white p-3 rounded-full shadow-lg z-10"
    >
      <div className="relative">
        <ShoppingCart size={28} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-[#e46546] text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CartButton;

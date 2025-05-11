
import React from 'react';
import { Coffee, Cookie, Leaf } from 'lucide-react';
import { MenuItem } from '@/types/supabase';

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartSummaryProps {
  cart: CartItem[];
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
  // Get the appropriate icon based on item category
  const getItemIcon = (category: string) => {
    switch (category) {
      case 'coffee':
        return <Coffee className="w-5 h-5 text-coffee-green" />;
      case 'tea':
        return <Leaf className="w-5 h-5 text-coffee-green" />;
      case 'snack':
        return <Cookie className="w-5 h-5 text-bisi-orange" />;
      default:
        return <Coffee className="w-5 h-5 text-coffee-green" />;
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="p-6 border-t">
      <h3 className="text-lg font-medium text-coffee-green mb-4">Your Order</h3>
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2 last:mb-0">
            <div className="flex items-center gap-2">
              {getItemIcon(item.category)}
              <span>{item.name}</span>
              <span className="text-gray-500">× {item.quantity}</span>
            </div>
            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartSummary;


import React from 'react';
import { MenuItem } from '@/types/supabase';

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartSummaryProps {
  cart: CartItem[];
  discountAmount?: number;
  subtotalPrice?: number;
  totalPrice?: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  cart, 
  discountAmount = 0, 
  subtotalPrice, 
  totalPrice 
}) => {
  // Calculate values if not provided
  const calculatedSubtotal = subtotalPrice ?? cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  const calculatedTotal = totalPrice ?? Math.max(0, calculatedSubtotal - discountAmount);
  
  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center border-t">
        <p className="text-gray-500">Your cart is empty</p>
        <p className="text-sm text-gray-400 mt-2">Add items from the menu above</p>
      </div>
    );
  }

  return (
    <div className="p-6 border-t">
      <h3 className="text-lg font-medium text-coffee-green mb-4">Your Order</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-3 last:mb-0">
            <div className="flex items-center gap-2">
              <span>{item.name}</span>
              <span className="text-gray-500">× {item.quantity}</span>
            </div>
            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        
        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>{formatPrice(calculatedSubtotal)}</span>
          </div>
          
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount:</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          
          <div className="flex justify-between mt-2 font-bold text-coffee-green text-lg">
            <span>Total:</span>
            <span>{formatPrice(calculatedTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

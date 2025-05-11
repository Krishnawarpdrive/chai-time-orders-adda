
import { MenuItem } from '@/types/supabase';
import { Coffee, Cookie, Leaf } from 'lucide-react';
import React from 'react';

// Get the appropriate icon based on item category
export const getItemIcon = (category: string): React.ReactNode => {
  switch (category) {
    case 'coffee':
      return React.createElement(Coffee, { className: "w-5 h-5 text-coffee-green" });
    case 'tea':
      return React.createElement(Leaf, { className: "w-5 h-5 text-coffee-green" });
    case 'snack':
      return React.createElement(Cookie, { className: "w-5 h-5 text-bisi-orange" });
    default:
      return React.createElement(Coffee, { className: "w-5 h-5 text-coffee-green" });
  }
};

// Format price
export const formatPrice = (price: number) => {
  return `₹${price.toFixed(2)}`;
};

// Generate order ID from customer name and phone number
export const generateOrderId = (customerName: string, phoneNumber: string) => {
  if (customerName.length < 2 || phoneNumber.length < 2) return '';
  
  const namePrefix = customerName.substring(0, 2).toUpperCase();
  const phoneSuffix = phoneNumber.substring(phoneNumber.length - 2);
  
  return `${namePrefix}${phoneSuffix}-${new Date().getTime().toString().slice(-4)}`;
};

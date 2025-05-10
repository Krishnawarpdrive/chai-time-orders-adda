
import React from 'react';
import { OrderItem } from '@/lib/data';

interface OrderItemsListProps {
  items: OrderItem[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  return (
    <div className="py-3 px-4 bg-milk-sugar/30 rounded-md border border-gray-200 mt-2 mb-3 animate-fade-in">
      <h4 className="text-sm font-medium text-coffee-green mb-2">Order Items</h4>
      <div className="max-h-48 overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="text-left pb-1 pl-1">Item</th>
              <th className="text-center pb-1">Quantity</th>
              <th className="text-right pb-1 pr-1">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 last:border-0">
                <td className="py-2 pl-1">{item.name}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right pr-1">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-medium text-coffee-green">
              <td className="pt-2 pl-1">Total</td>
              <td className="pt-2 text-center">{items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
              <td className="pt-2 text-right pr-1">{formatPrice(items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default OrderItemsList;

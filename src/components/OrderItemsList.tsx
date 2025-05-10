
import React from 'react';
import { OrderItem } from '@/lib/data';
import { Coffee, Cookie, Leaf, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderItemsListProps {
  items: OrderItem[];
}

type ItemStatus = 'preparing' | 'picked' | 'delivered';

// Extended OrderItem with status field for the UI
interface OrderItemWithStatus extends OrderItem {
  status: ItemStatus;
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  // Get the appropriate icon based on item name
  const getItemIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('coffee')) {
      return <Coffee className="w-4 h-4 text-coffee-green" />;
    } else if (lowercaseName.includes('biscuit')) {
      return <Cookie className="w-4 h-4 text-bisi-orange" />;
    } else if (lowercaseName.includes('tea') || lowercaseName.includes('chai')) {
      return <Leaf className="w-4 h-4 text-coffee-green" />;
    }
    return null;
  };

  // Add mock status to items - in a real app, this would come from the API
  const itemsWithStatus: OrderItemWithStatus[] = items.map((item, index) => {
    // Assign different statuses based on index for demonstration
    let status: ItemStatus;
    if (index % 3 === 0) {
      status = 'delivered';
    } else if (index % 3 === 1) {
      status = 'picked';
    } else {
      status = 'preparing';
    }

    return {
      ...item,
      status
    };
  });

  // Get status badge component
  const getStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case 'preparing':
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Preparing</span>;
      case 'picked':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Picked</span>;
      case 'delivered':
        return <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
          <Check className="w-3 h-3" />
          Delivered
        </span>;
      default:
        return null;
    }
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
              <th className="text-center pb-1">Status</th>
              <th className="text-right pb-1 pr-1">Price</th>
            </tr>
          </thead>
          <tbody>
            {itemsWithStatus.map((item) => (
              <tr 
                key={item.id} 
                className={cn(
                  "border-b border-gray-100 last:border-0",
                  item.status === 'delivered' ? "opacity-60" : ""
                )}
              >
                <td className="py-2 pl-1 flex items-center">
                  <span className="mr-2">{getItemIcon(item.name)}</span>
                  {item.name}
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-center">{getStatusBadge(item.status)}</td>
                <td className="py-2 text-right pr-1">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-medium text-coffee-green">
              <td className="pt-2 pl-1">Total</td>
              <td className="pt-2 text-center">{itemsWithStatus.reduce((sum, item) => sum + item.quantity, 0)} items</td>
              <td className="pt-2 text-center"></td>
              <td className="pt-2 text-right pr-1">{formatPrice(itemsWithStatus.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default OrderItemsList;

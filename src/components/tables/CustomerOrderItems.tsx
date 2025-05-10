
import React, { useState } from 'react';
import { OrderItem } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Coffee, Cookie, Leaf, Play, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ItemStatus = 'Not Started' | 'Started' | 'Finished' | 'Ready for Hand Over';

interface CustomerOrderItemsProps {
  items: OrderItem[];
  orderId: string;
  customerName: string;
  onStatusChange: (orderId: string, itemId: number, newStatus: ItemStatus) => void;
}

interface OrderItemWithStatus extends OrderItem {
  status: ItemStatus;
}

const CustomerOrderItems = ({ items, orderId, customerName, onStatusChange }: CustomerOrderItemsProps) => {
  // Add mock status for each item
  const [itemsWithStatus, setItemsWithStatus] = useState<OrderItemWithStatus[]>(
    items.map(item => ({ ...item, status: 'Not Started' }))
  );

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  // Update the status of an item
  const updateItemStatus = (itemId: number, newStatus: ItemStatus) => {
    setItemsWithStatus(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
    onStatusChange(orderId, itemId, newStatus);
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

  // Get status badge component
  const getStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case 'Not Started':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Not Started</span>;
      case 'Started':
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">In Progress</span>;
      case 'Finished':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Finished</span>;
      case 'Ready for Hand Over':
        return <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">Ready for Hand Over</span>;
      default:
        return null;
    }
  };

  // Get appropriate actions based on status
  const getActions = (item: OrderItemWithStatus) => {
    switch (item.status) {
      case 'Not Started':
        return (
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs py-1 h-7"
            onClick={() => updateItemStatus(item.id, 'Started')}
          >
            <Play className="h-3 w-3 mr-1" />
            Start Making
          </Button>
        );
      case 'Started':
        return (
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs py-1 h-7"
            onClick={() => updateItemStatus(item.id, 'Finished')}
          >
            <Check className="h-3 w-3 mr-1" />
            Finish Making
          </Button>
        );
      case 'Finished':
        return (
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs py-1 h-7 bg-green-50"
            onClick={() => updateItemStatus(item.id, 'Ready for Hand Over')}
          >
            <ArrowRight className="h-3 w-3 mr-1" />
            Hand Over
          </Button>
        );
      case 'Ready for Hand Over':
        return (
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-xs py-1 h-7 text-green-800 bg-green-100"
            disabled
          >
            <Check className="h-3 w-3 mr-1" />
            Handed Over
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-2 px-4 bg-white rounded-md border border-gray-200 mt-2 mb-2 animate-fade-in">
      <h4 className="text-sm font-medium text-coffee-green mb-2">Order Details</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="text-left pb-1 pl-1">Item</th>
              <th className="text-left pb-1">Customer</th>
              <th className="text-center pb-1">Quantity</th>
              <th className="text-center pb-1">Status</th>
              <th className="text-right pb-1 pr-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemsWithStatus.map((item) => (
              <tr 
                key={item.id} 
                className={cn(
                  "border-b border-gray-100 last:border-0",
                  item.status === 'Ready for Hand Over' ? "bg-green-50" : ""
                )}
              >
                <td className="py-2 pl-1 flex items-center">
                  <span className="mr-2">{getItemIcon(item.name)}</span>
                  {item.name}
                </td>
                <td className="py-2">{customerName}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-center">{getStatusBadge(item.status)}</td>
                <td className="py-2 text-right pr-1">{getActions(item)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-medium text-coffee-green">
              <td className="pt-2 pl-1">Total</td>
              <td className="pt-2"></td>
              <td className="pt-2 text-center">{itemsWithStatus.reduce((sum, item) => sum + item.quantity, 0)} items</td>
              <td className="pt-2"></td>
              <td className="pt-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CustomerOrderItems;

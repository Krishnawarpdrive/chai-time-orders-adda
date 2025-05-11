
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Coffee, Cookie, Leaf, Play, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ItemStatus = 'Not Started' | 'Started' | 'Finished' | 'Ready for Hand Over';
interface OrderItem {
  id: string;
  item_id: string;
  quantity: number;
  status: ItemStatus;
  item?: {
    name: string;
    price: number;
    category: string;
  };
}

interface CustomerOrderItemsProps {
  items: OrderItem[];
  orderId: string;
  customerName: string;
  onStatusChange: (orderId: string, itemId: string, newStatus: ItemStatus) => void;
}

const CustomerOrderItems = ({
  items,
  orderId,
  customerName,
  onStatusChange
}: CustomerOrderItemsProps) => {
  const [itemsWithStatus, setItemsWithStatus] = useState<OrderItem[]>(items);

  // Update items when props change
  useEffect(() => {
    setItemsWithStatus(items);
  }, [items]);

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

  return (
    <div className="py-2 px-4 bg-white rounded-md border border-gray-200 mt-2 mb-2 animate-fade-in">
      <h4 className="text-sm font-medium text-coffee-green mb-2">Order Details</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="text-left pb-1 pl-1">Item</th>
              <th className="text-center pb-1">Quantity</th>
              <th className="text-center pb-1">Status</th>
              <th className="text-right pb-1 pr-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemsWithStatus.map(item => (
              <tr key={item.id} className={cn(
                "border-b border-gray-100 last:border-0", 
                item.status === 'Ready for Hand Over' ? "bg-green-50" : "")
              }>
                <td className="py-2 pl-1 flex items-center">
                  <span className="mr-2">{getItemIcon(item.item?.name || '')}</span>
                  {item.item?.name || 'Unknown Item'}
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-center">{getStatusBadge(item.status)}</td>
                <td className="py-2 text-right pr-1">
                  <div className="flex justify-end gap-2">
                    <Button 
                      onClick={() => onStatusChange(orderId, item.id, 'Started')} 
                      disabled={item.status !== 'Not Started' && item.status !== 'Started'} 
                      className="h-8 px-2 font-medium bg-bisi-orange text-white hover:bg-bisi-orange/90 text-sm"
                    >
                      <Play className="h-3 w-3 mr-1" /> Start
                    </Button>
                    
                    <Button 
                      onClick={() => onStatusChange(orderId, item.id, 'Finished')} 
                      className="h-8 px-2 font-medium bg-coffee-green text-white hover:bg-coffee-green/90 text-sm" 
                      disabled={item.status === 'Not Started' || item.status === 'Ready for Hand Over'}
                    >
                      <Check className="h-3 w-3 mr-1" /> Finish
                    </Button>
                    
                    <Button 
                      onClick={() => onStatusChange(orderId, item.id, 'Ready for Hand Over')} 
                      className="h-8 px-2 font-medium bg-milk-sugar text-coffee-green hover:bg-milk-sugar/90 text-sm" 
                      disabled={item.status !== 'Finished' && item.status !== 'Ready for Hand Over'}
                    >
                      <ArrowRight className="h-3 w-3 mr-1" /> Hand Over
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-medium text-coffee-green">
              <td className="pt-2 pl-1">Total</td>
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

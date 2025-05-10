
import React, { useState } from 'react';
import { OrderItem } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Play, Check, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Coffee, Cookie, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

type ItemStatus = 'Not Started' | 'Started' | 'Finished' | 'Ready for Hand Over';

interface OrderItemWithStatus extends OrderItem {
  status: ItemStatus;
}

interface CustomerOrderDetailsProps {
  customerName: string;
  phoneNumber: string;
  dob: string;
  items: OrderItem[];
  orderId: string;
  onStatusChange: (orderId: string, itemId: number, newStatus: ItemStatus) => void;
  onClose?: () => void;
}

const CustomerOrderDetails = ({ 
  customerName, 
  phoneNumber, 
  dob, 
  items, 
  orderId,
  onStatusChange,
  onClose 
}: CustomerOrderDetailsProps) => {
  // Initialize items with status
  const [itemsWithStatus, setItemsWithStatus] = useState<OrderItemWithStatus[]>(
    items.map(item => ({ ...item, status: 'Not Started' }))
  );

  // Get the appropriate icon based on item name
  const getItemIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('coffee')) {
      return <Coffee className="w-5 h-5 text-coffee-green" />;
    } else if (lowercaseName.includes('biscuit') || lowercaseName.includes('chai')) {
      return <Cookie className="w-5 h-5 text-bisi-orange" />;
    } else if (lowercaseName.includes('tea')) {
      return <Leaf className="w-5 h-5 text-coffee-green" />;
    }
    return <Coffee className="w-5 h-5 text-coffee-green" />;
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

  // Calculate total price
  const totalPrice = itemsWithStatus.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-auto overflow-y-auto max-h-[90vh]">
      {/* Header */}
      <div className="bg-milk-sugar p-6 border-b">
        <h2 className="font-hackney text-2xl text-coffee-green mb-2">
          Hello {customerName}, Let's Order Happiness!
        </h2>
        
        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
          <div>
            <p className="text-gray-500">Customer Name</p>
            <p className="font-medium">{customerName}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone Number</p>
            <p className="font-medium">{phoneNumber}</p>
          </div>
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-medium">{dob}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-coffee-green mb-4">Order Items</h3>
        
        <div className="space-y-4">
          {itemsWithStatus.map((item) => (
            <Card key={item.id} className={cn(
              "border border-gray-200", 
              item.status === 'Ready for Hand Over' ? "bg-green-50" : ""
            )}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    {getItemIcon(item.name)}
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </div>
                  <span className="font-bold">{formatPrice(item.price)}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-600 mb-1">Quantity: {item.quantity}</p>
                <p className="text-gray-600 text-sm">
                  {item.name.includes('Coffee') ? 'Freshly brewed coffee with strong flavors.' :
                    item.name.includes('Chai') ? 'A warm cup of spiced tea, perfect for any time of the day.' :
                    'The perfect balance of taste and quality.'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-medium">Status:</span>
                  {item.status === 'Not Started' && <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Not Started</span>}
                  {item.status === 'Started' && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">In Progress</span>}
                  {item.status === 'Finished' && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Finished</span>}
                  {item.status === 'Ready for Hand Over' && <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">Ready for Hand Over</span>}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex flex-wrap gap-2">
                <Button
                  onClick={() => updateItemStatus(item.id, 'Started')}
                  className="h-12 font-medium bg-bisi-orange text-white hover:bg-bisi-orange/90"
                  disabled={item.status !== 'Not Started' && item.status !== 'Started'}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start Making
                </Button>
                
                <Button
                  onClick={() => updateItemStatus(item.id, 'Finished')}
                  className="h-12 font-medium bg-coffee-green text-white hover:bg-coffee-green/90"
                  disabled={item.status === 'Not Started' || item.status === 'Ready for Hand Over'}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Finish Making
                </Button>
                
                <Button
                  onClick={() => updateItemStatus(item.id, 'Ready for Hand Over')}
                  className="h-12 font-medium bg-milk-sugar text-coffee-green hover:bg-milk-sugar/90"
                  disabled={item.status !== 'Finished' && item.status !== 'Ready for Hand Over'}
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Hand Over
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total Price:</span>
          <span className="text-xl font-bold text-coffee-green">{formatPrice(totalPrice)}</span>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            className="px-6"
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            className="bg-bisi-orange hover:bg-bisi-orange/90 px-6"
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDetails;

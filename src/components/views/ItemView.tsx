
import React, { useState, useMemo } from 'react';
import { orderData } from '@/lib/data';
import ItemOrdersTable from '@/components/tables/ItemOrdersTable';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const ItemView = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Transform order data to item-based view
  const itemBasedData = useMemo(() => {
    // Create a map to group items
    const itemMap = new Map();
    
    orderData.forEach(order => {
      order.items.forEach(item => {
        const existingItem = itemMap.get(item.name);
        
        if (existingItem) {
          // Update existing item
          existingItem.totalQuantity += item.quantity;
          existingItem.orders.push({
            orderId: order.orderId,
            customerId: order.id,
            customerName: order.customer,
            quantity: item.quantity,
            status: 'Not Started', // Default status
            itemId: item.id
          });
        } else {
          // Create new item
          itemMap.set(item.name, {
            id: item.id,
            name: item.name,
            totalQuantity: item.quantity,
            status: 'Not Started', // Default status
            orders: [{
              orderId: order.orderId,
              customerId: order.id,
              customerName: order.customer,
              quantity: item.quantity,
              status: 'Not Started', // Default status
              itemId: item.id
            }]
          });
        }
      });
    });
    
    return Array.from(itemMap.values());
  }, []);

  // Filter items based on search
  const filteredItems = itemBasedData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search items..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ItemOrdersTable items={filteredItems} />
    </div>
  );
};

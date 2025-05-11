
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Play, Check, ArrowRight, Coffee, Cookie, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { orderService } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card } from '@/components/ui/card';

// Status types
type ItemStatus = 'Not Started' | 'Started' | 'Finished' | 'Ready for Hand Over';
type CustomerOrderStatus = 'Not Started' | 'Started' | 'Finished' | 'Handed Over';

// Item interface
interface ItemOrder {
  orderId: string;
  customerId: string;
  customerName: string;
  quantity: number;
  status: CustomerOrderStatus;
  itemId: string;
}

interface ItemData {
  id: string;
  name: string;
  totalQuantity: number;
  status: ItemStatus;
  orders: ItemOrder[];
}

interface ItemOrdersTableProps {
  items: ItemData[];
  loading: boolean;
}

const ItemOrdersTable = ({ items, loading }: ItemOrdersTableProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [itemsData, setItemsData] = useState<ItemData[]>(items);
  const { toast } = useToast();

  // Update items when props change
  React.useEffect(() => {
    setItemsData(items);
  }, [items]);

  // Toggle item expansion
  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Check if item is expanded
  const isItemExpanded = (itemId: string) => {
    return expandedItems.includes(itemId);
  };

  // Get the appropriate icon based on item name
  const getItemIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('coffee')) {
      return <Coffee className="w-5 h-5 text-coffee-green" />;
    } else if (lowercaseName.includes('biscuit')) {
      return <Cookie className="w-5 h-5 text-bisi-orange" />;
    } else if (lowercaseName.includes('tea') || lowercaseName.includes('chai')) {
      return <Leaf className="w-5 h-5 text-coffee-green" />;
    }
    return null;
  };

  // Update the overall status of an item
  const updateItemStatus = async (itemId: string, status: ItemStatus) => {
    try {
      // Find all order items for this item
      const item = itemsData.find(i => i.id === itemId);
      if (!item) return;
      
      // Update status for all order items
      for (const order of item.orders) {
        await orderService.updateOrderItemStatus(order.itemId, status);
      }
      
      // Update local state
      setItemsData(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, status } : item
        )
      );
      
      toast({
        title: "Status Updated",
        description: `All ${item.name} items status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating item status:", error);
      toast({
        title: "Error",
        description: "Failed to update item status.",
        variant: "destructive"
      });
    }
  };

  // Update the status of a specific customer order
  const updateCustomerOrderStatus = async (itemId: string, orderId: string, newStatus: CustomerOrderStatus) => {
    try {
      // Find the specific order item
      const item = itemsData.find(i => i.id === itemId);
      if (!item) return;
      
      const order = item.orders.find(o => o.orderId === orderId);
      if (!order) return;
      
      await orderService.updateOrderItemStatus(order.itemId, newStatus);
      
      // Update local state
      setItemsData(prev => 
        prev.map(item => {
          if (item.id === itemId) {
            const updatedOrders = item.orders.map(order => 
              order.orderId === orderId ? { ...order, status: newStatus } : order
            );
            return { ...item, orders: updatedOrders };
          }
          return item;
        })
      );
      
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating customer order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <Card className="bg-white shadow rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemsData.map((item) => (
            <React.Fragment key={item.id}>
              <TableRow className={cn("hover-row", isItemExpanded(item.id) ? "bg-milk-sugar/20" : "")}>
                <TableCell>
                  <Collapsible open={isItemExpanded(item.id)}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full" 
                        onClick={() => toggleItemExpansion(item.id)}
                      >
                        {isItemExpanded(item.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </TableCell>
                <TableCell className="font-medium flex items-center gap-2">
                  {getItemIcon(item.name)} {item.name}
                </TableCell>
                <TableCell className="text-center">{item.totalQuantity}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => updateItemStatus(item.id, 'Started')}
                      className="h-12 font-medium bg-bisi-orange text-white hover:bg-bisi-orange/90"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start Making
                    </Button>
                    
                    <Button 
                      onClick={() => updateItemStatus(item.id, 'Finished')}
                      className="h-12 font-medium bg-coffee-green text-white hover:bg-coffee-green/90"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Finish Making
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className={cn(isItemExpanded(item.id) ? "" : "hidden")}>
                <TableCell colSpan={4} className="p-0">
                  <Collapsible open={isItemExpanded(item.id)}>
                    <CollapsibleContent>
                      <div className="px-4 py-3 bg-milk-sugar/10">
                        <h4 className="text-sm font-medium text-coffee-green mb-2">Customer Orders</h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs text-gray-500 border-b">
                              <th className="text-left pb-1 pl-1">Customer Name</th>
                              <th className="text-center pb-1">Quantity</th>
                              <th className="text-right pb-1 pr-1">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.orders.map((order) => (
                              <tr 
                                key={`${item.id}-${order.orderId}`} 
                                className="border-b border-gray-100 last:border-0"
                              >
                                <td className="py-2 pl-1">{order.customerName}</td>
                                <td className="py-2 text-center">{order.quantity}</td>
                                <td className="py-2 text-right pr-1">
                                  {item.status === 'Finished' && order.status !== 'Handed Over' ? (
                                    <Button 
                                      className="h-12 font-medium bg-milk-sugar text-coffee-green hover:bg-milk-sugar/90"
                                      onClick={() => updateCustomerOrderStatus(item.id, order.orderId, 'Handed Over')}
                                    >
                                      <ArrowRight className="h-4 w-4 mr-1" />
                                      Hand Over
                                    </Button>
                                  ) : order.status === 'Handed Over' ? (
                                    <Button 
                                      variant="ghost" 
                                      className="h-12 font-medium text-green-800 bg-green-100"
                                      disabled
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Handed Over
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="ghost" 
                                      className="h-12 font-medium text-gray-400"
                                      disabled
                                    >
                                      Finish Item First
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <p className="text-gray-500">No items found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ItemOrdersTable;

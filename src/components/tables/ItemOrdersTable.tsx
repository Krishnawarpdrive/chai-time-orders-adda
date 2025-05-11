
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Play, Check, ArrowRight, Coffee, Cookie, Leaf, Star } from 'lucide-react';
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
import { format } from 'date-fns';

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
  lastVisit?: string;
  rating?: number;
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
      return <Coffee className="w-6 h-6 text-coffee-green" />;
    } else if (lowercaseName.includes('biscuit')) {
      return <Cookie className="w-6 h-6 text-bisi-orange" />;
    } else if (lowercaseName.includes('tea') || lowercaseName.includes('chai')) {
      return <Leaf className="w-6 h-6 text-coffee-green" />;
    }
    return null;
  };

  // Generate random rating for demo purposes
  const getRating = (orderId: string) => {
    // Using a hash of the orderId to generate a consistent rating between 3 and 5
    const hash = orderId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return (Math.abs(hash) % 3) + 3; // Rating between 3 and 5
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, HH:mm");
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
                        className="h-10 w-10 rounded-full" 
                        onClick={() => toggleItemExpansion(item.id)}
                      >
                        {isItemExpanded(item.id) ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </TableCell>
                <TableCell className="font-medium flex items-center gap-2">
                  {getItemIcon(item.name)} <span className="text-lg">{item.name}</span>
                </TableCell>
                <TableCell className="text-center text-lg">{item.totalQuantity}</TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => updateItemStatus(item.id, 'Started')}
                      className="h-16 font-medium bg-bisi-orange text-white hover:bg-bisi-orange/90 rounded-lg flex flex-col items-center justify-center px-6"
                    >
                      <Play className="h-6 w-6 mb-1" />
                      <div className="text-sm">Start<br />Making</div>
                    </Button>
                    
                    <Button 
                      onClick={() => updateItemStatus(item.id, 'Finished')}
                      className="h-16 font-medium bg-coffee-green text-white hover:bg-coffee-green/90 rounded-lg flex flex-col items-center justify-center px-6"
                    >
                      <Check className="h-6 w-6 mb-1" />
                      <div className="text-sm">Finish<br />Making</div>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className={cn(isItemExpanded(item.id) ? "" : "hidden")}>
                <TableCell colSpan={4} className="p-0">
                  <Collapsible open={isItemExpanded(item.id)}>
                    <CollapsibleContent>
                      <div className="px-4 py-3 bg-milk-sugar/10">
                        <h4 className="text-lg font-medium text-coffee-green mb-4">Customer Orders</h4>
                        <table className="w-full text-base">
                          <thead>
                            <tr className="text-sm text-gray-500 border-b">
                              <th className="text-left pb-2 pl-1">Customer Name</th>
                              <th className="text-center pb-2">Quantity</th>
                              <th className="text-center pb-2">Last Visit</th>
                              <th className="text-center pb-2">Rating</th>
                              <th className="text-right pb-2 pr-1">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.orders.map((order) => (
                              <tr 
                                key={`${item.id}-${order.orderId}`} 
                                className="border-b border-gray-100 last:border-0"
                              >
                                <td className="py-3 pl-1 text-lg">{order.customerName}</td>
                                <td className="py-3 text-center text-lg">{order.quantity}</td>
                                <td className="py-3 text-center">{formatDate(order.lastVisit || new Date().toISOString())}</td>
                                <td className="py-3 text-center">{renderStarRating(getRating(order.orderId))}</td>
                                <td className="py-3 text-right pr-1">
                                  {item.status === 'Finished' && order.status !== 'Handed Over' ? (
                                    <Button 
                                      className="h-16 font-medium bg-milk-sugar text-coffee-green hover:bg-milk-sugar/90 rounded-lg flex flex-col items-center justify-center px-6"
                                      onClick={() => updateCustomerOrderStatus(item.id, order.orderId, 'Handed Over')}
                                    >
                                      <ArrowRight className="h-6 w-6 mb-1" />
                                      <div className="text-sm">Hand<br />Over</div>
                                    </Button>
                                  ) : order.status === 'Handed Over' ? (
                                    <Button 
                                      variant="ghost" 
                                      className="h-16 font-medium text-green-800 bg-green-100 rounded-lg flex flex-col items-center justify-center px-6"
                                      disabled
                                    >
                                      <Check className="h-6 w-6 mb-1" />
                                      <div className="text-sm">Handed<br />Over</div>
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="ghost" 
                                      className="h-16 font-medium text-gray-400 rounded-lg flex flex-col items-center justify-center px-6"
                                      disabled
                                    >
                                      <span className="text-sm">Finish<br />Item First</span>
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
                <p className="text-gray-500 text-lg">No items found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ItemOrdersTable;


import React, { useState } from 'react';
import { Order } from '@/types/supabase';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomerOrderItems from '@/components/tables/CustomerOrderItems';
import OrdersPagination from '@/components/table/OrdersPagination';
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
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format, parseISO, isValid } from 'date-fns';

interface CustomerOrdersTableProps {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  indexOfFirstOrder: number;
  indexOfLastOrder: number;
  totalOrders: number;
  loading: boolean;
  setCurrentPage: (page: number) => void;
}

const CustomerOrdersTable = ({
  orders,
  currentPage,
  totalPages,
  indexOfFirstOrder,
  indexOfLastOrder,
  totalOrders,
  loading,
  setCurrentPage
}: CustomerOrdersTableProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [orderDetails, setOrderDetails] = useState<Record<string, any>>({});
  const { toast } = useToast();
  
  // Toggle row expansion
  const toggleRowExpansion = async (orderId: string) => {
    if (expandedRows.includes(orderId)) {
      setExpandedRows(prev => prev.filter(id => id !== orderId));
    } else {
      setExpandedRows(prev => [...prev, orderId]);
      
      // Fetch order details if not already loaded
      if (!orderDetails[orderId]) {
        try {
          const details = await orderService.getOrderWithItems(orderId);
          if (details) {
            setOrderDetails(prev => ({ ...prev, [orderId]: details }));
          }
        } catch (error) {
          console.error(`Error fetching details for order ${orderId}:`, error);
          toast({
            title: "Error",
            description: "Failed to load order details.",
            variant: "destructive"
          });
        }
      }
    }
  };
  
  // Check if row is expanded
  const isRowExpanded = (orderId: string) => {
    return expandedRows.includes(orderId);
  };

  // Formatting utilities
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  // Generate random rating for demo purposes (in real app, this would come from the database)
  const getRating = (orderId: string) => {
    // Using a hash of the orderId to generate a consistent rating between 3 and 5
    const hash = orderId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return (Math.abs(hash) % 3) + 3; // Rating between 3 and 5
  };

  // Handle status change for an item
  const handleItemStatusChange = async (
    orderId: string, 
    itemId: string, 
    newStatus: 'Not Started' | 'Started' | 'Finished' | 'Ready for Hand Over'
  ) => {
    try {
      await orderService.updateOrderItemStatus(itemId, newStatus);
      
      // Update local state
      setOrderDetails(prev => {
        const order = prev[orderId];
        if (!order) return prev;
        
        const updatedItems = order.items.map((item: any) => 
          item.id === itemId ? { ...item, status: newStatus } : item
        );
        
        return {
          ...prev,
          [orderId]: { ...order, items: updatedItems }
        };
      });
      
      toast({
        title: "Status Updated",
        description: `Item status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error(`Error updating item status:`, error);
      toast({
        title: "Error",
        description: "Failed to update item status.",
        variant: "destructive"
      });
    }
  };

  // Format item names for display
  const formatItemNames = (items: any[]) => {
    if (!items || items.length === 0) return 'No items';
    
    // Get first two item names
    const firstTwoItems = items
      .slice(0, 2)
      .map(item => `${item.quantity}x ${item.item?.name || 'Unknown Item'}`)
      .join(', ');
    
    // Add ellipsis if there are more items
    return items.length > 2 
      ? `${firstTwoItems}...` 
      : firstTwoItems;
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

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <TableRow className={cn("hover-row", isRowExpanded(order.id) ? "bg-milk-sugar/20" : "")}>
                  <TableCell className="w-[50px]">
                    <Collapsible open={isRowExpanded(order.id)}>
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full" 
                          onClick={() => toggleRowExpansion(order.id)}
                        >
                          {isRowExpanded(order.id) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </Button>
                      </CollapsibleTrigger>
                    </Collapsible>
                  </TableCell>
                  <TableCell className="font-medium text-coffee-green">
                    {order.order_id}
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(order.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    {orderDetails[order.id] ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="cursor-pointer text-sm truncate block max-w-[150px]">
                            {formatItemNames(orderDetails[order.id].items)}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-2">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Order Items:</h4>
                            <ul className="text-sm">
                              {orderDetails[order.id].items.map((item: any, index: number) => (
                                <li key={index} className="py-1 border-b border-gray-100 last:border-0">
                                  {item.quantity}x {item.item?.name || 'Unknown Item'}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      <span className="text-gray-400 text-sm">Loading...</span>
                    )}
                  </TableCell>
                  <TableCell>{renderStarRating(getRating(order.id))}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right">{formatAmount(order.amount)}</TableCell>
                </TableRow>
                <TableRow className={cn(isRowExpanded(order.id) ? "" : "hidden")}>
                  <TableCell colSpan={8} className="p-0">
                    <Collapsible open={isRowExpanded(order.id)}>
                      <CollapsibleContent>
                        <div className="px-4 py-2 bg-milk-sugar/10">
                          {orderDetails[order.id] ? (
                            <CustomerOrderItems 
                              items={orderDetails[order.id].items || []} 
                              orderId={order.id}
                              customerName={order.customer_name}
                              onStatusChange={handleItemStatusChange}
                            />
                          ) : (
                            <div className="p-4 text-center">
                              <Spinner />
                              <p className="text-sm text-gray-500 mt-2">Loading order details...</p>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-gray-500">No orders found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <OrdersPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        indexOfFirstOrder={indexOfFirstOrder}
        indexOfLastOrder={indexOfLastOrder}
        totalOrders={totalOrders}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default CustomerOrdersTable;

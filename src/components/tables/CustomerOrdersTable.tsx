
import React, { useState } from 'react';
import { Order } from '@/types/supabase';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
                          className="h-6 w-6 rounded-full" 
                          onClick={() => toggleRowExpansion(order.id)}
                        >
                          {isRowExpanded(order.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right">{formatAmount(order.amount)}</TableCell>
                </TableRow>
                <TableRow className={cn(isRowExpanded(order.id) ? "" : "hidden")}>
                  <TableCell colSpan={5} className="p-0">
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
                <TableCell colSpan={5} className="text-center py-8">
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

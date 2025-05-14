
import { useState } from 'react';
import { Order } from '@/types/supabase';
import { orderService } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';

export function useCustomerOrders(initialOrders: Order[]) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [orderDetails, setOrderDetails] = useState<Record<string, any>>({});
  const [customerHistory, setCustomerHistory] = useState<Record<string, any>>({});
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
            
            // Fetch customer history based on phone number
            const order = initialOrders.find(o => o.id === orderId);
            if (order && order.phone_number && !customerHistory[order.phone_number]) {
              try {
                const customerOrders = await orderService.getOrders();
                const previousOrders = customerOrders
                  .filter(o => o.phone_number === order.phone_number && o.id !== orderId)
                  .map(o => ({
                    id: o.id,
                    order_id: o.order_id,
                    date: o.created_at,
                    amount: o.amount
                  }));
                
                setCustomerHistory(prev => ({
                  ...prev,
                  [order.phone_number]: {
                    lastVisitDate: previousOrders.length > 0 ? 
                      previousOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date : null,
                    previousOrders: previousOrders
                  }
                }));
              } catch (error) {
                console.error('Error fetching customer history:', error);
              }
            }
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

  // Get customer history for an order
  const getCustomerHistoryForOrder = (order: Order) => {
    if (!order.phone_number || !customerHistory[order.phone_number]) {
      return { lastVisitDate: null, previousOrders: [] };
    }
    return customerHistory[order.phone_number];
  };
  
  return {
    expandedRows,
    orderDetails,
    customerHistory,
    toggleRowExpansion,
    isRowExpanded,
    handleItemStatusChange,
    getCustomerHistoryForOrder
  };
}

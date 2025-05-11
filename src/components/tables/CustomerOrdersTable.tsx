
import React, { useState, useEffect } from 'react';
import { Order } from '@/types/supabase';
import { orderService } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody } from '@/components/ui/table';
import OrdersPagination from '@/components/table/OrdersPagination';
import CustomerOrderTableHeader from './CustomerOrderTableHeader';
import CustomerOrderRow from './CustomerOrderRow';
import CustomerOrderExpanded from './CustomerOrderExpanded';
import CustomerOrderTableEmpty from './CustomerOrderTableEmpty';
import { formatDate, formatAmount, getRating, formatItemNames } from './customerOrdersUtils';

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
          <CustomerOrderTableHeader />
          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <CustomerOrderRow 
                  order={order}
                  isExpanded={isRowExpanded(order.id)}
                  toggleRowExpansion={toggleRowExpansion}
                  formatDate={formatDate}
                  formatAmount={formatAmount}
                  orderDetails={orderDetails}
                  formatItemNames={formatItemNames}
                  getRating={getRating}
                />
                <CustomerOrderExpanded
                  orderId={order.id}
                  isExpanded={isRowExpanded(order.id)}
                  orderDetails={orderDetails}
                  customerName={order.customer_name}
                  onStatusChange={handleItemStatusChange}
                />
              </React.Fragment>
            ))}
            {orders.length === 0 && <CustomerOrderTableEmpty />}
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

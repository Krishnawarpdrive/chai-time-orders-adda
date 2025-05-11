
import React, { useState, useEffect } from 'react';
import CustomerOrdersTable from '@/components/tables/CustomerOrdersTable';
import OrdersSearchFilter from '@/components/table/OrdersSearchFilter';
import { orderService } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types/supabase';
import { supabase } from "@/integrations/supabase/client";
import { TooltipProvider } from '@/components/ui/tooltip';

export const CustomerView = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const ordersPerPage = 18; // Set to 18 as requested

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const fetchedOrders = await orderService.getOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          // Refresh orders when changes occur
          orderService.getOrders().then(updatedOrders => {
            setOrders(updatedOrders);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter orders by status and search query
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterValue === 'all' || order.status === filterValue;
    
    return matchesSearch && matchesFilter;
  });

  // Check for completed orders (all items delivered)
  const completedOrders = filteredOrders.filter(order => 
    order.status === 'Completed' || 
    (order.items && order.items.every(item => item.status === 'Ready for Hand Over'))
  );

  // Active orders
  const activeOrders = filteredOrders.filter(order => 
    order.status !== 'Completed' && 
    (!order.items || !order.items.every(item => item.status === 'Ready for Hand Over'))
  );

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = activeOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(activeOrders.length / ordersPerPage);

  // Reset orders
  const resetOrders = async () => {
    setLoading(true);
    try {
      const refreshedOrders = await orderService.getOrders();
      setOrders(refreshedOrders);
      toast({
        title: "Success",
        description: "Orders refreshed successfully.",
      });
    } catch (error) {
      console.error("Error refreshing orders:", error);
      toast({
        title: "Error",
        description: "Failed to refresh orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full min-h-[calc(100vh-160px)] flex flex-col">
        <OrdersSearchFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          resetOrders={resetOrders}
        />

        {completedOrders.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium text-coffee-green mb-2">Completed Orders ({completedOrders.length})</h3>
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">
                {completedOrders.length} order(s) have been completed and delivered to customers.
              </p>
            </div>
          </div>
        )}

        <CustomerOrdersTable 
          orders={currentOrders}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          indexOfFirstOrder={indexOfFirstOrder}
          indexOfLastOrder={indexOfLastOrder}
          totalOrders={activeOrders.length}
          loading={loading}
        />
      </div>
    </TooltipProvider>
  );
};

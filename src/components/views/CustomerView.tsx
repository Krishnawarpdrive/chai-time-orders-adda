
import React, { useState, useEffect } from 'react';
import CustomerOrdersTable from '@/components/tables/CustomerOrdersTable';
import OrdersSearchFilter from '@/components/table/OrdersSearchFilter';
import { orderService } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types/supabase';
import { supabase } from "@/integrations/supabase/client";

export const CustomerView = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const ordersPerPage = 5;

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

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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
    <div className="w-full">
      <OrdersSearchFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        resetOrders={resetOrders}
      />

      <CustomerOrdersTable 
        orders={currentOrders}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        indexOfFirstOrder={indexOfFirstOrder}
        indexOfLastOrder={indexOfLastOrder}
        totalOrders={filteredOrders.length}
        loading={loading}
      />
    </div>
  );
};

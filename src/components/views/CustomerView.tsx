
import React, { useState } from 'react';
import { orderData } from '@/lib/data';
import CustomerOrdersTable from '@/components/tables/CustomerOrdersTable';
import OrdersSearchFilter from '@/components/table/OrdersSearchFilter';

export const CustomerView = () => {
  const [orders, setOrders] = useState(orderData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Filter orders by status and search query
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterValue === 'all' || order.status === filterValue;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Reset orders
  const resetOrders = () => {
    setOrders([...orderData]);
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
      />
    </div>
  );
};

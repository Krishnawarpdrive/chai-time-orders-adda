
import React, { useState } from 'react';
import { Order, OrderStatus } from '@/lib/data';
import { cn } from '@/lib/utils';
import OrdersTableHeader from './table/OrdersTableHeader';
import OrdersTableRow from './table/OrdersTableRow';
import OrdersEmptyState from './table/OrdersEmptyState';
import OrdersPagination from './table/OrdersPagination';
import OrdersSearchFilter from './table/OrdersSearchFilter';

interface OrdersTableProps {
  orders: Order[];
}

type SortField = 'id' | 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const ordersPerPage = 5;

  // Toggle row expansion
  const toggleRowExpansion = (orderId: number) => {
    setExpandedRows(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };
  
  // Check if row is expanded
  const isRowExpanded = (orderId: number) => {
    return expandedRows.includes(orderId);
  };

  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.orderId === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Reset orders
  const resetOrders = () => {
    setOrders([...initialOrders]);
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter orders by status and search query
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterValue === 'all' || order.status === filterValue;
    
    return matchesSearch && matchesFilter;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === 'id') {
      return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
    } else if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    return 0;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

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
  
  // Get item count text
  const getItemCountText = (items: Order['items']) => {
    const itemCount = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    return `${totalQuantity} item${totalQuantity !== 1 ? 's' : ''}`;
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

      {/* Table Section */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <OrdersTableHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <OrdersTableRow
                  key={order.id}
                  order={order}
                  isExpanded={isRowExpanded(order.id)}
                  toggleRowExpansion={toggleRowExpansion}
                  formatDate={formatDate}
                  formatAmount={formatAmount}
                  getItemCountText={getItemCountText}
                  handleStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <OrdersEmptyState />
            )}
          </tbody>
        </table>
      </div>

      <OrdersPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        indexOfFirstOrder={indexOfFirstOrder}
        indexOfLastOrder={indexOfLastOrder}
        totalOrders={sortedOrders.length}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default OrdersTable;

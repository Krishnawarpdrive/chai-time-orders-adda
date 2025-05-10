
import React, { useState } from 'react';
import { Order, OrderStatus } from '@/lib/data';
import StatusBadge from './StatusBadge';
import LoyaltyBadge from './LoyaltyBadge';
import PaymentBadge from './PaymentBadge';
import OrderActions from './OrderActions';
import OrderItemsList from './OrderItemsList';
import { ArrowDown, ArrowUp, Search, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterDropdown } from './FilterDropdown';
import { cn } from '@/lib/utils';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* Search and Filter Section */}
        <div className="relative flex items-center w-full sm:w-auto">
          <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-64"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <FilterDropdown value={filterValue} onValueChange={setFilterValue} />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOrders([...initialOrders])}
            className="bg-white"
            title="Refresh orders"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10"></th> {/* Expansion column */}
              <th 
                className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  Order ID
                  {sortField === 'id' && (
                    sortDirection === 'asc' ? 
                      <ArrowUp className="ml-1 h-3 w-3" /> : 
                      <ArrowDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  {sortField === 'date' && (
                    sortDirection === 'asc' ? 
                      <ArrowUp className="ml-1 h-3 w-3" /> : 
                      <ArrowDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th 
                className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  Amount
                  {sortField === 'amount' && (
                    sortDirection === 'asc' ? 
                      <ArrowUp className="ml-1 h-3 w-3" /> : 
                      <ArrowDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className={cn("hover-row", isRowExpanded(order.id) ? "bg-milk-sugar/20" : "")}>
                    <td className="px-2 py-3">
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
                    </td>
                    <td className="table-cell-padding text-sm text-coffee-green font-medium">
                      {order.orderId}
                      <div className="text-xs text-gray-500 mt-1">
                        {getItemCountText(order.items)}
                      </div>
                    </td>
                    <td className="table-cell-padding text-sm text-gray-700">{formatDate(order.date)}</td>
                    <td className="table-cell-padding text-sm text-gray-700">
                      <div className="flex items-center">
                        {order.customer}
                        <LoyaltyBadge loyalty={order.customerLoyalty} />
                      </div>
                    </td>
                    <td className="table-cell-padding">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="table-cell-padding text-sm text-gray-700">{formatAmount(order.amount)}</td>
                    <td className="table-cell-padding">
                      <PaymentBadge type={order.paymentType} />
                    </td>
                    <td className="table-cell-padding">
                      <OrderActions 
                        orderId={order.orderId} 
                        status={order.status} 
                        onStatusChange={handleStatusChange} 
                      />
                    </td>
                  </tr>
                  <tr className={cn(isRowExpanded(order.id) ? "" : "hidden")}>
                    <td colSpan={8} className="p-0">
                      <Collapsible open={isRowExpanded(order.id)}>
                        <CollapsibleContent>
                          <div className="px-4">
                            <OrderItemsList items={order.items} />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="table-cell-padding text-center text-sm text-gray-500 py-8">
                  <div className="flex flex-col items-center">
                    <p className="mb-1">No orders found</p>
                    <p className="text-xs">Try adjusting your search or filter</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, sortedOrders.length)} of {sortedOrders.length} orders
        </p>
        
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={cn(
              "flex items-center px-2 py-1 text-sm rounded",
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "bg-white"
            )}
          >
            Previous
          </Button>
          
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
            // Logic to show pages around the current page
            let pageNum;
            if (totalPages <= 3) {
              pageNum = i + 1;
            } else if (currentPage <= 2) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 1) {
              pageNum = totalPages - 2 + i;
            } else {
              pageNum = currentPage - 1 + i;
            }
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className={cn(
                  "px-3 py-1 text-sm rounded",
                  currentPage === pageNum ? "bg-coffee-green text-white" : "bg-white"
                )}
              >
                {pageNum}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={cn(
              "flex items-center px-2 py-1 text-sm rounded",
              currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : "bg-white"
            )}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrdersTable;

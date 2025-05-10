
import React, { useState } from 'react';
import { Order, OrderStatus } from '@/lib/data';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomerOrderItems from '@/components/tables/CustomerOrderItems';
import OrdersPagination from '@/components/table/OrdersPagination';
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
  setCurrentPage: (page: number) => void;
}

const CustomerOrdersTable = ({
  orders,
  currentPage,
  totalPages,
  indexOfFirstOrder,
  indexOfLastOrder,
  totalOrders,
  setCurrentPage
}: CustomerOrdersTableProps) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

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
  const handleItemStatusChange = (
    orderId: string, 
    itemId: number, 
    newStatus: 'Not Started' | 'Started' | 'Finished' | 'Ready for Hand Over'
  ) => {
    // In a real app, this would update the status in the backend
    console.log(`Item ${itemId} in order ${orderId} status changed to ${newStatus}`);
  };

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
                    {order.orderId}
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(order.date)}
                    </div>
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right">{formatAmount(order.amount)}</TableCell>
                </TableRow>
                <TableRow className={cn(isRowExpanded(order.id) ? "" : "hidden")}>
                  <TableCell colSpan={5} className="p-0">
                    <Collapsible open={isRowExpanded(order.id)}>
                      <CollapsibleContent>
                        <div className="px-4 py-2 bg-milk-sugar/10">
                          <CustomerOrderItems 
                            items={order.items} 
                            orderId={order.orderId}
                            customerName={order.customer}
                            onStatusChange={handleItemStatusChange}
                          />
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

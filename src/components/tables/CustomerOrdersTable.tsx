
import React from 'react';
import { Order } from '@/types/supabase';
import { Table, TableBody } from '@/components/ui/table';
import OrdersPagination from '@/components/table/OrdersPagination';
import CustomerOrderTableHeader from './CustomerOrderTableHeader';
import CustomerOrderRow from './CustomerOrderRow';
import CustomerOrderExpanded from './CustomerOrderExpanded';
import CustomerOrderTableEmpty from './CustomerOrderTableEmpty';
import CustomerOrderTableLoading from './CustomerOrderTableLoading';
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
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
  const {
    isRowExpanded,
    toggleRowExpansion,
    orderDetails,
    handleItemStatusChange,
    getCustomerHistoryForOrder
  } = useCustomerOrders(orders);
  
  if (loading) {
    return <CustomerOrderTableLoading />;
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <Table>
          <CustomerOrderTableHeader showRating={false} />
          <TableBody>
            {orders.map((order) => {
              const { previousOrders } = getCustomerHistoryForOrder(order);
              return (
                <React.Fragment key={`order-group-${order.id}`}>
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
                    getRating={getRating}
                    previousOrders={previousOrders}
                  />
                </React.Fragment>
              );
            })}
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

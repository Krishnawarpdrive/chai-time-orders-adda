
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { orderService } from '@/services/orderService';
import { formatDate, formatAmount } from './customerOrdersUtils';
import { Spinner } from '@/components/ui/spinner';
import StatusBadge from '@/components/StatusBadge';
import { Order } from '@/types/supabase';

interface OrderHistoryProps {
  customerId: string;
  customerName: string;
}

const OrderHistory = ({ customerId, customerName }: OrderHistoryProps) => {
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        // We'll use the customer's phone number to get their order history
        // This assumes the customerName is unique and can identify the customer
        const orders = await orderService.getOrderHistoryByCustomer(customerName);
        setOrderHistory(orders);
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [customerName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    );
  }

  if (orderHistory.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
        <p className="text-gray-500">No previous orders found for this customer.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-lg text-coffee-green">Order History for {customerName}</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Products Ordered</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderHistory.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_id}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  {order.items && order.items.length > 0 
                    ? order.items.map((item: any) => 
                        `${item.item?.name || 'Unknown'} (${item.quantity})`
                      ).join(', ')
                    : 'No items'}
                </TableCell>
                <TableCell className="text-right">{formatAmount(order.amount)}</TableCell>
                <TableCell><StatusBadge status={order.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderHistory;


import React from 'react';
import { 
  TableHeader,
  TableRow,
  TableHead
} from '@/components/ui/table';

const CustomerOrderTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]"></TableHead>
        <TableHead>Order ID</TableHead>
        <TableHead>Customer Name</TableHead>
        <TableHead>Last Visit</TableHead>
        <TableHead>Last Order</TableHead>
        <TableHead>Last Rating</TableHead>
        <TableHead>Order Status</TableHead>
        <TableHead className="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default CustomerOrderTableHeader;

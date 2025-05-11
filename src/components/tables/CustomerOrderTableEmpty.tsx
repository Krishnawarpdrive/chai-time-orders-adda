
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

const CustomerOrderTableEmpty = () => {
  return (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-8">
        <p className="text-gray-500">No orders found</p>
      </TableCell>
    </TableRow>
  );
};

export default CustomerOrderTableEmpty;


import React from 'react';
import { 
  TableHeader,
  TableRow,
  TableHead,
} from '@/components/ui/table';

interface CustomerOrderTableHeaderProps {
  showRating?: boolean;
}

const CustomerOrderTableHeader = ({ showRating = false }: CustomerOrderTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]"></TableHead>
        <TableHead>Order ID</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Items</TableHead>
        {showRating && <TableHead>Rating</TableHead>}
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default CustomerOrderTableHeader;

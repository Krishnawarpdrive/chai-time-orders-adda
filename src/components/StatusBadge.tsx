
import React from 'react';
import { cn } from "@/lib/utils";
import { OrderStatus } from '@/lib/data';

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800';
      case 'Preparing':
        return 'bg-purple-100 text-purple-800';
      case 'Ready To Pick':
        return 'bg-green-100 text-green-800';
      case 'Picked':
        return 'bg-indigo-100 text-indigo-800';
      case 'Completed':
        return 'bg-teal-100 text-teal-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={cn('status-badge', getStatusStyles())}>
      {status}
    </span>
  );
}

export default StatusBadge;

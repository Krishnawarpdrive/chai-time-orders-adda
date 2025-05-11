
import React from 'react';
import { cn } from "@/lib/utils";
import { OrderStatus } from '@/lib/data';
import { 
  Circle, 
  Square, 
  Triangle, 
  Check, 
  X 
} from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Ready To Pick':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Picked':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Not Yet Started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Order Prepared':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Order Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'Pending':
      case 'Not Yet Started':
        return <Circle className="w-3 h-3 mr-1" />;
      case 'Preparing':
        return <Square className="w-3 h-3 mr-1" />;
      case 'Ready To Pick':
      case 'Order Prepared':
        return <Triangle className="w-3 h-3 mr-1" />;
      case 'Picked':
      case 'Completed':
      case 'Order Delivered':
        return <Check className="w-3 h-3 mr-1" />;
      case 'Cancelled':
        return <X className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={cn('status-badge inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', getStatusStyles())}>
      {getStatusIcon()}
      {status}
    </span>
  );
}

export default StatusBadge;

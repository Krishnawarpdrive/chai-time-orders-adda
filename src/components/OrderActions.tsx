
import React from 'react';
import { OrderStatus } from '@/lib/data';
import { Check, Package, PackageCheck, X, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';

interface OrderActionsProps {
  orderId: string;
  status: OrderStatus;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

export function OrderActions({ orderId, status, onStatusChange }: OrderActionsProps) {
  const { toast } = useToast();
  
  const handleAction = (newStatus: OrderStatus) => {
    onStatusChange(orderId, newStatus);
    toast({
      title: "Status updated",
      description: `Order ${orderId} is now ${newStatus}`,
    });
  };

  // Different buttons based on the current status
  const renderActionButtons = () => {
    switch (status) {
      case 'Pending':
        return (
          <div className="flex space-x-2">
            <button 
              onClick={() => handleAction('Accepted')} 
              className={cn('action-button bg-coffee-green text-white hover:bg-coffee-green/90')}
            >
              <Check className="w-4 h-4 mr-1 inline" />
              Accept
            </button>
            <button 
              onClick={() => handleAction('Cancelled')} 
              className={cn('action-button bg-red-500 text-white hover:bg-red-600')}
            >
              <X className="w-4 h-4 mr-1 inline" />
              Cancel
            </button>
          </div>
        );
      case 'Accepted':
        return (
          <button 
            onClick={() => handleAction('Preparing')} 
            className={cn('action-button bg-coffee-green text-white hover:bg-coffee-green/90')}
          >
            <Loader className="w-4 h-4 mr-1 inline" />
            Preparing
          </button>
        );
      case 'Preparing':
        return (
          <button 
            onClick={() => handleAction('Ready To Pick')} 
            className={cn('action-button bg-bisi-orange text-white hover:bg-bisi-orange/90')}
          >
            <PackageCheck className="w-4 h-4 mr-1 inline" />
            Ready To Pick
          </button>
        );
      case 'Ready To Pick':
        return (
          <button 
            onClick={() => handleAction('Picked')} 
            className={cn('action-button bg-bisi-orange text-white hover:bg-bisi-orange/90')}
          >
            <Package className="w-4 h-4 mr-1 inline" />
            Picked
          </button>
        );
      case 'Picked':
        return (
          <button 
            onClick={() => handleAction('Completed')} 
            className={cn('action-button bg-coffee-green text-white hover:bg-coffee-green/90')}
          >
            <Check className="w-4 h-4 mr-1 inline" />
            Complete
          </button>
        );
      default:
        return (
          <span className="text-sm text-gray-500">No actions available</span>
        );
    }
  };

  return (
    <div className="flex justify-start">
      {renderActionButtons()}
    </div>
  );
}

export default OrderActions;

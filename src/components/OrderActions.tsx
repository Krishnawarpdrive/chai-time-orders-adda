
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
              className={cn('action-button bg-coffee-green text-white hover:bg-coffee-green/90 flex items-center px-4 py-2 rounded')}
            >
              <Check className="w-5 h-5 mr-3" />
              <div className="flex flex-col">
                <span>Accept</span>
                <span>Order</span>
              </div>
            </button>
            <button 
              onClick={() => handleAction('Cancelled')} 
              className={cn('action-button bg-red-500 text-white hover:bg-red-600 flex items-center px-4 py-2 rounded')}
            >
              <X className="w-5 h-5 mr-3" />
              <div className="flex flex-col">
                <span>Cancel</span>
                <span>Order</span>
              </div>
            </button>
          </div>
        );
      case 'Accepted':
        return (
          <button 
            onClick={() => handleAction('Preparing')} 
            className={cn('action-button bg-coffee-green text-white hover:bg-coffee-green/90 flex items-center px-4 py-2 rounded')}
          >
            <Loader className="w-5 h-5 mr-3" />
            <div className="flex flex-col">
              <span>Start</span>
              <span>Making</span>
            </div>
          </button>
        );
      case 'Preparing':
        return (
          <button 
            onClick={() => handleAction('Ready To Pick')} 
            className={cn('action-button bg-bisi-orange text-white hover:bg-bisi-orange/90 flex items-center px-4 py-2 rounded')}
          >
            <PackageCheck className="w-5 h-5 mr-3" />
            <div className="flex flex-col">
              <span>Order</span>
              <span>Prepared</span>
            </div>
          </button>
        );
      case 'Ready To Pick':
        return (
          <button 
            onClick={() => handleAction('Picked')} 
            className={cn('action-button bg-bisi-orange text-white hover:bg-bisi-orange/90 flex items-center px-4 py-2 rounded')}
          >
            <Package className="w-5 h-5 mr-3" />
            <div className="flex flex-col">
              <span>Order</span>
              <span>Delivered</span>
            </div>
          </button>
        );
      case 'Picked':
        return (
          <button 
            onClick={() => handleAction('Completed')} 
            className={cn('action-button bg-coffee-green text-white hover:bg-coffee-green/90 flex items-center px-4 py-2 rounded')}
          >
            <Check className="w-5 h-5 mr-3" />
            <div className="flex flex-col">
              <span>Complete</span>
              <span>Order</span>
            </div>
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

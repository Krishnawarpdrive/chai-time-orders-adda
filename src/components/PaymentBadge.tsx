
import React from 'react';
import { cn } from "@/lib/utils";
import { PaymentType } from '@/lib/data';
import { Coffee } from 'lucide-react';

interface PaymentBadgeProps {
  type: PaymentType;
}

export function PaymentBadge({ type }: PaymentBadgeProps) {
  const getPaymentIcon = () => {
    switch (type) {
      case 'Cash':
        return '💵';
      case 'Credit':
        return '💳';
      case 'Digital Wallet':
        return '📱';
      default:
        return '💰';
    }
  };
  
  const getPaymentStyles = () => {
    switch (type) {
      case 'Cash':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'Credit':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Digital Wallet':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <span className={cn(
      'payment-badge inline-flex items-center text-xs px-2 py-1 rounded-full border', 
      getPaymentStyles()
    )}>
      <span className="mr-1">{getPaymentIcon()}</span>
      {type}
    </span>
  );
}

export default PaymentBadge;


import React from 'react';
import { cn } from "@/lib/utils";
import { PaymentType } from '@/lib/data';

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

  return (
    <span className={cn('payment-badge inline-flex items-center text-xs text-gray-600')}>
      <span className="mr-1">{getPaymentIcon()}</span>
      {type}
    </span>
  );
}

export default PaymentBadge;

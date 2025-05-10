
import React from 'react';
import { cn } from "@/lib/utils";
import { CustomerLoyalty } from '@/lib/data';
import { Star, Coffee } from 'lucide-react';

interface LoyaltyBadgeProps {
  loyalty: CustomerLoyalty;
}

export function LoyaltyBadge({ loyalty }: LoyaltyBadgeProps) {
  const getLoyaltyStyles = () => {
    switch (loyalty) {
      case 'Frequent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Periodic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'New':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLoyaltyIcon = () => {
    switch (loyalty) {
      case 'Frequent':
        return <Star className="w-3 h-3 mr-1" />;
      case 'Periodic':
        return <Coffee className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={cn('loyalty-badge inline-flex items-center justify-center text-xs px-2 py-0.5 ml-2 rounded-full border', getLoyaltyStyles())}>
      {getLoyaltyIcon()}
      {loyalty}
    </span>
  );
}

export default LoyaltyBadge;

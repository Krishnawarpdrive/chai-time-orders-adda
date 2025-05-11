
import React from 'react';
import { Order } from '@/types/supabase';
import { cn } from "@/lib/utils";
import StatusBadge from '@/components/StatusBadge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  TableRow,
  TableCell 
} from '@/components/ui/table';
import { 
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import OrderItemsHover from './OrderItemsHover';

interface CustomerOrderRowProps {
  order: Order;
  isExpanded: boolean;
  toggleRowExpansion: (orderId: string) => void;
  formatDate: (dateString: string) => string;
  formatAmount: (amount: number) => string;
  orderDetails: Record<string, any>;
  formatItemNames: (items: any[]) => string;
  getRating: (orderId: string) => number;
}

const CustomerOrderRow = ({
  order,
  isExpanded,
  toggleRowExpansion,
  formatDate,
  formatAmount,
  orderDetails,
  formatItemNames,
  getRating
}: CustomerOrderRowProps) => {
  return (
    <TableRow className={cn("hover-row", isExpanded ? "bg-milk-sugar/20" : "")}>
      <TableCell className="w-[50px]">
        <Collapsible open={isExpanded}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={() => toggleRowExpansion(order.id)}
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </TableCell>
      <TableCell className="font-medium text-coffee-green">
        {order.order_id}
        <div className="text-xs text-gray-500 mt-1">
          {formatDate(order.created_at)}
        </div>
      </TableCell>
      <TableCell>{order.customer_name}</TableCell>
      <TableCell>{formatDate(order.created_at)}</TableCell>
      <TableCell>
        {orderDetails[order.id] ? (
          <OrderItemsHover 
            items={orderDetails[order.id].items} 
            formattedItems={formatItemNames(orderDetails[order.id].items)}
          />
        ) : (
          <span className="text-gray-400 text-sm">Loading...</span>
        )}
      </TableCell>
      <TableCell><StatusBadge status={order.status} /></TableCell>
      <TableCell className="text-right">{formatAmount(order.amount)}</TableCell>
    </TableRow>
  );
};

export default CustomerOrderRow;

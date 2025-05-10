
import React from 'react';
import { Order } from '@/lib/data';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import LoyaltyBadge from '@/components/LoyaltyBadge';
import PaymentBadge from '@/components/PaymentBadge';
import OrderActions from '@/components/OrderActions';
import OrderItemsList from '@/components/OrderItemsList';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface OrdersTableRowProps {
  order: Order;
  isExpanded: boolean;
  toggleRowExpansion: (orderId: number) => void;
  formatDate: (dateString: string) => string;
  formatAmount: (amount: number) => string;
  getItemCountText: (items: Order['items']) => string;
  handleStatusChange: (orderId: string, status: Order['status']) => void;
}

export function OrdersTableRow({
  order,
  isExpanded,
  toggleRowExpansion,
  formatDate,
  formatAmount,
  getItemCountText,
  handleStatusChange
}: OrdersTableRowProps) {
  return (
    <React.Fragment>
      <tr className={cn("hover-row", isExpanded ? "bg-milk-sugar/20" : "")}>
        <td className="px-2 py-3">
          <Collapsible open={isExpanded}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full" 
                onClick={() => toggleRowExpansion(order.id)}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </td>
        <td className="table-cell-padding text-sm text-coffee-green font-medium">
          {order.orderId}
          <div className="text-xs text-gray-500 mt-1">
            {getItemCountText(order.items)}
          </div>
        </td>
        <td className="table-cell-padding text-sm text-gray-700">{formatDate(order.date)}</td>
        <td className="table-cell-padding text-sm text-gray-700">
          <div className="flex items-center">
            {order.customer}
            <LoyaltyBadge loyalty={order.customerLoyalty} />
          </div>
        </td>
        <td className="table-cell-padding">
          <StatusBadge status={order.status} />
        </td>
        <td className="table-cell-padding text-sm text-gray-700">{formatAmount(order.amount)}</td>
        <td className="table-cell-padding">
          <PaymentBadge type={order.paymentType} />
        </td>
        <td className="table-cell-padding">
          <OrderActions 
            orderId={order.orderId} 
            status={order.status} 
            onStatusChange={handleStatusChange} 
          />
        </td>
      </tr>
      <tr className={cn(isExpanded ? "" : "hidden")}>
        <td colSpan={8} className="p-0">
          <Collapsible open={isExpanded}>
            <CollapsibleContent>
              <div className="px-4">
                <OrderItemsList items={order.items} />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </td>
      </tr>
    </React.Fragment>
  );
}

export default OrdersTableRow;

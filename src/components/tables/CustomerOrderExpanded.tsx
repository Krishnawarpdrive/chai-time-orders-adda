
import React from 'react';
import { 
  TableRow,
  TableCell 
} from '@/components/ui/table';
import { cn } from "@/lib/utils";
import { 
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import CustomerOrderItems from './CustomerOrderItems';
import { Spinner } from '@/components/ui/spinner';
import { OrderStatus } from '@/types/supabase';

interface CustomerOrderExpandedProps {
  orderId: string;
  isExpanded: boolean;
  orderDetails: Record<string, any>;
  customerName: string;
  onStatusChange: (orderId: string, itemId: string, newStatus: 'Not Started' | 'Started' | 'Finished' | 'Ready for Hand Over') => void;
}

const CustomerOrderExpanded = ({
  orderId,
  isExpanded,
  orderDetails,
  customerName,
  onStatusChange
}: CustomerOrderExpandedProps) => {
  return (
    <TableRow className={cn(isExpanded ? "" : "hidden")}>
      <TableCell colSpan={8} className="p-0">
        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <div className="px-4 py-2 bg-milk-sugar/10">
              {orderDetails[orderId] ? (
                <CustomerOrderItems 
                  items={orderDetails[orderId].items || []} 
                  orderId={orderId}
                  customerName={customerName}
                  onStatusChange={onStatusChange}
                />
              ) : (
                <div className="p-4 text-center">
                  <Spinner />
                  <p className="text-sm text-gray-500 mt-2">Loading order details...</p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </TableCell>
    </TableRow>
  );
};

export default CustomerOrderExpanded;

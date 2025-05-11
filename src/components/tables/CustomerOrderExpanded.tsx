
import React, { useState } from 'react';
import { 
  TableCell, 
  TableRow 
} from '@/components/ui/table';
import { 
  Collapsible,
  CollapsibleContent 
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CustomerOrderItems from './CustomerOrderItems';
import { formatDate } from './customerOrdersUtils';

// New component for order history
import OrderHistory from './OrderHistory';

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
  // New state to control order history visibility
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  
  if (!isExpanded) {
    return null;
  }

  const orderDetail = orderDetails[orderId];
  
  if (!orderDetail) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="py-4 text-center">
          Loading order details...
        </TableCell>
      </TableRow>
    );
  }

  // Last visit date (using order creation date)
  const lastVisitDate = orderDetail.created_at;
  
  // Last order details
  const lastOrderItems = orderDetail.items || [];
  const lastOrderNames = lastOrderItems.map((item: any) => item.item?.name || 'Unknown Item').join(', ');

  // Last rating (placeholder - should be fetched from actual data)
  const lastRating = orderDetail.rating || 4.2;

  return (
    <>
      <TableRow className="bg-gray-50 border-t border-b">
        <TableCell colSpan={8} className="p-0">
          <Collapsible open={isExpanded}>
            <CollapsibleContent className="pb-4">
              <div className="px-4 pt-4 pb-2 space-y-4">
                {/* Customer Order Summary Section */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-lg text-coffee-green mb-3">Customer Summary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Last Visit</p>
                      <p className="font-medium">
                        {lastVisitDate ? `Last visited on: ${formatDate(lastVisitDate)}` : 'No visit recorded'}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Last Order</p>
                      <p className="font-medium">
                        {lastOrderNames || 'No orders recorded'}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Last Order Rating</p>
                      <p className="font-medium">
                        Rating: {lastRating.toFixed(1)}/5
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="ghost" 
                      className="text-coffee-green flex items-center"
                      onClick={() => setShowOrderHistory(!showOrderHistory)}
                    >
                      <span className="flex flex-col items-start mr-2">
                        <span>Order</span>
                        <span>History</span>
                      </span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Order History Section */}
                {showOrderHistory && (
                  <OrderHistory 
                    customerId={orderDetail.customer_id || ""} 
                    customerName={customerName}
                  />
                )}

                {/* Current Order Items Section */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-milk-sugar/50 px-4 py-2">
                    <h4 className="font-medium text-coffee-green">Current Order Items</h4>
                  </div>
                  <CustomerOrderItems 
                    items={orderDetail.items} 
                    onStatusChange={(itemId, status) => onStatusChange(orderId, itemId, status)}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CustomerOrderExpanded;

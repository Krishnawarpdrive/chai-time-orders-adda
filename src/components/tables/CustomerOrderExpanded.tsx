
import React, { useState } from 'react';
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
import StarRating from './StarRating';
import { formatDate } from './customerOrdersUtils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { List } from 'lucide-react';

interface CustomerOrderExpandedProps {
  orderId: string;
  isExpanded: boolean;
  orderDetails: Record<string, any>;
  customerName: string;
  onStatusChange: (orderId: string, itemId: string, newStatus: 'Not Started' | 'Started' | 'Finished' | 'Ready for Hand Over') => void;
  getRating: (orderId: string) => number;
  lastVisitDate?: string;
  previousOrders?: Array<{id: string, order_id: string, date: string, amount: number}>;
}

const CustomerOrderExpanded = ({
  orderId,
  isExpanded,
  orderDetails,
  customerName,
  onStatusChange,
  getRating,
  lastVisitDate,
  previousOrders = []
}: CustomerOrderExpandedProps) => {
  const [showOrdersDialog, setShowOrdersDialog] = useState(false);
  
  return (
    <TableRow className={cn(isExpanded ? "" : "hidden")}>
      <TableCell colSpan={8} className="p-0">
        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-3 bg-milk-sugar/10">
              <div className="col-span-2">
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
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="text-lg font-medium text-coffee-green mb-3">Customer Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <StarRating rating={getRating(orderId)} />
                      </div>
                      
                      {lastVisitDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Visit:</span>
                          <span className="font-medium">{formatDate(lastVisitDate)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Previous Orders:</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-coffee-green hover:text-coffee-green/80 p-1 h-auto flex items-center gap-1"
                          onClick={() => setShowOrdersDialog(true)}
                        >
                          <span className="font-medium">{previousOrders.length}</span>
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Dialog open={showOrdersDialog} onOpenChange={setShowOrdersDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Previous Orders for {customerName}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[340px] w-full">
                  <div className="space-y-3 p-1">
                    {previousOrders.length > 0 ? (
                      previousOrders.map((order) => (
                        <div 
                          key={order.id} 
                          className="flex justify-between p-3 border border-gray-100 rounded-md hover:bg-gray-50"
                        >
                          <div>
                            <div className="font-medium">{order.order_id}</div>
                            <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
                          </div>
                          <div className="font-medium text-coffee-green">₹{order.amount.toFixed(2)}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">No previous orders found</div>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </CollapsibleContent>
        </Collapsible>
      </TableCell>
    </TableRow>
  );
};

export default CustomerOrderExpanded;


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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  previousOrders = []
}: CustomerOrderExpandedProps) => {
  
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
                {/* Customer Summary as simple text, not a card */}
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h4 className="text-lg font-medium text-coffee-green mb-3">Customer Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <StarRating rating={getRating(orderId)} />
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Previous Orders:</span>
                      <span className="font-medium">{previousOrders.length}</span>
                    </div>
                  </div>
                </div>
                
                {previousOrders.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-100">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="previous-orders" className="border-none">
                        <AccordionTrigger className="text-coffee-green px-4 py-3">
                          Previous Orders ({previousOrders.length})
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3">
                          <ScrollArea className="h-[180px] w-full">
                            <div className="space-y-2">
                              {previousOrders.map((order) => (
                                <div 
                                  key={order.id} 
                                  className="flex justify-between border-b border-gray-100 pb-2"
                                >
                                  <div>
                                    <div className="font-medium text-sm">{order.order_id}</div>
                                    <div className="text-xs text-gray-500">{formatDate(order.date)}</div>
                                  </div>
                                  <div className="font-medium">₹{order.amount.toFixed(2)}</div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </TableCell>
    </TableRow>
  );
};

export default CustomerOrderExpanded;

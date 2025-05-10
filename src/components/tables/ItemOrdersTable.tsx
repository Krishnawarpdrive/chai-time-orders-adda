
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Play, Check, ArrowRight, Coffee, Cookie, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Status types
type ItemStatus = 'Not Started' | 'Started' | 'Finished' | 'Ready for Hand Over';
type CustomerOrderStatus = 'Not Started' | 'Started' | 'Finished' | 'Handed Over';

// Item interface
interface ItemOrder {
  orderId: string;
  customerId: number;
  customerName: string;
  quantity: number;
  status: CustomerOrderStatus;
  itemId: number;
}

interface ItemData {
  id: number;
  name: string;
  totalQuantity: number;
  status: ItemStatus;
  orders: ItemOrder[];
}

interface ItemOrdersTableProps {
  items: ItemData[];
}

const ItemOrdersTable = ({ items }: ItemOrdersTableProps) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [itemsData, setItemsData] = useState<ItemData[]>(items);

  // Toggle item expansion
  const toggleItemExpansion = (itemId: number) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Check if item is expanded
  const isItemExpanded = (itemId: number) => {
    return expandedItems.includes(itemId);
  };

  // Get the appropriate icon based on item name
  const getItemIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('coffee')) {
      return <Coffee className="w-5 h-5 text-coffee-green" />;
    } else if (lowercaseName.includes('biscuit')) {
      return <Cookie className="w-5 h-5 text-bisi-orange" />;
    } else if (lowercaseName.includes('tea') || lowercaseName.includes('chai')) {
      return <Leaf className="w-5 h-5 text-coffee-green" />;
    }
    return null;
  };

  // Update the overall status of an item
  const updateItemStatus = (itemId: number, status: ItemStatus) => {
    setItemsData(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status } : item
      )
    );
  };

  // Update the status of a specific customer order
  const updateCustomerOrderStatus = (itemId: number, orderId: string, newStatus: CustomerOrderStatus) => {
    setItemsData(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          const updatedOrders = item.orders.map(order => 
            order.orderId === orderId ? { ...order, status: newStatus } : order
          );
          return { ...item, orders: updatedOrders };
        }
        return item;
      })
    );
  };

  return (
    <Card className="bg-white shadow rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemsData.map((item) => (
            <React.Fragment key={item.id}>
              <TableRow className={cn("hover-row", isItemExpanded(item.id) ? "bg-milk-sugar/20" : "")}>
                <TableCell>
                  <Collapsible open={isItemExpanded(item.id)}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full" 
                        onClick={() => toggleItemExpansion(item.id)}
                      >
                        {isItemExpanded(item.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </TableCell>
                <TableCell className="font-medium flex items-center gap-2">
                  {getItemIcon(item.name)} {item.name}
                </TableCell>
                <TableCell className="text-center">{item.totalQuantity}</TableCell>
                <TableCell>
                  <ToggleGroup type="single" className="h-14">
                    <ToggleGroupItem 
                      value="StartMaking" 
                      aria-label="Start Making"
                      onClick={() => updateItemStatus(item.id, 'Started')}
                      className="border border-gray-200 h-14 font-medium bg-coffee-green text-white hover:bg-coffee-green/90"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start Making
                    </ToggleGroupItem>
                    
                    <ToggleGroupItem 
                      value="FinishMaking" 
                      aria-label="Finish Making"
                      onClick={() => updateItemStatus(item.id, 'Finished')}
                      className="border border-gray-200 h-14 font-medium bg-coffee-green text-white hover:bg-coffee-green/90"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Finish Making
                    </ToggleGroupItem>
                    
                    <ToggleGroupItem 
                      value="HandOver" 
                      aria-label="Hand Over"
                      onClick={() => updateItemStatus(item.id, 'Ready for Hand Over')}
                      className="border border-gray-200 h-14 font-medium bg-coffee-green text-white hover:bg-coffee-green/90"
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Hand Over
                    </ToggleGroupItem>
                  </ToggleGroup>
                </TableCell>
              </TableRow>
              <TableRow className={cn(isItemExpanded(item.id) ? "" : "hidden")}>
                <TableCell colSpan={4} className="p-0">
                  <Collapsible open={isItemExpanded(item.id)}>
                    <CollapsibleContent>
                      <div className="px-4 py-3 bg-milk-sugar/10">
                        <h4 className="text-sm font-medium text-coffee-green mb-2">Customer Orders</h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs text-gray-500 border-b">
                              <th className="text-left pb-1 pl-1">Customer Name</th>
                              <th className="text-center pb-1">Quantity</th>
                              <th className="text-right pb-1 pr-1">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.orders.map((order) => (
                              <tr 
                                key={`${item.id}-${order.orderId}`} 
                                className="border-b border-gray-100 last:border-0"
                              >
                                <td className="py-2 pl-1">{order.customerName}</td>
                                <td className="py-2 text-center">{order.quantity}</td>
                                <td className="py-2 text-right pr-1">
                                  {order.status !== 'Handed Over' ? (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-xs py-1 h-14 bg-coffee-green text-white font-medium hover:bg-coffee-green/90"
                                      onClick={() => updateCustomerOrderStatus(item.id, order.orderId, 'Handed Over')}
                                    >
                                      <ArrowRight className="h-3 w-3 mr-1" />
                                      Hand Over
                                    </Button>
                                  ) : (
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="text-xs py-1 h-14 text-green-800 bg-green-100 font-medium"
                                      disabled
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Handed Over
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <p className="text-gray-500">No items found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ItemOrdersTable;

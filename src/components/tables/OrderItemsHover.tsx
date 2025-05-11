
import React from 'react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface OrderItemsHoverProps {
  items: any[];
  formattedItems: string;
}

const OrderItemsHover = ({ items, formattedItems }: OrderItemsHoverProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer text-sm truncate block max-w-[150px]">
          {formattedItems}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-2">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Order Items:</h4>
          <ul className="text-sm">
            {items.map((item: any, index: number) => (
              <li key={index} className="py-1 border-b border-gray-100 last:border-0">
                {item.quantity}x {item.item?.name || 'Unknown Item'}
              </li>
            ))}
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default OrderItemsHover;

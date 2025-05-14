
import React from 'react';
import { type InventoryItem } from "@/hooks/useInventory";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import InventoryRequest from "@/components/inventory/InventoryRequest";

interface InventoryItemCardProps {
  item: InventoryItem;
  onUpdateClick: (item: InventoryItem) => void;
  isRequestMode: boolean;
  onAddToRequest: (item: InventoryItem, quantity: number) => void;
}

const InventoryItemCard = ({ 
  item, 
  onUpdateClick, 
  isRequestMode
}: InventoryItemCardProps) => {
  // Determine if stock is low (at or below reorder level)
  const isLowStock = item.quantity <= item.reorder_level;
  
  // Dynamic styling based on stock level
  const getStockLevelStyle = () => {
    if (isLowStock) return 'text-red-600 font-medium';
    if (item.quantity <= item.reorder_level * 1.5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-coffee-green">{item.name}</h3>
          <div className="text-sm text-gray-500">
            {item.category || 'Uncategorized'}
          </div>
        </div>
        
        {!isRequestMode && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => onUpdateClick(item)}
          >
            <Edit className="h-3 w-3" />
            <span className="sr-only">Edit</span>
          </Button>
        )}
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <span className="text-xs text-gray-500 block">Current Stock</span>
          <span className={`${getStockLevelStyle()}`}>
            {item.quantity} {item.unit}
          </span>
        </div>
        
        <div>
          <span className="text-xs text-gray-500 block">Reorder Level</span>
          <span className="text-gray-700">{item.reorder_level} {item.unit}</span>
        </div>
        
        <div>
          <span className="text-xs text-gray-500 block">Price Per Unit</span>
          <span className="text-gray-700">₹{item.price_per_unit}</span>
        </div>
        
        <div>
          <span className="text-xs text-gray-500 block">Last Restocked</span>
          <span className="text-gray-700">
            {item.last_restocked ? new Date(item.last_restocked).toLocaleDateString() : 'Never'}
          </span>
        </div>
      </div>
      
      {!isRequestMode && <InventoryRequest item={item} />}
    </div>
  );
};

export default InventoryItemCard;

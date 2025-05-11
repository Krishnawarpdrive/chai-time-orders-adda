
import React from 'react';
import { Button } from "@/components/ui/button";
import { type InventoryItem } from "@/hooks/useInventory";

interface InventoryItemProps {
  item: InventoryItem;
  onUpdateClick: (item: InventoryItem) => void;
}

const InventoryItem = ({ item, onUpdateClick }: InventoryItemProps) => {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-md shadow-sm p-3 hover:shadow-md transition-shadow"
    >
      <h4 className="font-semibold text-coffee-green">{item.name}</h4>
      
      <div className="mt-2 space-y-1 text-sm">
        <p className="flex justify-between">
          <span className="text-gray-600">Quantity Available:</span>
          <span className={`font-medium ${item.quantity <= item.reorder_level ? 'text-red-600' : 'text-gray-900'}`}>
            {item.quantity} {item.unit}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600">Reorder Level:</span>
          <span className="text-gray-900">{item.reorder_level} {item.unit}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600">Price:</span>
          <span className="text-gray-900">₹{item.price_per_unit} per {item.unit}</span>
        </p>
      </div>

      <Button 
        className="w-full mt-2 bg-coffee-green hover:bg-coffee-green/90"
        variant="default"
        size="sm"
        onClick={() => onUpdateClick(item)}
      >
        Update Inventory
      </Button>
    </div>
  );
};

export default InventoryItem;

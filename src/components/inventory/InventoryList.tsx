
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { type InventoryItem } from "@/hooks/useInventory";

interface InventoryListProps {
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;
  isRequestMode?: boolean;
  onUpdateClick?: (item: InventoryItem) => void;
  onAddToRequest?: (item: InventoryItem, quantity: number) => void;
}

const InventoryList = ({ 
  inventory, 
  loading, 
  error
}: InventoryListProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Spinner className="h-8 w-8 text-coffee-green" />
        <p className="mt-2 text-sm text-gray-500">Loading inventory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle size={16} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (inventory.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>No inventory items found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inventory.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="font-medium text-lg">{item.name}</div>
          <div className="text-sm text-gray-500">{item.category}</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-gray-500">Current Stock</span>
              <div className="font-medium">{item.quantity} {item.unit}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Reorder Level</span>
              <div>{item.reorder_level} {item.unit}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryList;

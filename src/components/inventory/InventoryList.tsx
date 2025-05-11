
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { type InventoryItem } from "@/hooks/useInventory";
import InventoryItemCard from "@/components/inventory/InventoryItem";
import InventoryCardRequest from "@/components/inventory/InventoryCardRequest";

interface InventoryListProps {
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;
  isRequestMode: boolean;
  onUpdateClick: (item: InventoryItem) => void;
  onAddToRequest: (item: InventoryItem, quantity: number) => void;
}

const InventoryList = ({ 
  inventory, 
  loading, 
  error, 
  isRequestMode, 
  onUpdateClick,
  onAddToRequest 
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
        <div key={item.id} className="space-y-2">
          <InventoryItemCard 
            item={item}
            onUpdateClick={onUpdateClick}
            isRequestMode={isRequestMode}
            onAddToRequest={onAddToRequest}
          />
          <InventoryCardRequest
            item={item}
            isRequestMode={isRequestMode}
            onAddToRequest={onAddToRequest}
          />
        </div>
      ))}
    </div>
  );
};

export default InventoryList;

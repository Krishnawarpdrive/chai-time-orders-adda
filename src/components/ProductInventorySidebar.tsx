
import React, { useState } from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { useInventory, type InventoryItem } from "@/hooks/useInventory";
import InventoryItemCard from "@/components/inventory/InventoryItem";
import UpdateInventoryDialog from "@/components/inventory/UpdateInventoryDialog";

const ProductInventorySidebar = () => {
  const { inventory, loading, error, updateInventoryItem } = useInventory();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleUpdateInventory = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleConfirmUpdate = async (itemId: string, newQuantity: number) => {
    return await updateInventoryItem(itemId, newQuantity);
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-72 border-l border-gray-200 bg-white shadow-lg overflow-y-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-coffee-green flex items-center gap-2">
        <Package size={20} />
        Product Inventory
      </h2>

      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Spinner className="h-8 w-8 text-coffee-green" />
          <p className="mt-2 text-sm text-gray-500">Loading inventory...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={16} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {inventory.map((item) => (
          <InventoryItemCard 
            key={item.id}
            item={item}
            onUpdateClick={handleUpdateInventory}
          />
        ))}

        {inventory.length === 0 && !loading && !error && (
          <div className="text-center py-6 text-gray-500">
            <p>No inventory items found</p>
          </div>
        )}
      </div>

      <UpdateInventoryDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedItem={selectedItem}
        onConfirm={handleConfirmUpdate}
      />
    </div>
  );
};

export default ProductInventorySidebar;

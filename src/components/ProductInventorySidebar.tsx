
import React, { useState } from 'react';
import { useInventory, type InventoryItem } from "@/hooks/useInventory";
import { useToast } from "@/hooks/use-toast";
import UpdateInventoryDialog from "@/components/inventory/UpdateInventoryDialog";
import InventoryRequestDialog from "@/components/inventory/InventoryRequestDialog";
import SidebarHeader from "@/components/inventory/SidebarHeader";
import InventoryList from "@/components/inventory/InventoryList";
import RequestFooter from "@/components/inventory/RequestFooter";
import { format, addBusinessDays } from 'date-fns';

const ProductInventorySidebar = () => {
  const { inventory, loading, error, updateInventoryItem } = useInventory();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isRequestMode, setIsRequestMode] = useState<boolean>(true);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState<boolean>(false);
  const [requestItems, setRequestItems] = useState<Array<InventoryItem & { requestQuantity: number }>>([]);

  // Calculate estimated delivery date (2 business days from now)
  const estimatedDeliveryDate = addBusinessDays(new Date(), 2);

  const handleUpdateInventory = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleConfirmUpdate = async (itemId: string, newQuantity: number) => {
    return await updateInventoryItem(itemId, newQuantity);
  };

  const toggleRequestMode = () => {
    if (isRequestMode && requestItems.length > 0) {
      // If switching off request mode with items in cart, confirm first
      setIsRequestDialogOpen(true);
    } else {
      setIsRequestMode(!isRequestMode);
      if (!isRequestMode) {
        toast({
          title: "Request Mode Enabled",
          description: "Add items to your inventory request.",
        });
      }
    }
  };

  const handleAddToRequest = (item: InventoryItem, quantity: number) => {
    // Check if item already exists in request
    const existingItemIndex = requestItems.findIndex(reqItem => reqItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...requestItems];
      updatedItems[existingItemIndex] = { 
        ...updatedItems[existingItemIndex], 
        requestQuantity: updatedItems[existingItemIndex].requestQuantity + quantity 
      };
      setRequestItems(updatedItems);
    } else {
      // Add new item to request
      setRequestItems([...requestItems, { ...item, requestQuantity: quantity }]);
    }
    
    toast({
      title: "Added to Request",
      description: `${quantity} ${item.unit} of ${item.name} added to your request.`,
    });
  };

  const clearRequest = () => {
    setRequestItems([]);
    setIsRequestMode(false);
  };

  // Calculate total items in request
  const totalRequestItems = requestItems.reduce((acc, item) => acc + item.requestQuantity, 0);

  return (
    <div className="fixed right-0 top-0 h-screen w-72 border-l border-gray-200 bg-white shadow-lg overflow-y-auto pb-20">
      <SidebarHeader 
        isRequestMode={isRequestMode}
        requestItemsCount={requestItems.length}
        toggleRequestMode={toggleRequestMode}
        openRequestDialog={() => setIsRequestDialogOpen(true)}
      />
      
      <div className="p-4 pt-0">
        <InventoryList
          inventory={inventory}
          loading={loading}
          error={error}
          isRequestMode={isRequestMode}
          onUpdateClick={handleUpdateInventory}
          onAddToRequest={handleAddToRequest}
        />
      </div>

      {isRequestMode && requestItems.length > 0 && (
        <RequestFooter 
          totalRequestItems={totalRequestItems}
          onClick={() => setIsRequestDialogOpen(true)}
        />
      )}

      <UpdateInventoryDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedItem={selectedItem}
        onConfirm={handleConfirmUpdate}
      />
      
      <InventoryRequestDialog
        isOpen={isRequestDialogOpen}
        onOpenChange={setIsRequestDialogOpen}
        requestItems={requestItems}
        onClearRequest={clearRequest}
        estimatedDeliveryDate={estimatedDeliveryDate.toISOString()} // Fix: Convert Date to string
      />
    </div>
  );
};

export default ProductInventorySidebar;

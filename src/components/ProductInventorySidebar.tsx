
import React, { useState } from 'react';
import { Package, AlertCircle, Check, CalendarClock, ShoppingBag } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useInventory, type InventoryItem } from "@/hooks/useInventory";
import InventoryItemCard from "@/components/inventory/InventoryItem";
import InventoryCardRequest from "@/components/inventory/InventoryCardRequest";
import UpdateInventoryDialog from "@/components/inventory/UpdateInventoryDialog";
import InventoryRequestDialog from "@/components/inventory/InventoryRequestDialog";
import { useToast } from "@/hooks/use-toast";
import { format, addBusinessDays } from 'date-fns';

const ProductInventorySidebar = () => {
  const { inventory, loading, error, updateInventoryItem } = useInventory();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isRequestMode, setIsRequestMode] = useState<boolean>(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState<boolean>(false);
  const [requestItems, setRequestItems] = useState<Array<InventoryItem & { requestQuantity: number }>>([]);

  // Calculate estimated delivery date (2 business days from now)
  const estimatedDeliveryDate = addBusinessDays(new Date(), 2);
  const formattedDeliveryDate = format(estimatedDeliveryDate, 'EEEE, MMMM d');
  
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

  // Filter items that are near or below reorder level when in request mode
  const displayedInventory = isRequestMode 
    ? inventory.filter(item => item.quantity <= item.reorder_level * 1.5)
    : inventory;

  // Calculate total items in request
  const totalRequestItems = requestItems.reduce((acc, item) => acc + item.requestQuantity, 0);

  return (
    <div className="fixed right-0 top-0 h-screen w-72 border-l border-gray-200 bg-white shadow-lg overflow-y-auto pb-20">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-coffee-green flex items-center gap-2">
          <Package size={20} />
          Product Inventory
        </h2>

        <div className="mb-4 flex justify-between items-center">
          <Button
            onClick={toggleRequestMode}
            variant={isRequestMode ? "default" : "outline"}
            size="sm"
            className={isRequestMode ? "bg-coffee-green hover:bg-coffee-green/90" : ""}
          >
            {isRequestMode ? (
              <>
                <Check size={16} />
                Request Mode
              </>
            ) : (
              "Request Inventory"
            )}
          </Button>
          
          {isRequestMode && requestItems.length > 0 && (
            <Button
              onClick={() => setIsRequestDialogOpen(true)}
              variant="default"
              size="sm"
              className="bg-bisi-orange hover:bg-bisi-orange/90"
            >
              Review ({requestItems.length})
            </Button>
          )}
        </div>

        {isRequestMode && (
          <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-100 rounded-md flex items-center text-xs text-blue-700">
            <CalendarClock size={14} className="mr-2 flex-shrink-0" />
            <span>Estimated delivery: <strong>{formattedDeliveryDate}</strong></span>
          </div>
        )}

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
          {displayedInventory.map((item) => (
            <div key={item.id} className="space-y-2">
              <InventoryItemCard 
                item={item}
                onUpdateClick={handleUpdateInventory}
                isRequestMode={isRequestMode}
                onAddToRequest={handleAddToRequest}
              />
              <InventoryCardRequest
                item={item}
                isRequestMode={isRequestMode}
                onAddToRequest={handleAddToRequest}
              />
            </div>
          ))}

          {displayedInventory.length === 0 && !loading && !error && (
            <div className="text-center py-6 text-gray-500">
              <p>No inventory items found</p>
            </div>
          )}
        </div>
      </div>

      {isRequestMode && requestItems.length > 0 && (
        <div className="fixed bottom-0 right-0 w-72 bg-white border-t border-gray-200 p-4 shadow-lg">
          <Button
            onClick={() => setIsRequestDialogOpen(true)}
            className="w-full py-6 bg-bisi-orange hover:bg-bisi-orange/90 text-white font-medium"
          >
            <ShoppingBag className="mr-2" />
            Request Order ({totalRequestItems} items)
          </Button>
        </div>
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
        estimatedDeliveryDate={formattedDeliveryDate}
      />
    </div>
  );
};

export default ProductInventorySidebar;

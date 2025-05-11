
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Package, AlertCircle } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  reorder_level: number;
  price_per_unit: number;
  unit: string;
}

const ProductInventorySidebar = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [requestQuantity, setRequestQuantity] = useState<number>(0);
  const { toast } = useToast();

  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('inventory')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setInventory(data as InventoryItem[]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch inventory data');
        console.error('Error fetching inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleUpdateInventory = (item: InventoryItem) => {
    setSelectedItem(item);
    setRequestQuantity(0);
    setIsDialogOpen(true);
  };

  const handleConfirmRequest = async () => {
    if (!selectedItem) return;

    try {
      // Calculate new quantity
      const newQuantity = selectedItem.quantity + requestQuantity;

      // Update inventory item using Supabase client
      const { error } = await supabase
        .from('inventory')
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedItem.id);

      if (error) throw error;

      // Update local state
      setInventory(inventory.map(item => 
        item.id === selectedItem.id 
          ? { ...item, quantity: newQuantity } 
          : item
      ));

      // Close dialog and show success message
      setIsDialogOpen(false);
      toast({
        title: "Inventory Updated",
        description: `Successfully updated ${selectedItem.name} inventory.`,
      });
    } catch (err: any) {
      console.error('Error updating inventory:', err);
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update inventory.",
        variant: "destructive"
      });
    }
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
          <div 
            key={item.id} 
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
              onClick={() => handleUpdateInventory(item)}
            >
              Update Inventory
            </Button>
          </div>
        ))}

        {inventory.length === 0 && !loading && !error && (
          <div className="text-center py-6 text-gray-500">
            <p>No inventory items found</p>
          </div>
        )}
      </div>

      {/* Update Inventory Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Inventory for {selectedItem?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="text-gray-600">Current Inventory:</span>
              <span className="font-medium">{selectedItem?.quantity} {selectedItem?.unit}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="text-gray-600">Reorder Level:</span>
              <span className="font-medium">{selectedItem?.reorder_level} {selectedItem?.unit}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="text-gray-600">Add Quantity:</span>
              <Input
                type="number"
                value={requestQuantity}
                onChange={(e) => setRequestQuantity(Number(e.target.value))}
                className="w-full"
                min="1"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="text-gray-600">Price per {selectedItem?.unit}:</span>
              <span className="font-medium">₹{selectedItem?.price_per_unit}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 items-center text-lg font-semibold">
              <span>Total Cost:</span>
              <span className="text-coffee-green">₹{(requestQuantity * (selectedItem?.price_per_unit || 0)).toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmRequest}
              className="bg-bisi-orange hover:bg-bisi-orange/90"
              disabled={requestQuantity <= 0}
            >
              Confirm Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductInventorySidebar;

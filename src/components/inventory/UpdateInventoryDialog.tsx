
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type InventoryItem } from "@/hooks/useInventory";

interface UpdateInventoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: InventoryItem | null;
  onConfirm: (itemId: string, newQuantity: number) => Promise<boolean>;
}

const UpdateInventoryDialog = ({ 
  isOpen, 
  onOpenChange, 
  selectedItem, 
  onConfirm 
}: UpdateInventoryDialogProps) => {
  const [requestQuantity, setRequestQuantity] = useState<number>(0);

  const handleConfirmRequest = async () => {
    if (!selectedItem) return;
    
    const success = await onConfirm(selectedItem.id, selectedItem.quantity + requestQuantity);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
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
  );
};

export default UpdateInventoryDialog;

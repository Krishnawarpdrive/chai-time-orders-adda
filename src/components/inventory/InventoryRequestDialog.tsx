
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Package } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type InventoryItem } from "@/hooks/useInventory";
import { useToast } from "@/hooks/use-toast";

interface InventoryRequestItem extends InventoryItem {
  requestQuantity: number;
}

interface InventoryRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  requestItems: InventoryRequestItem[];
  onClearRequest: () => void;
}

const InventoryRequestDialog = ({
  isOpen,
  onOpenChange,
  requestItems,
  onClearRequest,
}: InventoryRequestDialogProps) => {
  const { toast } = useToast();
  
  // Calculate estimated delivery date (5 days from today)
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);
  
  const formattedDeliveryDate = estimatedDeliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleConfirmRequest = () => {
    // In a real application, this would submit the request to a backend
    toast({
      title: "Request Submitted",
      description: `Your inventory request with ${requestItems.length} items has been submitted.`,
    });
    onOpenChange(false);
    onClearRequest();
  };

  const calculateTotalCost = () => {
    return requestItems.reduce((total, item) => {
      return total + (item.requestQuantity * item.price_per_unit);
    }, 0).toFixed(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-coffee-green">
            <Package size={18} />
            Confirm Inventory Request
          </DialogTitle>
          <DialogDescription>
            Review your inventory request before submitting.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <div className="flex items-center gap-2 text-sm mb-3 bg-milk-sugar/50 p-2 rounded">
            <Calendar size={16} className="text-coffee-green" />
            <span>Estimated delivery: <span className="font-semibold">{formattedDeliveryDate}</span></span>
          </div>
          
          {requestItems.length > 0 ? (
            <>
              <ScrollArea className="max-h-60">
                <div className="space-y-3">
                  {requestItems.map((item) => (
                    <div key={item.id} className="flex justify-between border-b border-gray-100 pb-2">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">₹{item.price_per_unit} per {item.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{item.requestQuantity} {item.unit}</p>
                        <p className="text-xs text-gray-500">₹{(item.requestQuantity * item.price_per_unit).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="border-t border-gray-200 mt-4 pt-3 flex justify-between">
                <span className="font-medium">Total Cost:</span>
                <span className="font-semibold text-coffee-green">₹{calculateTotalCost()}</span>
              </div>
            </>
          ) : (
            <p className="text-center py-6 text-gray-500">No items in your request</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            disabled={requestItems.length === 0}
            onClick={handleConfirmRequest}
            className="bg-coffee-green hover:bg-coffee-green/90"
          >
            Confirm Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryRequestDialog;

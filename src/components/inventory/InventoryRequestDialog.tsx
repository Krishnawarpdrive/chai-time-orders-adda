
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useInventoryRequests } from '@/hooks/useInventoryRequests';
import { format } from 'date-fns';

interface RequestItemWithQuantity {
  id: string;
  name: string;
  quantity: number;
  requestQuantity: number;
  unit: string;
}

interface InventoryRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  requestItems: Array<RequestItemWithQuantity>;
  onClearRequest: () => void;
  estimatedDeliveryDate: string;
}

const InventoryRequestDialog = ({
  isOpen,
  onOpenChange,
  requestItems,
  onClearRequest,
  estimatedDeliveryDate,
}: InventoryRequestDialogProps) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { createInventoryRequest } = useInventoryRequests();

  const handleSubmitRequest = async () => {
    setIsSubmitting(true);
    try {
      // Create a separate inventory request for each item
      for (const item of requestItems) {
        await createInventoryRequest(
          item.id, 
          item.quantity, 
          item.requestQuantity,
          notes
        );
      }
      
      toast({
        title: "Request Submitted",
        description: `${requestItems.length} item${requestItems.length !== 1 ? 's' : ''} requested successfully.`,
      });
      
      onClearRequest();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting inventory requests:', error);
      toast({
        title: "Request Failed",
        description: "There was an error submitting your inventory requests.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM d');
    } catch (e) {
      return 'Unknown date';
    }
  };

  const totalItems = requestItems.reduce((sum, item) => sum + item.requestQuantity, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-coffee-green">Inventory Request</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium">Items to Request: {requestItems.length}</p>
              <p className="text-sm text-gray-500">Total Quantity: {totalItems} units</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Estimated Delivery</p>
              <p className="text-sm font-medium text-coffee-green">{formatDate(estimatedDeliveryDate)}</p>
            </div>
          </div>

          <ScrollArea className="h-[200px] rounded-md border p-4 mb-4">
            {requestItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">Current: {item.quantity} {item.unit}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.requestQuantity} {item.unit}</p>
                  <p className="text-xs text-gray-500">Requested</p>
                </div>
              </div>
            ))}
          </ScrollArea>

          <div className="mb-4">
            <label className="text-sm font-medium mb-1 block">Notes (Optional)</label>
            <Textarea
              placeholder="Add any notes about this inventory request..."
              className="min-h-[100px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onClearRequest}
          >
            Clear Items
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRequest}
              disabled={isSubmitting || requestItems.length === 0}
              className="bg-coffee-green hover:bg-coffee-green/90"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryRequestDialog;

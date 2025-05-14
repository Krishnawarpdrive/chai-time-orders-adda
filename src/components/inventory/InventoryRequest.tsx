
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { type InventoryItem } from "@/hooks/useInventory";
import { useInventoryRequests } from "@/hooks/useInventoryRequests";

interface InventoryRequestProps {
  item: InventoryItem;
  showFullForm?: boolean;
}

const InventoryRequest = ({ item, showFullForm = false }: InventoryRequestProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [staffEnteredQuantity, setStaffEnteredQuantity] = useState<number | ''>('');
  const [requestedQuantity, setRequestedQuantity] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [requestHistory, setRequestHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  const { toast } = useToast();
  const { createInventoryRequest, fetchRequestHistory } = useInventoryRequests();
  
  const isLowStock = item.quantity <= item.reorder_level;
  
  const toggleHistory = async () => {
    if (!isHistoryOpen && requestHistory.length === 0) {
      setHistoryLoading(true);
      try {
        // This would need to be modified to fetch history based on inventory item rather than request
        const history = await fetchRequestHistory(item.id);
        setRequestHistory(history);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setHistoryLoading(false);
      }
    }
    setIsHistoryOpen(!isHistoryOpen);
  };
  
  const handleSubmit = async () => {
    if (!staffEnteredQuantity || !requestedQuantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in both quantity fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createInventoryRequest(
        item.id,
        Number(staffEnteredQuantity),
        Number(requestedQuantity),
        notes
      );
      
      setIsDialogOpen(false);
      setStaffEnteredQuantity('');
      setRequestedQuantity('');
      setNotes('');
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };
  
  const openDialog = () => {
    setIsDialogOpen(true);
    setStaffEnteredQuantity(item.quantity || '');
  };

  // Inline form (shown directly in the inventory card)
  if (showFullForm) {
    return (
      <div className={`mt-4 p-3 rounded-md ${isLowStock ? 'bg-yellow-50 border border-yellow-100' : 'bg-gray-50 border border-gray-100'}`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">Inventory Update</h4>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            onClick={toggleHistory}
          >
            {isHistoryOpen ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
        </div>
        
        {isLowStock && (
          <div className="bg-yellow-100 text-yellow-800 text-xs p-2 rounded flex items-center mb-3">
            <AlertCircle className="h-3 w-3 mr-1" />
            Stock below reorder level ({item.reorder_level} {item.unit})
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-xs text-gray-500 block">
              Staff Entered Quantity
            </label>
            <Input
              type="number"
              min="0"
              value={staffEnteredQuantity}
              onChange={(e) => setStaffEnteredQuantity(e.target.value === '' ? '' : Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className={`text-xs ${isLowStock ? 'text-yellow-700' : 'text-gray-500'} block`}>
              Request Quantity
            </label>
            <Input
              type="number"
              min="1"
              disabled={!isLowStock}
              value={requestedQuantity}
              onChange={(e) => setRequestedQuantity(e.target.value === '' ? '' : Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="text-xs text-gray-500 block">
            Notes (Optional)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="text-sm min-h-[60px]"
            placeholder="Add notes about this update"
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            size="sm"
            disabled={!isLowStock || !requestedQuantity || !staffEnteredQuantity}
            onClick={handleSubmit}
            className="bg-coffee-green hover:bg-coffee-green/80"
          >
            Submit Request
          </Button>
        </div>
        
        {isHistoryOpen && (
          <div className="mt-3 border-t pt-2">
            <h5 className="text-xs font-medium mb-2">Request History</h5>
            {historyLoading ? (
              <div className="text-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-coffee-green mx-auto"></div>
                <p className="text-xs mt-1">Loading history...</p>
              </div>
            ) : requestHistory.length > 0 ? (
              <div className="max-h-[150px] overflow-y-auto">
                {requestHistory.map((history, index) => (
                  <div key={index} className="text-xs mb-2 pb-1 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between">
                      <span>{history.new_status}</span>
                      <span className="text-gray-500">{new Date(history.created_at).toLocaleDateString()}</span>
                    </div>
                    {history.notes && <p className="text-gray-600 mt-1">{history.notes}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No previous requests found.</p>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // Just show the button that opens the dialog
  return (
    <>
      {isLowStock && (
        <div className="mt-2">
          <Button 
            onClick={openDialog}
            variant="ghost" 
            size="sm"
            className="text-xs h-7 border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Stock Low - Request
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request {item.name}</DialogTitle>
            <DialogDescription>
              Current stock: {item.quantity} {item.unit} (Reorder Level: {item.reorder_level} {item.unit})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="staffQuantity" className="text-sm font-medium">
                  Staff Entered Quantity
                </label>
                <Input
                  id="staffQuantity"
                  type="number"
                  value={staffEnteredQuantity}
                  onChange={(e) => setStaffEnteredQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the actual quantity you counted
                </p>
              </div>
              
              <div>
                <label htmlFor="requestQuantity" className="text-sm font-medium">
                  Request Quantity
                </label>
                <Input
                  id="requestQuantity"
                  type="number"
                  min="1"
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter how much you need to order
                </p>
              </div>
            </div>
            
            <div>
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this request"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!requestedQuantity || !staffEnteredQuantity}
              className="bg-coffee-green hover:bg-coffee-green/80"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryRequest;

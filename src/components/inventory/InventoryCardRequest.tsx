
import React, { useState } from 'react';
import { Plus, Minus, Check, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { type InventoryItem } from "@/hooks/useInventory";
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface InventoryCardRequestProps {
  item: InventoryItem;
  onAddToRequest: (item: InventoryItem, quantity: number) => void;
  isRequestMode: boolean;
}

const InventoryCardRequest = ({
  item,
  onAddToRequest,
  isRequestMode
}: InventoryCardRequestProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  
  // Calculate max quantity based on some business logic (e.g. 3x reorder level)
  const maxQuantity = item.reorder_level * 3;
  
  const handleAddQuantity = () => {
    setIsExpanded(true);
  };
  
  const handleIncrement = () => {
    if (requestQuantity < maxQuantity) {
      setRequestQuantity(prev => prev + 1);
      setRequestStatus('idle');
    } else {
      setRequestStatus('error');
      toast({
        title: "Maximum quantity reached",
        description: `You can request maximum ${maxQuantity} ${item.unit} of ${item.name}`,
        variant: "destructive"
      });
    }
  };
  
  const handleDecrement = () => {
    if (requestQuantity > 1) {
      setRequestQuantity(prev => prev - 1);
      setRequestStatus('idle');
    }
  };
  
  const handleConfirmRequest = () => {
    if (requestQuantity <= maxQuantity) {
      onAddToRequest(item, requestQuantity);
      setRequestStatus('success');
      setIsExpanded(false);
      
      // Reset after displaying success for 3 seconds
      setTimeout(() => {
        setRequestStatus('idle');
        setRequestQuantity(1);
      }, 3000);
    } else {
      setRequestStatus('error');
    }
  };
  
  const stockStatus = item.quantity <= item.reorder_level;
  const stockPercentage = Math.min(100, (item.quantity / (item.reorder_level * 2)) * 100);
  
  if (!isRequestMode) {
    return null;
  }
  
  return (
    <div className="mt-2">
      {requestStatus === 'idle' && !isExpanded && (
        <Button 
          onClick={handleAddQuantity} 
          size="sm" 
          variant="outline" 
          className="w-full border-dashed border-coffee-green text-coffee-green hover:bg-coffee-green/10"
        >
          <Plus size={16} className="mr-1" />
          Add Quantity
        </Button>
      )}
      
      {isExpanded && (
        <div className="mt-2 space-y-2 border border-gray-200 rounded-md p-2 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Request Quantity:</p>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 w-7 p-0" 
                onClick={handleDecrement}
                disabled={requestQuantity <= 1}
              >
                <Minus size={14} />
              </Button>
              
              <span className="font-medium w-8 text-center">{requestQuantity}</span>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 w-7 p-0" 
                onClick={handleIncrement}
                disabled={requestQuantity >= maxQuantity}
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
          
          {requestStatus === 'error' && (
            <div className="text-xs bg-red-50 border border-red-200 rounded p-1 text-red-700 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              Maximum quantity reached ({maxQuantity})
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1" 
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-coffee-green hover:bg-coffee-green/90" 
              onClick={handleConfirmRequest}
            >
              Confirm
            </Button>
          </div>
        </div>
      )}
      
      {requestStatus === 'success' && (
        <div className="mt-2 bg-green-50 border border-green-200 rounded p-2 text-green-700 text-sm flex items-center">
          <Check size={16} className="mr-1" />
          Added to request successfully!
        </div>
      )}
      
      {requestStatus === 'error' && !isExpanded && (
        <div className="mt-2 bg-red-50 border border-red-200 rounded p-2 text-red-700 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" />
          Maximum quantity reached
        </div>
      )}
    </div>
  );
};

export default InventoryCardRequest;

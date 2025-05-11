
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { type InventoryItem } from "@/hooks/useInventory";
import { Plus, Check, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InventoryItemProps {
  item: InventoryItem;
  onUpdateClick: (item: InventoryItem) => void;
  isRequestMode?: boolean;
  onAddToRequest?: (item: InventoryItem, quantity: number) => void;
}

const InventoryItem = ({ 
  item, 
  onUpdateClick, 
  isRequestMode = false,
  onAddToRequest
}: InventoryItemProps) => {
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  
  // Calculate maximum allowed request (3x reorder level or 50, whichever is smaller)
  const maxRequestQuantity = Math.min(item.reorder_level * 3, 50);

  const handleAddToRequest = () => {
    // Validate quantity before submitting
    if (requestQuantity > maxRequestQuantity) {
      setRequestError(`Maximum quantity allowed is ${maxRequestQuantity} ${item.unit}`);
      return;
    }
    
    if (onAddToRequest) {
      onAddToRequest(item, requestQuantity);
      setRequestSubmitted(true);
      setRequestError(null);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setRequestSubmitted(false);
        setShowQuantityInput(false);
      }, 3000);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setRequestQuantity(Math.max(1, value)); // Minimum of 1
    
    // Clear error if the value is now valid
    if (value <= maxRequestQuantity) {
      setRequestError(null);
    }
  };

  const stockStatus = item.quantity <= item.reorder_level;

  return (
    <div 
      className={`bg-white border rounded-md shadow-sm p-4 transition-all ${
        stockStatus 
          ? 'border-red-200 bg-red-50/30' 
          : 'border-green-100 bg-green-50/20'
      }`}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-coffee-green">{item.name}</h4>
        {stockStatus && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
            Low Stock
          </span>
        )}
      </div>
      
      <div className="mt-3 space-y-2 text-sm">
        <p className="flex justify-between">
          <span className="text-gray-600">Available:</span>
          <span className={`font-medium ${stockStatus ? 'text-red-700' : 'text-green-700'}`}>
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
        
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div 
            className={`h-1.5 rounded-full ${stockStatus ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(100, (item.quantity / (item.reorder_level * 2)) * 100)}%` }}
          ></div>
        </div>
      </div>

      {isRequestMode ? (
        <div className="mt-3">
          {!showQuantityInput ? (
            <Button 
              className="w-full bg-bisi-orange hover:bg-bisi-orange/90 flex items-center justify-center gap-1"
              variant="default"
              size="sm"
              onClick={() => setShowQuantityInput(true)}
            >
              <Plus size={16} />
              Add Quantity
            </Button>
          ) : (
            <>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-600">Quantity:</span>
                <div className="flex-1 flex items-center">
                  <Input 
                    type="number" 
                    value={requestQuantity}
                    min={1}
                    max={maxRequestQuantity}
                    onChange={handleQuantityChange}
                    className="w-full px-2 py-1 text-sm"
                  />
                  <span className="ml-1 text-sm text-gray-600">{item.unit}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowQuantityInput(false);
                    setRequestError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-coffee-green hover:bg-coffee-green/90 flex items-center justify-center gap-1"
                  variant="default"
                  size="sm"
                  onClick={handleAddToRequest}
                >
                  <Check size={16} />
                  Confirm Request
                </Button>
              </div>
            </>
          )}
          
          {requestError && (
            <Alert variant="destructive" className="mt-2 py-2 px-3">
              <AlertDescription className="text-xs flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {requestError}
              </AlertDescription>
            </Alert>
          )}
          
          {requestSubmitted && (
            <Alert className="mt-2 py-2 px-3 bg-green-50 border-green-200">
              <AlertDescription className="text-xs flex items-center text-green-800">
                <Check size={14} className="mr-1" />
                Inventory request placed successfully!
              </AlertDescription>
            </Alert>
          )}
        </div>
      ) : (
        <Button 
          className="w-full mt-3 bg-coffee-green hover:bg-coffee-green/90"
          variant="default"
          size="sm"
          onClick={() => onUpdateClick(item)}
        >
          Update Inventory
        </Button>
      )}
    </div>
  );
};

export default InventoryItem;

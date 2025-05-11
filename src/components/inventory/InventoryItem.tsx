
import React from 'react';
import { Button } from "@/components/ui/button";
import { type InventoryItem } from "@/hooks/useInventory";
import { Plus } from 'lucide-react';

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
  const [requestQuantity, setRequestQuantity] = React.useState(1);
  
  const handleAddToRequest = () => {
    if (onAddToRequest) {
      onAddToRequest(item, requestQuantity);
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
          <div className="flex items-center space-x-2 mb-2">
            <label className="text-sm text-gray-600">Quantity:</label>
            <input 
              type="number" 
              value={requestQuantity}
              min={1}
              onChange={(e) => setRequestQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 px-2 py-1 border border-gray-200 rounded text-sm"
            />
            <span className="text-sm text-gray-600">{item.unit}</span>
          </div>
          <Button 
            className="w-full bg-coffee-green hover:bg-coffee-green/90 flex items-center justify-center gap-1"
            variant="default"
            size="sm"
            onClick={handleAddToRequest}
          >
            <Plus size={16} />
            Add to Request
          </Button>
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

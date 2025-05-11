
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  reorder_level: number;
  price_per_unit: number;
  unit: string;
}

const InventorySidebar = () => {
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
        // Using fetch API with direct URL construction to avoid protected property access
        const apiUrl = `${process.env.SUPABASE_URL || 'https://yourprojectid.supabase.co'}/rest/v1/inventory?select=*&order=name`;
        const apiKey = process.env.SUPABASE_ANON_KEY || supabase.auth.session()?.access_token || '';
        
        const response = await fetch(apiUrl, {
          headers: {
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
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

      // Update inventory item using fetch API with direct URL construction
      const apiUrl = `${process.env.SUPABASE_URL || 'https://yourprojectid.supabase.co'}/rest/v1/inventory?id=eq.${selectedItem.id}`;
      const apiKey = process.env.SUPABASE_ANON_KEY || supabase.auth.session()?.access_token || '';
      
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

  // Filter inventory based on status (below reorder level or not)
  const lowStockItems = inventory.filter(item => item.quantity <= item.reorder_level);
  const healthyStockItems = inventory.filter(item => item.quantity > item.reorder_level);

  return (
    <div className="fixed right-0 top-0 h-screen w-80 border-l border-gray-200 bg-white shadow-lg overflow-y-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-coffee-green flex items-center gap-2">
        <Package size={20} />
        Inventory Management
      </h2>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="low">Low Stock</TabsTrigger>
          <TabsTrigger value="healthy">Healthy</TabsTrigger>
        </TabsList>
        
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

        <TabsContent value="all" className="mt-0">
          <div className="space-y-4">
            {inventory.map((item) => (
              <InventoryCard 
                key={item.id} 
                item={item} 
                onUpdate={handleUpdateInventory} 
              />
            ))}
            
            {inventory.length === 0 && !loading && !error && (
              <div className="text-center py-6 text-gray-500">
                <p>No inventory items found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="low" className="mt-0">
          <div className="space-y-4">
            {lowStockItems.map((item) => (
              <InventoryCard 
                key={item.id} 
                item={item} 
                onUpdate={handleUpdateInventory} 
                isLowStock 
              />
            ))}
            
            {lowStockItems.length === 0 && !loading && !error && (
              <div className="text-center py-6 text-gray-500">
                <p>No items with low stock</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="healthy" className="mt-0">
          <div className="space-y-4">
            {healthyStockItems.map((item) => (
              <InventoryCard 
                key={item.id} 
                item={item}
                onUpdate={handleUpdateInventory}
              />
            )}
            
            {healthyStockItems.length === 0 && !loading && !error && (
              <div className="text-center py-6 text-gray-500">
                <p>No items with healthy stock levels</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

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

// Extracted InventoryCard component for better organization
interface InventoryCardProps {
  item: InventoryItem;
  onUpdate: (item: InventoryItem) => void;
  isLowStock?: boolean;
}

const InventoryCard = ({ item, onUpdate, isLowStock }: InventoryCardProps) => {
  const stockStatus = item.quantity <= item.reorder_level;
  
  return (
    <div 
      className={`border rounded-lg shadow-sm p-4 transition-all ${
        stockStatus ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-lg">{item.name}</h3>
        {stockStatus && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
            Low Stock
          </span>
        )}
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Available:</span>
          <span className={`font-medium ${stockStatus ? 'text-red-700' : 'text-green-700'}`}>
            {item.quantity} {item.unit}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Reorder Level:</span>
          <span className="text-gray-900">{item.reorder_level} {item.unit}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Price:</span>
          <span className="text-gray-900">₹{item.price_per_unit} per {item.unit}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className={`h-2.5 rounded-full ${
              stockStatus ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(100, (item.quantity / (item.reorder_level * 2)) * 100)}%` }}
          ></div>
        </div>
      </div>
      
      <Button 
        className="w-full mt-3 bg-coffee-green hover:bg-coffee-green/90"
        variant="default"
        size="sm"
        onClick={() => onUpdate(item)}
      >
        Update Stock
      </Button>
    </div>
  );
};

export default InventorySidebar;

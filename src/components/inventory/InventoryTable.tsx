
import React, { useState } from 'react';
import { useInventory, type InventoryItem } from "@/hooks/useInventory";
import { useToast } from "@/hooks/use-toast";
import UpdateInventoryDialog from "@/components/inventory/UpdateInventoryDialog";
import InventoryRequestDialog from "@/components/inventory/InventoryRequestDialog";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, AlertTriangle, PlusCircle, ArrowDownToLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { addBusinessDays } from 'date-fns';

const InventoryTable = () => {
  const { inventory, loading, error, updateInventoryItem } = useInventory();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [requestItems, setRequestItems] = useState<Array<InventoryItem & { requestQuantity: number }>>([]);

  // Calculate estimated delivery date (2 business days from now)
  const estimatedDeliveryDate = addBusinessDays(new Date(), 2);

  const handleUpdateInventory = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleConfirmUpdate = async (itemId: string, newQuantity: number) => {
    return await updateInventoryItem(itemId, newQuantity);
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

  const handleRequestStock = (item: InventoryItem) => {
    setSelectedItem(item);
    // Default request quantity can be set based on the reorder level or a fixed amount
    const defaultQuantity = item.reorder_level * 2 - item.quantity; // Just an example calculation
    handleAddToRequest(item, defaultQuantity > 0 ? defaultQuantity : item.reorder_level);
    setIsRequestDialogOpen(true);
  };

  const clearRequest = () => {
    setRequestItems([]);
  };

  // Filter items based on search query
  const filteredItems = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-coffee-green border-t-transparent rounded-full"></div>
        <p className="mt-2 text-sm text-gray-500">Loading inventory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle size={16} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Add Item
          </Button>
          {requestItems.length > 0 && (
            <Button 
              variant="default"
              className="bg-coffee-green hover:bg-coffee-green/90 flex items-center gap-2"
              onClick={() => setIsRequestDialogOpen(true)}
            >
              <ArrowDownToLine size={16} />
              Review Request ({requestItems.length})
            </Button>
          )}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Item Name</TableHead>
            <TableHead className="w-[15%]">Category</TableHead>
            <TableHead className="w-[15%] text-center">Current Stock</TableHead>
            <TableHead className="w-[15%] text-center">Reorder Level</TableHead>
            <TableHead className="w-[15%] text-right">Price</TableHead>
            <TableHead className="w-[10%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                No inventory items found
              </TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item) => {
              // Determine if stock is low (at or below reorder level)
              const isLowStock = item.quantity <= item.reorder_level;
              
              return (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700">
                      {item.category || 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-medium ${
                      isLowStock 
                        ? 'text-red-500' 
                        : item.quantity <= item.reorder_level * 1.5 
                          ? 'text-amber-500' 
                          : 'text-green-500'
                    }`}>
                      {item.quantity} {item.unit}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.reorder_level} {item.unit}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{item.price_per_unit.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleUpdateInventory(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {isLowStock && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8"
                        onClick={() => handleRequestStock(item)}
                      >
                        Request
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

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
        estimatedDeliveryDate={estimatedDeliveryDate.toISOString()}
      />
    </Card>
  );
};

export default InventoryTable;

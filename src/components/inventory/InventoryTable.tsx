
import React, { useState, useEffect } from 'react';
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
import { Search, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { addBusinessDays, format } from 'date-fns';
import { useInventoryRequests } from '@/hooks/useInventoryRequests';
import { Textarea } from '@/components/ui/textarea';

const InventoryTable = () => {
  const { inventory, loading, error, updateInventoryItem } = useInventory();
  const { fetchRequestHistory } = useInventoryRequests();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [requestItems, setRequestItems] = useState<Array<InventoryItem & { requestQuantity: number; notes?: string }>>([]);
  const [expandedHistoryRows, setExpandedHistoryRows] = useState<Record<string, boolean>>({});
  const [historyData, setHistoryData] = useState<Record<string, any[]>>({});
  const [historyLoading, setHistoryLoading] = useState<Record<string, boolean>>({});
  const [staffEnteredQuantities, setStaffEnteredQuantities] = useState<Record<string, number>>({});
  const [requestedQuantities, setRequestedQuantities] = useState<Record<string, number>>({});
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [isRequestMode, setIsRequestMode] = useState<boolean>(false);
  
  // Calculate estimated delivery date (2 business days from now)
  const estimatedDeliveryDate = addBusinessDays(new Date(), 2);

  useEffect(() => {
    // Initialize staff entered quantities with current inventory quantities
    const initialStaffQuantities: Record<string, number> = {};
    inventory.forEach(item => {
      initialStaffQuantities[item.id] = item.quantity;
    });
    setStaffEnteredQuantities(initialStaffQuantities);
  }, [inventory]);

  const handleUpdateInventory = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleConfirmUpdate = async (itemId: string, newQuantity: number) => {
    return await updateInventoryItem(itemId, newQuantity);
  };

  const toggleHistory = async (itemId: string) => {
    const isExpanded = expandedHistoryRows[itemId] || false;
    setExpandedHistoryRows({
      ...expandedHistoryRows,
      [itemId]: !isExpanded
    });
    
    if (!isExpanded && !historyData[itemId]) {
      setHistoryLoading({
        ...historyLoading,
        [itemId]: true
      });
      
      try {
        // This would need to be modified to fetch history based on inventory item rather than a specific request
        const history = await fetchRequestHistory(itemId);
        setHistoryData({
          ...historyData,
          [itemId]: history || []
        });
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setHistoryLoading({
          ...historyLoading,
          [itemId]: false
        });
      }
    }
  };

  const handleAddToRequest = (item: InventoryItem) => {
    const quantity = requestedQuantities[item.id];
    const notes = itemNotes[item.id];
    
    if (!quantity) return;
    
    // Check if item already exists in request
    const existingItemIndex = requestItems.findIndex(reqItem => reqItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...requestItems];
      updatedItems[existingItemIndex] = { 
        ...updatedItems[existingItemIndex], 
        requestQuantity: quantity,
        notes: notes
      };
      setRequestItems(updatedItems);
    } else {
      // Add new item to request
      setRequestItems([...requestItems, { ...item, requestQuantity: quantity, notes }]);
    }
    
    toast({
      title: "Added to Request",
      description: `${quantity} ${item.unit} of ${item.name} added to your request.`,
    });
    
    // Reset the request mode and form fields
    setIsRequestMode(false);
    setRequestedQuantities({
      ...requestedQuantities,
      [item.id]: 0
    });
    setItemNotes({
      ...itemNotes,
      [item.id]: ''
    });
  };

  const clearRequest = () => {
    setRequestItems([]);
  };

  const handleStaffQuantityChange = (itemId: string, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setStaffEnteredQuantities({
      ...staffEnteredQuantities,
      [itemId]: numValue
    });
  };

  const handleRequestedQuantityChange = (itemId: string, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setRequestedQuantities({
      ...requestedQuantities,
      [itemId]: numValue
    });
  };

  const handleNotesChange = (itemId: string, value: string) => {
    setItemNotes({
      ...itemNotes,
      [itemId]: value
    });
  };

  const toggleRequestMode = () => {
    setIsRequestMode(!isRequestMode);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
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
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={toggleRequestMode}
            className={isRequestMode ? "bg-gray-100" : ""}
          >
            {isRequestMode ? "Cancel Request" : "Request Stock"}
          </Button>
          
          {requestItems.length > 0 && (
            <Button 
              variant="default"
              className="bg-coffee-green hover:bg-coffee-green/90"
              onClick={() => setIsRequestDialogOpen(true)}
            >
              Review Request ({requestItems.length})
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[12%]">Raw Material ID</TableHead>
              <TableHead className="w-[18%]">Raw Material Name</TableHead>
              <TableHead className="w-[15%] text-center">System Stock</TableHead>
              <TableHead className="w-[15%] text-center">Actual Stock</TableHead>
              {isRequestMode && (
                <>
                  <TableHead className="w-[15%] text-center">Order Quantity</TableHead>
                  <TableHead className="w-[20%]">Notes</TableHead>
                </>
              )}
              <TableHead className="w-[15%] text-center">Action</TableHead>
              <TableHead className="w-[10%] text-center">History</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isRequestMode ? 7 : 5} className="h-32 text-center">
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                // Determine if stock is low (at or below reorder level)
                const isLowStock = item.quantity <= item.reorder_level;
                const isExpanded = expandedHistoryRows[item.id] || false;
                const isRequesting = requestedQuantities[item.id] > 0;
                
                return (
                  <React.Fragment key={item.id}>
                    <TableRow className={isRequesting ? "bg-amber-50" : "hover:bg-gray-50"}>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 font-mono">
                          {item.id.substring(0, 6).toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
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
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={staffEnteredQuantities[item.id] || ''}
                          onChange={(e) => handleStaffQuantityChange(item.id, e.target.value)}
                          className="h-9 text-center"
                        />
                      </TableCell>
                      {isRequestMode && (
                        <>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={requestedQuantities[item.id] || ''}
                              onChange={(e) => handleRequestedQuantityChange(item.id, e.target.value)}
                              className="h-9 text-center"
                            />
                          </TableCell>
                          <TableCell>
                            <Textarea
                              placeholder="Add notes..."
                              value={itemNotes[item.id] || ''}
                              onChange={(e) => handleNotesChange(item.id, e.target.value)}
                              className="h-14 text-sm"
                            />
                          </TableCell>
                        </>
                      )}
                      <TableCell className="text-center">
                        {isRequestMode ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!requestedQuantities[item.id]}
                            onClick={() => handleAddToRequest(item)}
                            className={`h-9 w-full ${isLowStock ? 'border-red-200 text-red-600 hover:bg-red-50' : ''}`}
                          >
                            Submit Request
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateInventory(item)}
                            className="h-9 w-full"
                          >
                            Update
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleHistory(item.id)}
                          className="h-9 w-full"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 mx-auto" />
                          ) : (
                            <ChevronDown className="h-4 w-4 mx-auto" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={isRequestMode ? 7 : 5} className="bg-gray-50 py-2 px-4">
                          {historyLoading[item.id] ? (
                            <div className="text-center py-4">
                              <div className="inline-block animate-spin h-4 w-4 border-2 border-coffee-green border-t-transparent rounded-full mr-2"></div>
                              <span className="text-sm text-gray-500">Loading history...</span>
                            </div>
                          ) : historyData[item.id]?.length > 0 ? (
                            <div className="text-sm">
                              <h4 className="font-medium mb-2">Request History</h4>
                              <div className="grid grid-cols-4 gap-4 text-xs text-gray-600">
                                <div className="font-medium">Date</div>
                                <div className="font-medium">Previous Status</div>
                                <div className="font-medium">New Status</div>
                                <div className="font-medium">Notes</div>
                                
                                {historyData[item.id].map((history, idx) => (
                                  <React.Fragment key={idx}>
                                    <div>
                                      {formatDate(history.created_at)}
                                    </div>
                                    <div>{history.previous_status}</div>
                                    <div>{history.new_status}</div>
                                    <div>{history.notes || '-'}</div>
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 py-2">No order history found.</p>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

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

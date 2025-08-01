
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { useVendors } from '@/hooks/useVendors';
import { usePurchaseOrders } from '@/hooks/usePurchaseOrders';
import { useInventory } from '@/hooks/useInventory';

interface CreatePurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OrderItem {
  inventory_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const CreatePurchaseOrderDialog = ({ open, onOpenChange }: CreatePurchaseOrderDialogProps) => {
  const { vendors } = useVendors();
  const { inventory } = useInventory();
  const { createPurchaseOrder } = usePurchaseOrders();
  
  const [formData, setFormData] = useState({
    vendor_id: '',
    outlet_id: '', // This would come from user context in real app
    franchise_owner_id: '', // This would come from auth context
    expected_delivery_date: '',
    notes: ''
  });
  
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOrderItem = () => {
    setOrderItems([...orderItems, {
      inventory_item_id: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0
    }]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate total price
    if (field === 'quantity' || field === 'unit_price') {
      updatedItems[index].total_price = updatedItems[index].quantity * updatedItems[index].unit_price;
    }
    
    setOrderItems(updatedItems);
  };

  const getTotalAmount = () => {
    return orderItems.reduce((sum, item) => sum + item.total_price, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendor_id || orderItems.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      await createPurchaseOrder(
        {
          ...formData,
          total_amount: getTotalAmount(),
          status: 'pending',
          order_date: new Date().toISOString()
        },
        orderItems
      );
      
      // Reset form
      setFormData({
        vendor_id: '',
        outlet_id: '',
        franchise_owner_id: '',
        expected_delivery_date: '',
        notes: ''
      });
      setOrderItems([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating purchase order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInventoryItemName = (itemId: string) => {
    const item = inventory.find(inv => inv.id === itemId);
    return item ? `${item.name} (${item.unit})` : '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendor">Vendor *</Label>
              <Select value={formData.vendor_id} onValueChange={(value) => 
                setFormData({...formData, vendor_id: value})
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map(vendor => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="expected_delivery_date">Expected Delivery Date</Label>
              <Input
                id="expected_delivery_date"
                type="date"
                value={formData.expected_delivery_date}
                onChange={(e) => setFormData({...formData, expected_delivery_date: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any special instructions or notes"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Order Items</Label>
              <Button type="button" onClick={addOrderItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            {orderItems.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Inventory Item</TableHead>
                      <TableHead className="w-24">Quantity</TableHead>
                      <TableHead className="w-32">Unit Price</TableHead>
                      <TableHead className="w-32">Total</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select 
                            value={item.inventory_item_id} 
                            onValueChange={(value) => updateOrderItem(index, 'inventory_item_id', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {inventory.map(invItem => (
                                <SelectItem key={invItem.id} value={invItem.id}>
                                  {invItem.name} ({invItem.unit})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => updateOrderItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          ${item.total_price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOrderItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {orderItems.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-lg font-bold text-coffee-green">
                    ${getTotalAmount().toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={!formData.vendor_id || orderItems.length === 0 || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePurchaseOrderDialog;

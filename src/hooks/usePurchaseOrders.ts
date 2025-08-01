
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PurchaseOrder, PurchaseOrderItem } from '@/types/inventory-enhanced';

// Mock data for purchase orders since the tables don't exist yet
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    po_number: 'PO-2024-001',
    outlet_id: 'outlet-1',
    vendor_id: 'vendor-1',
    franchise_owner_id: 'owner-1',
    status: 'pending',
    total_amount: 1500.00,
    order_date: new Date().toISOString(),
    expected_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Regular monthly order',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    outlet: {
      id: 'outlet-1',
      name: 'Downtown Coffee',
      address: '123 Main St',
      phone: '+1-555-0123',
      email: 'downtown@coffee.com',
      franchise_owner_id: 'owner-1',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    vendor: {
      id: 'vendor-1',
      name: 'Coffee Bean Suppliers',
      contact_person: 'John Smith',
      email: 'john@suppliers.com',
      phone: '+1-555-0456',
      address: '456 Supplier Ave',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    items: [
      {
        id: 'item-1',
        purchase_order_id: '1',
        inventory_item_id: 'inv-1',
        quantity: 50,
        unit_price: 15.00,
        total_price: 750.00,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        inventory_item: {
          id: 'inv-1',
          name: 'Premium Coffee Beans',
          unit: 'kg',
          category: 'Coffee'
        }
      }
    ]
  }
];

export const usePurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPurchaseOrders(mockPurchaseOrders);
    } catch (err: any) {
      console.error('Error fetching purchase orders:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch purchase orders.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPurchaseOrder = async (
    orderData: Omit<PurchaseOrder, 'id' | 'po_number' | 'created_at' | 'updated_at' | 'items'>,
    items: Omit<PurchaseOrderItem, 'id' | 'purchase_order_id' | 'created_at' | 'updated_at'>[]
  ) => {
    try {
      const newId = `po-${Date.now()}`;
      const poNumber = `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`;
      
      const newOrder: PurchaseOrder = {
        ...orderData,
        id: newId,
        po_number: poNumber,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: items.map((item, index) => ({
          ...item,
          id: `item-${newId}-${index}`,
          purchase_order_id: newId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      };
      
      setPurchaseOrders(prev => [newOrder, ...prev]);
      
      toast({
        title: "Success",
        description: `Purchase order ${poNumber} created successfully.`,
      });
      
      return newOrder;
    } catch (err: any) {
      console.error('Error creating purchase order:', err);
      toast({
        title: "Error",
        description: "Failed to create purchase order.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updatePurchaseOrderStatus = async (orderId: string, status: PurchaseOrder['status']) => {
    try {
      setPurchaseOrders(prev => 
        prev.map(po => 
          po.id === orderId 
            ? { ...po, status, updated_at: new Date().toISOString() } 
            : po
        )
      );
      
      toast({
        title: "Success",
        description: `Purchase order status updated to ${status}.`,
      });
      
      return { success: true };
    } catch (err: any) {
      console.error('Error updating purchase order:', err);
      toast({
        title: "Error",
        description: "Failed to update purchase order status.",
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    purchaseOrders,
    loading,
    error,
    createPurchaseOrder,
    updatePurchaseOrderStatus,
    refreshPurchaseOrders: fetchPurchaseOrders
  };
};

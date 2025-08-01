
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PurchaseOrder, PurchaseOrderItem } from '@/types/inventory-enhanced';

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
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          outlet:outlets(id, name, address),
          vendor:vendors(id, name, contact_person),
          items:purchase_order_items(
            *,
            inventory_item:inventory(id, name, unit, category)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPurchaseOrders(data || []);
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
      // Create the purchase order
      const { data: poData, error: poError } = await supabase
        .from('purchase_orders')
        .insert(orderData)
        .select()
        .single();
      
      if (poError) throw poError;
      
      // Create purchase order items
      const itemsWithPoId = items.map(item => ({
        ...item,
        purchase_order_id: poData.id
      }));
      
      const { data: itemsData, error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(itemsWithPoId)
        .select(`
          *,
          inventory_item:inventory(id, name, unit, category)
        `);
      
      if (itemsError) throw itemsError;
      
      const completeOrder = { ...poData, items: itemsData };
      setPurchaseOrders(prev => [completeOrder, ...prev]);
      
      toast({
        title: "Success",
        description: `Purchase order ${poData.po_number} created successfully.`,
      });
      
      return completeOrder;
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
      const { data, error } = await supabase
        .from('purchase_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();
      
      if (error) throw error;
      
      setPurchaseOrders(prev => prev.map(po => po.id === orderId ? { ...po, status } : po));
      
      toast({
        title: "Success",
        description: `Purchase order status updated to ${status}.`,
      });
      
      return data;
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

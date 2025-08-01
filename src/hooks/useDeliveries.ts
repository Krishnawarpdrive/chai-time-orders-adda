
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Delivery, DeliveryItem } from '@/types/inventory-enhanced';

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select(`
          *,
          purchase_order:purchase_orders(*),
          vendor:vendors(*),
          outlet:outlets(*),
          items:delivery_items(
            *,
            inventory_item:inventory(id, name, unit, category)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Type cast the data to match our TypeScript definitions
      const typedDeliveries = (data || []).map(delivery => ({
        ...delivery,
        status: delivery.status as Delivery['status']
      })) as Delivery[];
      
      setDeliveries(typedDeliveries);
    } catch (err: any) {
      console.error('Error fetching deliveries:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch deliveries.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, status: Delivery['status']) => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .update({ 
          status, 
          updated_at: new Date().toISOString(),
          ...(status === 'received' && { received_date: new Date().toISOString() })
        })
        .eq('id', deliveryId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Type cast the updated data
      const typedData = {
        ...data,
        status: data.status as Delivery['status']
      } as Delivery;
      
      setDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, ...typedData } : d));
      toast({
        title: "Success",
        description: "Delivery status updated successfully.",
      });
      
      return typedData;
    } catch (err: any) {
      console.error('Error updating delivery status:', err);
      toast({
        title: "Error",
        description: "Failed to update delivery status.",
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    deliveries,
    loading,
    error,
    updateDeliveryStatus,
    refreshDeliveries: fetchDeliveries
  };
};

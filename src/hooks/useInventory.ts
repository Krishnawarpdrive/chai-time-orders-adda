
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  reorder_level: number;
  price_per_unit: number;
  unit: string;
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch inventory data
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setInventory(data as InventoryItem[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory data');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateInventoryItem = async (itemId: string, newQuantity: number) => {
    try {
      // Update inventory item using Supabase client
      const { error } = await supabase
        .from('inventory')
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;

      // Update local state
      setInventory(inventory.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      ));

      // Show success message
      toast({
        title: "Inventory Updated",
        description: `Successfully updated inventory item.`,
      });

      return true;
    } catch (err: any) {
      console.error('Error updating inventory:', err);
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update inventory.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    inventory,
    loading,
    error,
    updateInventoryItem
  };
};

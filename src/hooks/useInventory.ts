
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
  category?: string;
  last_restocked?: string;
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch inventory data
  useEffect(() => {
    fetchInventory();
    
    // Subscribe to realtime changes on the inventory table
    const channel = supabase
      .channel('inventory_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory' },
        (payload) => {
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
          updated_at: new Date().toISOString(),
          last_restocked: new Date().toISOString() // Track when it was restocked
        })
        .eq('id', itemId);

      if (error) throw error;

      // Update local state
      setInventory(inventory.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity, last_restocked: new Date().toISOString() } 
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

  // Group inventory items by category
  const getInventoryByCategory = () => {
    const categories: Record<string, InventoryItem[]> = {};
    
    inventory.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    
    return categories;
  };

  // Get low stock items (below or at reorder level)
  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.reorder_level);
  };
  
  // Create a new inventory item
  const createInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .insert({
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Item Created",
        description: `Successfully added ${item.name} to inventory.`,
      });
      
      return data[0] as InventoryItem;
    } catch (err: any) {
      console.error('Error creating inventory item:', err);
      toast({
        title: "Creation Failed",
        description: err.message || "Failed to create inventory item.",
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    inventory,
    loading,
    error,
    updateInventoryItem,
    getInventoryByCategory,
    getLowStockItems,
    createInventoryItem,
    refreshInventory: fetchInventory
  };
};

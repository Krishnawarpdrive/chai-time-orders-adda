
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
          console.log('Inventory realtime update:', payload);
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInventory = async () => {
    console.log('Fetching inventory data...');
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched inventory data:', data);
      setInventory(data as InventoryItem[]);
    } catch (err: any) {
      console.error('Error fetching inventory:', err);
      setError(err.message || 'Failed to fetch inventory data');
      toast({
        title: "Error",
        description: "Failed to fetch inventory data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateInventoryItem = async (itemId: string, newQuantity: number) => {
    console.log('Updating inventory item:', { itemId, newQuantity });
    
    try {
      const { error } = await supabase
        .from('inventory')
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString(),
          last_restocked: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) {
        console.error('Error updating inventory:', error);
        throw error;
      }

      console.log('Successfully updated inventory item');
      
      // Update local state
      setInventory(inventory.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity, last_restocked: new Date().toISOString() } 
          : item
      ));

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
    console.log('Creating new inventory item:', item);
    
    try {
      const { data, error } = await supabase
        .from('inventory')
        .insert({
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) {
        console.error('Error creating inventory item:', error);
        throw error;
      }
      
      console.log('Successfully created inventory item:', data);
      
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

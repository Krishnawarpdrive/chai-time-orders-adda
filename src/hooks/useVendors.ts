
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Vendor, VendorProduct } from '@/types/inventory-enhanced';

export const useVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVendors();
    fetchVendorProducts();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setVendors(data || []);
    } catch (err: any) {
      console.error('Error fetching vendors:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch vendors.",
        variant: "destructive"
      });
    }
  };

  const fetchVendorProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_products')
        .select(`
          *,
          vendor:vendors(*),
          inventory_item:inventory(id, name, unit, category)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setVendorProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching vendor products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createVendor = async (vendorData: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert(vendorData)
        .select()
        .single();
      
      if (error) throw error;
      
      setVendors(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Vendor created successfully.",
      });
      
      return data;
    } catch (err: any) {
      console.error('Error creating vendor:', err);
      toast({
        title: "Error",
        description: "Failed to create vendor.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateVendor = async (vendorId: string, updates: Partial<Vendor>) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', vendorId)
        .select()
        .single();
      
      if (error) throw error;
      
      setVendors(prev => prev.map(v => v.id === vendorId ? data : v));
      toast({
        title: "Success",
        description: "Vendor updated successfully.",
      });
      
      return data;
    } catch (err: any) {
      console.error('Error updating vendor:', err);
      toast({
        title: "Error",
        description: "Failed to update vendor.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const getVendorsByProduct = (inventoryItemId: string) => {
    return vendorProducts
      .filter(vp => vp.inventory_item_id === inventoryItemId && vp.is_available)
      .sort((a, b) => a.vendor_price - b.vendor_price);
  };

  return {
    vendors,
    vendorProducts,
    loading,
    error,
    createVendor,
    updateVendor,
    getVendorsByProduct,
    refreshVendors: fetchVendors,
    refreshVendorProducts: fetchVendorProducts
  };
};

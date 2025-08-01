
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Outlet } from '@/types/inventory-enhanced';

export const useOutlets = () => {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOutlets();
  }, []);

  const fetchOutlets = async () => {
    try {
      const { data, error } = await supabase
        .from('outlets')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setOutlets(data || []);
    } catch (err: any) {
      console.error('Error fetching outlets:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch outlets.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createOutlet = async (outletData: Omit<Outlet, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('outlets')
        .insert(outletData)
        .select()
        .single();
      
      if (error) throw error;
      
      setOutlets(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Outlet created successfully.",
      });
      
      return data;
    } catch (err: any) {
      console.error('Error creating outlet:', err);
      toast({
        title: "Error",
        description: "Failed to create outlet.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateOutlet = async (outletId: string, updates: Partial<Outlet>) => {
    try {
      const { data, error } = await supabase
        .from('outlets')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', outletId)
        .select()
        .single();
      
      if (error) throw error;
      
      setOutlets(prev => prev.map(o => o.id === outletId ? data : o));
      toast({
        title: "Success",
        description: "Outlet updated successfully.",
      });
      
      return data;
    } catch (err: any) {
      console.error('Error updating outlet:', err);
      toast({
        title: "Error",
        description: "Failed to update outlet.",
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    outlets,
    loading,
    error,
    createOutlet,
    updateOutlet,
    refreshOutlets: fetchOutlets
  };
};

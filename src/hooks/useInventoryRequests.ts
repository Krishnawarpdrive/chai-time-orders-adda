
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface InventoryRequest {
  id: string;
  inventory_item_id: string;
  staff_entered_quantity: number;
  requested_quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by_user_id?: string;
  rejected_reason?: string;
  inventory_item?: {
    name: string;
    quantity: number;
    reorder_level: number;
    unit: string;
    category?: string;
  };
}

export interface InventoryRequestHistory {
  id: string;
  inventory_request_id: string;
  previous_status: string;
  new_status: string;
  notes?: string;
  created_at: string;
  user_id?: string;
}

export const useInventoryRequests = () => {
  const [requests, setRequests] = useState<InventoryRequest[]>([]);
  const [requestHistory, setRequestHistory] = useState<Record<string, InventoryRequestHistory[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all inventory requests with inventory item details
  useEffect(() => {
    fetchInventoryRequests();

    // Subscribe to realtime changes on the inventory_requests table
    const channel = supabase
      .channel('inventory_requests_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory_requests' },
        (payload) => {
          fetchInventoryRequests();
          toast({
            title: "Inventory Request Updated",
            description: "An inventory request was updated.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInventoryRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_requests')
        .select(`
          *,
          inventory_item:inventory_item_id (
            name,
            quantity, 
            reorder_level,
            unit,
            category
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRequests(data as InventoryRequest[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory requests');
      console.error('Error fetching inventory requests:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new inventory request
  const createInventoryRequest = async (
    inventoryItemId: string,
    staffEnteredQuantity: number,
    requestedQuantity: number,
    notes?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('inventory_requests')
        .insert({
          inventory_item_id: inventoryItemId,
          staff_entered_quantity: staffEnteredQuantity,
          requested_quantity: requestedQuantity,
          notes: notes,
          status: 'pending'
        })
        .select();

      if (error) throw error;

      toast({
        title: "Request Created",
        description: "Inventory request has been submitted successfully.",
      });

      return data[0];
    } catch (err: any) {
      toast({
        title: "Request Failed",
        description: err.message || "Failed to create inventory request.",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Update the status of an inventory request (approve/reject)
  const updateRequestStatus = async (
    requestId: string, 
    status: 'approved' | 'rejected', 
    notes?: string,
    rejectedReason?: string
  ) => {
    try {
      const updateData: any = {
        status,
        notes,
        updated_at: new Date().toISOString()
      };

      if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
        updateData.approved_by_user_id = (await supabase.auth.getUser()).data.user?.id;
      } else if (status === 'rejected') {
        updateData.rejected_reason = rejectedReason;
      }

      const { data, error } = await supabase
        .from('inventory_requests')
        .update(updateData)
        .eq('id', requestId)
        .select();

      if (error) throw error;

      // If approved, update the inventory quantity
      if (status === 'approved') {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          await updateInventoryQuantity(request.inventory_item_id, request.requested_quantity);
        }
      }

      toast({
        title: status === 'approved' ? "Request Approved" : "Request Rejected",
        description: status === 'approved' 
          ? "The inventory request has been approved." 
          : "The inventory request has been rejected.",
      });

      return data[0];
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update request status.",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Update inventory quantity after approval
  const updateInventoryQuantity = async (inventoryItemId: string, quantityToAdd: number) => {
    try {
      const { data: inventoryItem, error: fetchError } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('id', inventoryItemId)
        .single();

      if (fetchError) throw fetchError;

      const newQuantity = inventoryItem.quantity + quantityToAdd;

      const { error: updateError } = await supabase
        .from('inventory')
        .update({ 
          quantity: newQuantity,
          last_restocked: new Date().toISOString()
        })
        .eq('id', inventoryItemId);

      if (updateError) throw updateError;
    } catch (err: any) {
      console.error('Error updating inventory quantity:', err);
      throw err;
    }
  };

  // Fetch history for a specific request
  const fetchRequestHistory = async (requestId: string) => {
    try {
      if (requestHistory[requestId]) {
        return requestHistory[requestId];
      }

      const { data, error } = await supabase
        .from('inventory_request_history')
        .select('*')
        .eq('inventory_request_id', requestId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      const history = data as InventoryRequestHistory[];
      setRequestHistory(prev => ({
        ...prev,
        [requestId]: history
      }));
      
      return history;
    } catch (err: any) {
      console.error('Error fetching request history:', err);
      return [];
    }
  };

  return {
    requests,
    loading,
    error,
    createInventoryRequest,
    updateRequestStatus,
    fetchRequestHistory,
    refreshRequests: fetchInventoryRequests
  };
};

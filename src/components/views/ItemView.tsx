
import React, { useState, useEffect } from 'react';
import ItemOrdersTable from '@/components/tables/ItemOrdersTable';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { TooltipProvider } from '@/components/ui/tooltip';

export const ItemView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch items from Supabase
  useEffect(() => {
    const fetchItemsData = async () => {
      setLoading(true);
      try {
        const fetchedItems = await orderService.getItemBasedView();
        setItemsData(fetchedItems);
      } catch (error) {
        console.error("Error fetching items data:", error);
        toast({
          title: "Error",
          description: "Failed to load items. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItemsData();
  }, [toast]);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'order_items' },
        (payload) => {
          // Refresh items when changes occur
          orderService.getItemBasedView().then(updatedItems => {
            setItemsData(updatedItems);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter items based on search
  const filteredItems = itemsData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search items..."
            className="pl-10 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ItemOrdersTable items={filteredItems} loading={loading} />
      </div>
    </TooltipProvider>
  );
};

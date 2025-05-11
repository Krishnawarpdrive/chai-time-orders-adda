
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, ShoppingBag, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  reorder_level: number;
  price_per_unit: number;
  unit: string;
}

const Products = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0
  });

  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        // Using fetch API with direct URL construction to avoid protected property access
        const apiUrl = `${process.env.SUPABASE_URL || 'https://yourprojectid.supabase.co'}/rest/v1/inventory?select=*&order=name`;
        const apiKey = process.env.SUPABASE_ANON_KEY || supabase.auth.session()?.access_token || '';
        
        const response = await fetch(apiUrl, {
          headers: {
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setInventory(data as InventoryItem[]);
        
        // Calculate summary statistics
        const lowStockCount = data.filter((item: InventoryItem) => 
          item.quantity <= item.reorder_level
        ).length;
        
        const totalInventoryValue = data.reduce((sum: number, item: InventoryItem) => 
          sum + (item.quantity * item.price_per_unit), 0
        );
        
        setStats({
          totalItems: data.length,
          lowStockItems: lowStockCount,
          totalValue: totalInventoryValue
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch inventory data');
        console.error('Error fetching inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="flex-1 p-6 bg-milk-sugar overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-hackney text-3xl text-coffee-green mb-6">Inventory Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard 
            title="Total Inventory Items" 
            value={stats.totalItems} 
            icon={<Package className="h-6 w-6" />}
            color="bg-blue-100 text-blue-800"
          />
          <StatsCard 
            title="Low Stock Items" 
            value={stats.lowStockItems}
            icon={<AlertCircle className="h-6 w-6" />} 
            color="bg-red-100 text-red-800"
          />
          <StatsCard 
            title="Total Inventory Value" 
            value={`₹${stats.totalValue.toLocaleString()}`}
            icon={<ShoppingBag className="h-6 w-6" />} 
            color="bg-green-100 text-green-800"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-8 w-8 text-coffee-green" />
          </div>
        ) : error ? (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle size={20} />
                <p className="font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Inventory Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your inventory using the sidebar on the right. View detailed information about your stock levels here.
              </p>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4 max-w-md">
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="low">Low Stock</TabsTrigger>
                  <TabsTrigger value="healthy">Healthy</TabsTrigger>
                </TabsList>
                
                <InventoryTabContent 
                  value="all" 
                  items={inventory} 
                  emptyMessage="No inventory items found" 
                />
                
                <InventoryTabContent 
                  value="low" 
                  items={inventory.filter(item => item.quantity <= item.reorder_level)} 
                  emptyMessage="No items with low stock" 
                />
                
                <InventoryTabContent 
                  value="healthy" 
                  items={inventory.filter(item => item.quantity > item.reorder_level)} 
                  emptyMessage="No items with healthy stock levels" 
                />
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface InventoryTabContentProps {
  value: string;
  items: InventoryItem[];
  emptyMessage: string;
}

const InventoryTabContent = ({ value, items, emptyMessage }: InventoryTabContentProps) => (
  <TabsContent value={value} className="mt-0">
    {items.length > 0 ? (
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted border-b">
              <th className="p-3 text-left font-medium">Item Name</th>
              <th className="p-3 text-left font-medium">Quantity</th>
              <th className="p-3 text-left font-medium">Reorder Level</th>
              <th className="p-3 text-left font-medium">Price per Unit</th>
              <th className="p-3 text-left font-medium">Total Value</th>
              <th className="p-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-muted/50">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3">{item.quantity} {item.unit}</td>
                <td className="p-3">{item.reorder_level} {item.unit}</td>
                <td className="p-3">₹{item.price_per_unit}</td>
                <td className="p-3">₹{(item.quantity * item.price_per_unit).toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.quantity <= item.reorder_level 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.quantity <= item.reorder_level ? 'Low Stock' : 'Healthy'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    )}
  </TabsContent>
);

export default Products;

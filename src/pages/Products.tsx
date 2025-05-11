
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, ShoppingBag, AlertCircle } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { type InventoryItem } from "@/hooks/useInventory";

const Products = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch inventory data
  useEffect(() => {
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

    fetchInventory();
  }, []);

  // Filter inventory based on status
  const lowStockItems = inventory.filter(item => item.quantity <= item.reorder_level);
  const healthyStockItems = inventory.filter(item => item.quantity > item.reorder_level);

  // Calculate inventory stats
  const totalItems = inventory.length;
  const lowStockCount = lowStockItems.length;
  const inventoryValue = inventory.reduce((total, item) => total + (item.quantity * item.price_per_unit), 0);

  return (
    <div className="flex-1 p-6 bg-milk-sugar overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-hackney text-3xl text-coffee-green mb-6">Inventory Management</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-sm text-muted-foreground">Items in inventory</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{lowStockCount}</div>
              <p className="text-sm text-muted-foreground">Items below reorder level</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{inventoryValue.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">Total value of stock</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for inventory view */}
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="low">Low Stock</TabsTrigger>
                <TabsTrigger value="healthy">Healthy Stock</TabsTrigger>
              </TabsList>
              
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner className="h-8 w-8 text-coffee-green" />
                  <p className="mt-2 text-sm text-gray-500">Loading inventory...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle size={16} />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              <TabsContent value="all" className="mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventory.map((item) => (
                    <ProductCard key={item.id} item={item} />
                  ))}
                  
                  {inventory.length === 0 && !loading && !error && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2">No inventory items found</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="low" className="mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowStockItems.map((item) => (
                    <ProductCard key={item.id} item={item} isLowStock />
                  ))}
                  
                  {lowStockItems.length === 0 && !loading && !error && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2">No items with low stock</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="healthy" className="mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {healthyStockItems.map((item) => (
                    <ProductCard key={item.id} item={item} />
                  ))}
                  
                  {healthyStockItems.length === 0 && !loading && !error && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2">No items with healthy stock levels</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Product Card Component
interface ProductCardProps {
  item: InventoryItem;
  isLowStock?: boolean;
}

const ProductCard = ({ item, isLowStock }: ProductCardProps) => {
  const stockStatus = item.quantity <= item.reorder_level;
  const stockPercentage = Math.min(100, (item.quantity / (item.reorder_level * 2)) * 100);
  
  return (
    <Card className={`overflow-hidden transition-all ${
      stockStatus ? 'border-red-300' : 'border-green-300'
    }`}>
      <CardHeader className={`pb-2 ${
        stockStatus ? 'bg-red-50' : 'bg-green-50'
      }`}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          {stockStatus && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
              Low Stock
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Available:</span>
            <span className={`font-medium ${stockStatus ? 'text-red-700' : 'text-green-700'}`}>
              {item.quantity} {item.unit}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Reorder Level:</span>
            <span className="text-gray-900">{item.reorder_level} {item.unit}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="text-gray-900">₹{item.price_per_unit} per {item.unit}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total Value:</span>
            <span className="text-gray-900 font-medium">₹{(item.quantity * item.price_per_unit).toFixed(2)}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div 
              className={`h-2.5 rounded-full ${
                stockStatus ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Products;

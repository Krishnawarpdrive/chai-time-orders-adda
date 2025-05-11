
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const CustomerMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchMenuItems();
  }, []);
  
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setMenuItems(data || []);
    } catch (error: any) {
      console.error('Error fetching menu items:', error);
      toast({
        title: 'Error fetching menu',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex > -1) {
        // Item exists in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Item doesn't exist in cart, add it
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: 'Item added',
      description: `${item.name} added to cart.`,
    });
  };
  
  const updateQuantity = (id: string, change: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
      
      return updatedCart;
    });
  };
  
  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const checkout = () => {
    toast({
      title: 'Order placed',
      description: 'Your order has been placed successfully.',
    });
    // In a real implementation, this would create an order in the database
    setCart([]);
  };
  
  const getMenuItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };
  
  return (
    <>
      <div className="mb-4 sm:mb-6">
        <h2 className="font-hackney text-2xl sm:text-3xl text-coffee-green mb-1">Menu</h2>
        <p className="text-gray-600 text-xs sm:text-sm">Browse our delicious offerings</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Our Menu</CardTitle>
              <CardDescription>Select your favorite items</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-coffee-green"></div>
                </div>
              ) : (
                <Tabs defaultValue="coffee">
                  <TabsList className="mb-4">
                    <TabsTrigger value="coffee">Coffee</TabsTrigger>
                    <TabsTrigger value="tea">Tea</TabsTrigger>
                    <TabsTrigger value="snack">Snacks</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="coffee">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getMenuItemsByCategory('coffee').map((item) => (
                        <div key={item.id} className="border rounded-md p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <span className="text-coffee-green font-semibold">₹{item.price}</span>
                          </div>
                          <Button 
                            onClick={() => addToCart(item)}
                            size="sm" 
                            className="bg-coffee-green hover:bg-coffee-green/90"
                          >
                            <Plus size={16} className="mr-1" /> Add
                          </Button>
                        </div>
                      ))}
                      
                      {getMenuItemsByCategory('coffee').length === 0 && (
                        <div className="col-span-2 py-8 text-center">
                          <p className="text-gray-500">No coffee items available.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tea">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getMenuItemsByCategory('tea').map((item) => (
                        <div key={item.id} className="border rounded-md p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <span className="text-coffee-green font-semibold">₹{item.price}</span>
                          </div>
                          <Button 
                            onClick={() => addToCart(item)}
                            size="sm" 
                            className="bg-coffee-green hover:bg-coffee-green/90"
                          >
                            <Plus size={16} className="mr-1" /> Add
                          </Button>
                        </div>
                      ))}
                      
                      {getMenuItemsByCategory('tea').length === 0 && (
                        <div className="col-span-2 py-8 text-center">
                          <p className="text-gray-500">No tea items available.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="snack">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getMenuItemsByCategory('snack').map((item) => (
                        <div key={item.id} className="border rounded-md p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <span className="text-coffee-green font-semibold">₹{item.price}</span>
                          </div>
                          <Button 
                            onClick={() => addToCart(item)}
                            size="sm" 
                            className="bg-coffee-green hover:bg-coffee-green/90"
                          >
                            <Plus size={16} className="mr-1" /> Add
                          </Button>
                        </div>
                      ))}
                      
                      {getMenuItemsByCategory('snack').length === 0 && (
                        <div className="col-span-2 py-8 text-center">
                          <p className="text-gray-500">No snack items available.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" /> 
                Your Cart
              </CardTitle>
              <CardDescription>Items you've selected</CardDescription>
            </CardHeader>
            <CardContent>
              {cart.length > 0 ? (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <span className="text-sm text-gray-500">₹{item.price} each</span>
                      </div>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="mx-2 font-medium">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              )}
            </CardContent>
            {cart.length > 0 && (
              <CardFooter className="flex flex-col">
                <div className="w-full flex justify-between py-2 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-coffee-green">₹{getTotalAmount()}</span>
                </div>
                <Button 
                  className="w-full mt-4 bg-coffee-green hover:bg-coffee-green/90"
                  onClick={checkout}
                >
                  Place Order
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default CustomerMenu;

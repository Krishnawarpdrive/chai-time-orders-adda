
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Coffee, Cookie, Leaf, Plus, Minus } from 'lucide-react';
import { MenuItem } from '@/types/supabase';

interface MenuItemsGridProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  isInCart: (itemId: string) => boolean;
  getQuantityInCart: (itemId: string) => number;
}

const MenuItemsGrid: React.FC<MenuItemsGridProps> = ({
  menuItems,
  addToCart,
  removeFromCart,
  isInCart,
  getQuantityInCart
}) => {
  // Get the appropriate icon based on item category
  const getItemIcon = (category: string) => {
    switch (category) {
      case 'coffee':
        return <Coffee className="w-5 h-5 text-coffee-green" />;
      case 'tea':
        return <Leaf className="w-5 h-5 text-coffee-green" />;
      case 'snack':
        return <Cookie className="w-5 h-5 text-bisi-orange" />;
      default:
        return <Coffee className="w-5 h-5 text-coffee-green" />;
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-coffee-green">Menu Items</h3>
        <div className="inline-flex items-center gap-2 bg-milk-sugar px-4 py-2 rounded-full">
          <span className="font-medium text-coffee-green">
            {menuItems.reduce((total, item) => 
              total + (isInCart(item.id) ? getQuantityInCart(item.id) : 0), 0)} items
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="border border-gray-200 p-4">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                {getItemIcon(item.category)}
                <h3 className="text-lg font-medium">{item.name}</h3>
              </div>
              <span className="font-bold">{formatPrice(item.price)}</span>
            </div>
            
            {!isInCart(item.id) ? (
              <Button 
                onClick={() => addToCart(item)}
                className="w-full h-10 bg-coffee-green text-white hover:bg-coffee-green/90 mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            ) : (
              <div className="flex items-center justify-between w-full mt-2">
                <Button 
                  onClick={() => removeFromCart(item.id)}
                  variant="outline" 
                  className="h-10 px-3"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium">{getQuantityInCart(item.id)}</span>
                <Button 
                  onClick={() => addToCart(item)}
                  className="h-10 px-3 bg-coffee-green text-white hover:bg-coffee-green/90"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuItemsGrid;

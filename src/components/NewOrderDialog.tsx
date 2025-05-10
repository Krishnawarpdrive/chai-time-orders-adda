
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Cookie, Leaf, Plus, Minus, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: 'coffee' | 'tea' | 'snack';
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface NewOrderDialogProps {
  onClose: () => void;
}

const menu: MenuItem[] = [
  {
    id: 1,
    name: "Cappuccino",
    price: 100,
    description: "The perfect balance of espresso, steamed milk, and foam.",
    category: 'coffee'
  },
  {
    id: 2,
    name: "Masala Chai",
    price: 80,
    description: "A warm cup of spiced tea, perfect for any time of the day.",
    category: 'tea'
  },
  {
    id: 3,
    name: "Filter Coffee",
    price: 90,
    description: "Freshly brewed filter coffee with strong flavors.",
    category: 'coffee'
  },
  {
    id: 4,
    name: "Biscotti",
    price: 60,
    description: "Crunchy almond biscuits, perfect with coffee.",
    category: 'snack'
  },
  {
    id: 5,
    name: "Green Tea",
    price: 70,
    description: "Light and refreshing tea with antioxidants.",
    category: 'tea'
  }
];

const NewOrderDialog: React.FC<NewOrderDialogProps> = ({ onClose }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

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

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item already in cart, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Item not in cart, add it
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === itemId);
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        if (updatedCart[existingItemIndex].quantity > 1) {
          // Decrease quantity
          updatedCart[existingItemIndex].quantity -= 1;
          return updatedCart;
        } else {
          // Remove item if quantity becomes 0
          return prevCart.filter(item => item.id !== itemId);
        }
      }
      return prevCart;
    });
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Check if item is in cart
  const isInCart = (itemId: number) => {
    return cart.some(item => item.id === itemId);
  };

  // Get quantity of item in cart
  const getQuantityInCart = (itemId: number) => {
    const item = cart.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full overflow-y-auto max-h-[90vh]">
      {/* Header */}
      <div className="bg-milk-sugar p-6 border-b">
        <h2 className="font-hackney text-2xl text-coffee-green mb-2">
          Hello, Let's Order Happiness!
        </h2>
        
        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
          <div>
            <p className="text-gray-500">Customer Name</p>
            <p className="font-medium">Ankita Sharma</p>
          </div>
          <div>
            <p className="text-gray-500">Phone Number</p>
            <p className="font-medium">+91 98 *** ***76</p>
          </div>
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-medium">21 Apr 1992</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-coffee-green">Menu Items</h3>
          <div className="inline-flex items-center gap-2 bg-milk-sugar px-4 py-2 rounded-full">
            <ShoppingCart className="h-5 w-5 text-coffee-green" />
            <span className="font-medium text-coffee-green">
              {cart.reduce((total, item) => total + item.quantity, 0)} items
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menu.map((item) => (
            <Card key={item.id} className="border border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    {getItemIcon(item.category)}
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </div>
                  <span className="font-bold">{formatPrice(item.price)}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-600 text-sm">{item.description}</p>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center">
                {!isInCart(item.id) ? (
                  <Button 
                    onClick={() => addToCart(item)}
                    className="w-full h-12 bg-coffee-green text-white hover:bg-coffee-green/90"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <Button 
                      onClick={() => removeFromCart(item.id)}
                      variant="outline" 
                      className="h-12"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">{getQuantityInCart(item.id)}</span>
                    <Button 
                      onClick={() => addToCart(item)}
                      className="h-12 bg-coffee-green text-white hover:bg-coffee-green/90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="p-6 border-t">
          <h3 className="text-lg font-medium text-coffee-green mb-4">Your Order</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2 last:mb-0">
                <div className="flex items-center gap-2">
                  {getItemIcon(item.category)}
                  <span>{item.name}</span>
                  <span className="text-gray-500">× {item.quantity}</span>
                </div>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 p-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total Amount:</span>
          <span className="text-xl font-bold text-coffee-green">{formatPrice(totalPrice)}</span>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            className="px-6"
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            className="bg-bisi-orange hover:bg-bisi-orange/90 px-6"
            disabled={cart.length === 0}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderDialog;

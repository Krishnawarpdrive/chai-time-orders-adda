
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Coffee, Cookie, Leaf, Plus, Minus, QrCode, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: 'coffee' | 'tea' | 'snack';
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Customer {
  name: string;
  phone: string;
  dob: string;
  badge: 'New' | 'Frequent' | 'Periodic';
}

interface NewOrderFormDialogProps {
  onClose: () => void;
}

// Mock database of customers
const customerDatabase: Customer[] = [
  { name: 'Rajesh Kumar', phone: '9001234567', dob: '15 Jan 1985', badge: 'Frequent' },
  { name: 'Ankita Sharma', phone: '8007654321', dob: '21 Apr 1992', badge: 'Periodic' }
];

// Menu items with specified prices
const menu: MenuItem[] = [
  {
    id: 1,
    name: "Coffee",
    price: 18,
    category: 'coffee'
  },
  {
    id: 2,
    name: "Biscuit",
    price: 12,
    category: 'snack'
  },
  {
    id: 3,
    name: "Lemon Tea",
    price: 18,
    category: 'tea'
  },
  {
    id: 4,
    name: "Black Coffee",
    price: 22,
    category: 'coffee'
  },
  {
    id: 5,
    name: "Masala Chai",
    price: 18,
    category: 'tea'
  }
];

const NewOrderFormDialog: React.FC<NewOrderFormDialogProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [customerBadge, setCustomerBadge] = useState<'New' | 'Frequent' | 'Periodic'>('New');
  const [showQrCode, setShowQrCode] = useState(false);

  // Check if customer exists when phone number changes
  useEffect(() => {
    if (phoneNumber.length >= 10) {
      const existingCustomer = customerDatabase.find(c => 
        c.phone.includes(phoneNumber.substring(phoneNumber.length - 10))
      );
      
      if (existingCustomer) {
        setCustomerName(existingCustomer.name);
        setDob(existingCustomer.dob);
        setCustomerBadge(existingCustomer.badge);
        
        toast({
          title: "Existing Customer Found",
          description: `Welcome back, ${existingCustomer.name}!`,
        });
      } else {
        // Reset fields if no match found
        if (customerName) {
          setCustomerName('');
          setDob('');
          setCustomerBadge('New');
        }
      }
    }
  }, [phoneNumber, toast]);

  // Generate order ID from customer name and phone number
  const generateOrderId = () => {
    if (customerName.length < 2 || phoneNumber.length < 2) return '';
    
    const namePrefix = customerName.substring(0, 2);
    const phoneSuffix = phoneNumber.substring(phoneNumber.length - 2);
    
    return namePrefix + phoneSuffix;
  };

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

  // Handle generate QR code
  const handleGenerateQR = () => {
    if (!customerName || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer name and phone number.",
        variant: "destructive"
      });
      return;
    }
    
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to the cart.",
        variant: "destructive"
      });
      return;
    }
    
    setShowQrCode(true);
  };

  // Handle order submission after payment
  const handleSubmitOrder = () => {
    const orderId = generateOrderId();
    toast({
      title: "Order Created",
      description: `Order ${orderId} has been created successfully.`,
    });
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full overflow-y-auto max-h-[90vh]">
      {/* Header */}
      <div className="bg-milk-sugar p-6 border-b">
        <h2 className="font-hackney text-2xl text-coffee-green mb-2">
          New Order
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="customerName" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
              {customerBadge && (
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                  customerBadge === 'Frequent' ? "bg-green-100 text-green-800" :
                  customerBadge === 'Periodic' ? "bg-blue-100 text-blue-800" :
                  "bg-gray-100 text-gray-800"
                )}>
                  {customerBadge}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Input 
                id="phoneNumber" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Enter phone number"
                className="pl-10"
              />
              <Search className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input 
              id="dob" 
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="DD MMM YYYY"
            />
          </div>
        </div>
      </div>

      {!showQrCode ? (
        <>
          {/* Menu Items */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-coffee-green">Menu Items</h3>
              <div className="inline-flex items-center gap-2 bg-milk-sugar px-4 py-2 rounded-full">
                <span className="font-medium text-coffee-green">
                  {cart.reduce((total, item) => total + item.quantity, 0)} items
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menu.map((item) => (
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
        </>
      ) : (
        // QR Code Section
        <div className="p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium text-coffee-green mb-4">Payment QR Code</h3>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
              <QrCode className="w-32 h-32 text-coffee-green" />
            </div>
            <p className="text-center mt-4 font-medium text-lg">{formatPrice(totalPrice)}</p>
            <p className="text-center text-sm text-gray-500">Order ID: {generateOrderId()}</p>
          </div>
          
          <Button 
            className="bg-coffee-green text-white hover:bg-coffee-green/90 w-48"
            onClick={handleSubmitOrder}
          >
            Confirm Payment
          </Button>
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
          {!showQrCode ? (
            <Button 
              className="bg-bisi-orange hover:bg-bisi-orange/90 px-6"
              disabled={cart.length === 0}
              onClick={handleGenerateQR}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR
            </Button>
          ) : (
            <Button 
              className="bg-gray-300 text-gray-700 hover:bg-gray-300/90 px-6"
              onClick={() => setShowQrCode(false)}
            >
              Back to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewOrderFormDialog;


import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { orderService } from '@/services/orderService';
import { MenuItem, Customer } from '@/types/supabase';
import { Spinner } from '@/components/ui/spinner';
import CustomerForm from './order/CustomerForm';
import MenuItemsGrid from './order/MenuItemsGrid';
import CartSummary from './order/CartSummary';
import PaymentSection from './order/PaymentSection';
import OrderFooter from './order/OrderFooter';
import CouponSystem from './order/CouponSystem';
import { generateOrderId } from '@/utils/orderUtils';

interface CartItem extends MenuItem {
  quantity: number;
}

interface NewOrderFormDialogProps {
  onClose: () => void;
}

const NewOrderFormDialog: React.FC<NewOrderFormDialogProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [customerBadge, setCustomerBadge] = useState<'New' | 'Frequent' | 'Periodic'>('New');
  const [showQrCode, setShowQrCode] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Fetch menu items from Supabase
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoadingMenu(true);
      try {
        const items = await orderService.getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        toast({
          title: "Error",
          description: "Failed to load menu items. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoadingMenu(false);
      }
    };
    
    fetchMenuItems();
  }, [toast]);

  // Generate order ID helper
  const generateOrderIdForForm = () => {
    return generateOrderId(customerName, phoneNumber);
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
  const removeFromCart = (itemId: string) => {
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
  const subtotalPrice = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Calculate final price after discounts
  const totalPrice = Math.max(0, subtotalPrice - discountAmount);

  // Apply coupon discount
  const handleApplyCoupon = (discount: number) => {
    setDiscountAmount(discount);
  };

  // Check if item is in cart
  const isInCart = (itemId: string) => {
    return cart.some(item => item.id === itemId);
  };

  // Get quantity of item in cart
  const getQuantityInCart = (itemId: string) => {
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
  const handleSubmitOrder = async () => {
    setCreatingOrder(true);
    const orderId = generateOrderIdForForm();
    
    try {
      // First, check if we need to create a new customer
      let customer: Customer | null = null;
      
      if (phoneNumber) {
        customer = await orderService.getCustomerByPhone(phoneNumber);
        
        if (!customer && customerName) {
          // Create new customer
          customer = await orderService.createCustomer({
            name: customerName,
            phone_number: phoneNumber,
            dob,
            badge: customerBadge
          });
        }
      }
      
      // Create order
      const order = await orderService.createOrder(
        {
          order_id: orderId,
          customer_name: customerName,
          phone_number: phoneNumber,
          dob,
          customer_badge: customerBadge,
          amount: totalPrice,
          status: 'Pending'
        },
        cart.map(item => ({
          item_id: item.id,
          quantity: item.quantity,
          status: 'Not Started'
        }))
      );
      
      if (order) {
        toast({
          title: "Order Created",
          description: `Order ${orderId} has been created successfully.`,
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to create order. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loadingMenu) {
    return (
      <div className="bg-white rounded-lg shadow-lg w-full p-6 flex flex-col justify-center items-center h-64">
        <Spinner size="large" />
        <p className="mt-4 text-gray-600">Loading menu items...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg w-full overflow-y-auto max-h-[90vh]">
      {/* Customer Form */}
      <CustomerForm 
        customerName={customerName}
        setCustomerName={setCustomerName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        dob={dob}
        setDob={setDob}
        customerBadge={customerBadge}
        setCustomerBadge={setCustomerBadge}
      />

      {!showQrCode ? (
        <>
          {/* Menu Items */}
          <MenuItemsGrid 
            menuItems={menuItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            isInCart={isInCart}
            getQuantityInCart={getQuantityInCart}
          />

          {/* Coupon System */}
          {cart.length > 0 && (
            <CouponSystem 
              phoneNumber={phoneNumber}
              totalPrice={subtotalPrice}
              onApplyCoupon={handleApplyCoupon}
            />
          )}

          {/* Cart Summary */}
          <CartSummary 
            cart={cart} 
            discountAmount={discountAmount}
            subtotalPrice={subtotalPrice}
            totalPrice={totalPrice}
          />
        </>
      ) : (
        // QR Code Section
        <PaymentSection 
          generateOrderId={generateOrderIdForForm}
          totalPrice={totalPrice}
          creatingOrder={creatingOrder}
          handleSubmitOrder={handleSubmitOrder}
        />
      )}

      {/* Footer */}
      <OrderFooter 
        totalPrice={totalPrice}
        onClose={onClose}
        showQrCode={showQrCode}
        setShowQrCode={setShowQrCode}
        handleGenerateQR={handleGenerateQR}
        cart={cart}
        creatingOrder={creatingOrder}
      />
    </div>
  );
};

export default NewOrderFormDialog;

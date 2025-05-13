
import React, { useState, useEffect } from 'react';
import { useCart, CartItem } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface CoffeeCardProps {
  coffee: {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
  };
}

export default function CoffeeCard({ coffee }: CoffeeCardProps) {
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(0);
  
  // Check if the item is already in the cart
  useEffect(() => {
    const cartItem = items.find(item => item.id === coffee.id);
    if (cartItem) {
      setIsInCart(true);
      setItemQuantity(cartItem.quantity);
    } else {
      setIsInCart(false);
      setItemQuantity(0);
    }
  }, [items, coffee.id]);

  const handleAddToCart = () => {
    const item: CartItem = {
      id: coffee.id,
      name: coffee.name,
      price: coffee.price,
      quantity: quantity,
      image: coffee.image
    };
    
    addToCart(item);
    setQuantity(1);
  };
  
  const increaseQuantity = () => {
    if (!isInCart) {
      setQuantity(prev => Math.min(prev + 1, 10));
    } else {
      const item: CartItem = {
        id: coffee.id,
        name: coffee.name,
        price: coffee.price,
        quantity: 1,
        image: coffee.image
      };
      addToCart(item);
    }
  };
  
  const decreaseQuantity = () => {
    if (!isInCart) {
      setQuantity(prev => Math.max(prev - 1, 1));
    } else {
      const item: CartItem = {
        id: coffee.id,
        name: coffee.name,
        price: coffee.price,
        quantity: -1,
        image: coffee.image
      };
      addToCart(item);
    }
  };

  return (
    <div className="relative bg-transparent mb-6">
      {/* Zigzag border container */}
      <div className="border-[#e9c766] border-2 rounded-lg bg-white p-4 relative overflow-hidden"
        style={{
          borderImageSource: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"10\" viewBox=\"0 0 100 10\"><path d=\"M 0,5 L 10,0 L 20,5 L 30,0 L 40,5 L 50,0 L 60,5 L 70,0 L 80,5 L 90,0 L 100,5 L 100,10 L 0,10 Z\" fill=\"%23e9c766\"/></svg>')",
          borderImageSlice: "50 0",
          borderImageWidth: "10px 0",
          borderImageRepeat: "repeat"
        }}
      >
        <div className="flex justify-between">
          <div className="pr-4">
            <h3 className="text-[#1e483c] text-xl font-bold">{coffee.name}</h3>
            <p className="text-[#e46546] text-xl font-bold mt-1">₹{coffee.price}</p>
            <p className="text-gray-600 mt-2 text-base">{coffee.description}</p>
            
            <div className="mt-6 flex items-center">
              {!isInCart ? (
                <div className="flex">
                  <div className="flex items-center">
                    <button 
                      onClick={decreaseQuantity}
                      className="w-12 h-12 bg-[#1e483c] text-white flex items-center justify-center text-3xl"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    
                    <div className="w-16 h-12 flex items-center justify-center text-xl border border-gray-300">
                      {quantity}
                    </div>
                    
                    <button 
                      onClick={increaseQuantity}
                      className="w-12 h-12 bg-[#1e483c] text-white flex items-center justify-center text-3xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <button 
                    onClick={decreaseQuantity}
                    className="w-12 h-12 bg-[#1e483c] text-white flex items-center justify-center text-3xl"
                  >
                    −
                  </button>
                  
                  <div className="w-16 h-12 flex items-center justify-center text-xl border border-gray-300">
                    {itemQuantity}
                  </div>
                  
                  <button 
                    onClick={increaseQuantity}
                    className="w-12 h-12 bg-[#1e483c] text-white flex items-center justify-center text-3xl"
                  >
                    +
                  </button>
                </div>
              )}
              
              {!isInCart && (
                <button 
                  onClick={handleAddToCart}
                  className="ml-4 bg-[#e46546] text-white px-8 py-2 rounded-md text-xl"
                >
                  ADD
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <div className="w-28 h-28 overflow-hidden rounded-lg border-2 border-[#e9c766] bg-white">
              <img 
                src={coffee.image} 
                alt={coffee.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

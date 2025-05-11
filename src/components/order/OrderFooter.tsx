
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

interface OrderFooterProps {
  totalPrice: number;
  onClose: () => void;
  showQrCode: boolean;
  setShowQrCode: React.Dispatch<React.SetStateAction<boolean>>;
  handleGenerateQR: () => void;
  cart: Array<{ id: string; quantity: number }>;
  creatingOrder: boolean;
}

const OrderFooter: React.FC<OrderFooterProps> = ({
  totalPrice,
  onClose,
  showQrCode,
  setShowQrCode,
  handleGenerateQR,
  cart,
  creatingOrder
}) => {
  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  return (
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
          disabled={creatingOrder}
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
            disabled={creatingOrder}
          >
            Back to Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderFooter;

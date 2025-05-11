
import React from 'react';
import { QrCode } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface PaymentSectionProps {
  generateOrderId: () => string;
  totalPrice: number;
  creatingOrder: boolean;
  handleSubmitOrder: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  generateOrderId,
  totalPrice,
  creatingOrder,
  handleSubmitOrder
}) => {
  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <h3 className="text-lg font-medium text-coffee-green mb-4">Payment QR Code</h3>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
          <QrCode className="w-32 h-32 text-coffee-green" />
        </div>
        <p className="text-center mt-4 font-medium text-lg">{formatPrice(totalPrice)}</p>
        <p className="text-center text-sm text-gray-500">Order ID: {generateOrderId()}</p>
      </div>
      
      <button 
        className="bg-coffee-green text-white hover:bg-coffee-green/90 w-48 h-10 rounded-md inline-flex items-center justify-center"
        onClick={handleSubmitOrder}
        disabled={creatingOrder}
      >
        {creatingOrder ? (
          <>
            <Spinner size="small" className="mr-2" />
            Processing...
          </>
        ) : (
          'Confirm Payment'
        )}
      </button>
    </div>
  );
};

export default PaymentSection;

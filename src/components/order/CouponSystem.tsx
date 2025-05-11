
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CreditCard, Tag, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  description: string;
  expiry_date?: string;
  min_order_value?: number;
  is_referral?: boolean;
}

interface CouponSystemProps {
  phoneNumber: string;
  totalPrice: number;
  onApplyCoupon: (discount: number) => void;
}

// Mock customer coupons based on phone number
const getMockCoupons = (phoneNumber: string): Coupon[] => {
  if (!phoneNumber || phoneNumber.length < 10) return [];
  
  // Generate coupons based on last digit of phone number
  const lastDigit = parseInt(phoneNumber.slice(-1));
  
  const baseCoupons: Coupon[] = [
    {
      id: `REF-${phoneNumber.slice(-4)}`,
      code: `REFER${phoneNumber.slice(-4)}`,
      discount_type: 'percentage',
      discount_value: 10,
      description: 'Referral discount for bringing new customers!',
      is_referral: true
    }
  ];
  
  // Add more coupons based on last digit
  if (lastDigit % 2 === 0) {
    baseCoupons.push({
      id: `NEW-${phoneNumber.slice(-4)}`,
      code: `NEWUSER${phoneNumber.slice(-4)}`,
      discount_type: 'fixed',
      discount_value: 100,
      description: 'New user special offer',
      min_order_value: 500
    });
  } else {
    baseCoupons.push({
      id: `LOYAL-${phoneNumber.slice(-4)}`,
      code: `LOYAL${phoneNumber.slice(-4)}`,
      discount_type: 'percentage',
      discount_value: 15,
      description: 'Loyal customer special discount',
      min_order_value: 300
    });
  }
  
  return baseCoupons;
};

const CouponSystem: React.FC<CouponSystemProps> = ({ phoneNumber, totalPrice, onApplyCoupon }) => {
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState<string>('');
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [showCouponsDialog, setShowCouponsDialog] = useState<boolean>(false);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    if (phoneNumber && phoneNumber.length >= 10) {
      // In a real app, this would be a call to your API
      const coupons = getMockCoupons(phoneNumber);
      setAvailableCoupons(coupons);
    } else {
      setAvailableCoupons([]);
    }
    
    // Reset applied coupon when phone number changes
    setAppliedCoupon(null);
    setDiscount(0);
    onApplyCoupon(0);
  }, [phoneNumber]);

  const handleApplyCoupon = () => {
    // Check if coupon exists in available coupons
    const coupon = availableCoupons.find(c => c.code === couponCode);
    
    if (!coupon) {
      toast({
        title: "Invalid Coupon",
        description: "This coupon code is not valid or has expired.",
        variant: "destructive"
      });
      return;
    }
    
    // Check minimum order value
    if (coupon.min_order_value && totalPrice < coupon.min_order_value) {
      toast({
        title: "Cannot Apply Coupon",
        description: `Minimum order value should be ₹${coupon.min_order_value}`,
        variant: "destructive"
      });
      return;
    }
    
    // Calculate discount
    const discountAmount = calculateDiscount(coupon, totalPrice);
    setDiscount(discountAmount);
    onApplyCoupon(discountAmount);
    setAppliedCoupon(coupon);
    
    toast({
      title: "Coupon Applied",
      description: `Discount of ₹${discountAmount.toFixed(2)} applied!`,
    });
  };

  const handleSelectCoupon = (coupon: Coupon) => {
    setCouponCode(coupon.code);
    setShowCouponsDialog(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setDiscount(0);
    onApplyCoupon(0);
    
    toast({
      title: "Coupon Removed",
      description: "Discount has been removed from the order.",
    });
  };

  const calculateDiscount = (coupon: Coupon, total: number): number => {
    if (coupon.discount_type === 'percentage') {
      return (coupon.discount_value / 100) * total;
    } else {
      return Math.min(coupon.discount_value, total); // Fixed discount, capped at total
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg my-4">
      <div className="flex flex-col gap-4">
        {appliedCoupon ? (
          <div className="relative bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white p-4 rounded-lg shadow-md border border-purple-300">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  <h3 className="font-bold text-lg">{appliedCoupon.code}</h3>
                </div>
                <p className="text-sm mt-1 text-white/90">{appliedCoupon.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  {appliedCoupon.discount_type === 'percentage' 
                    ? `-${appliedCoupon.discount_value}%` 
                    : `-₹${appliedCoupon.discount_value}`}
                </p>
                <p className="text-sm text-white/90">Discount: ₹{discount.toFixed(2)}</p>
              </div>
            </div>
            
            <Button 
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-white hover:text-red-200 p-1 h-auto" 
              onClick={handleRemoveCoupon}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <div className="absolute -left-1 top-1/2 w-4 h-6 bg-white rounded-r-full transform -translate-y-1/2"></div>
            <div className="absolute -right-1 top-1/2 w-4 h-6 bg-white rounded-l-full transform -translate-y-1/2"></div>
          </div>
        ) : (
          <>
            <Label htmlFor="couponCode" className="text-base">Apply Coupon</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="couponCode"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="pl-10 h-12 text-base"
                />
                <CreditCard className="h-5 w-5 text-gray-500 absolute left-3 top-3.5" />
              </div>
              <Button 
                onClick={handleApplyCoupon}
                className="bg-coffee-green hover:bg-coffee-green/90"
              >
                Apply
              </Button>
              {availableCoupons.length > 0 && (
                <Button 
                  variant="outline"
                  onClick={() => setShowCouponsDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Tag className="h-5 w-5" />
                  View Coupons
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      <Dialog open={showCouponsDialog} onOpenChange={setShowCouponsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Available Coupons</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {availableCoupons.map((coupon) => (
              <div 
                key={coupon.id}
                className="relative bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white p-4 rounded-lg shadow-md border border-purple-300 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSelectCoupon(coupon)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      <h3 className="font-bold text-lg">{coupon.code}</h3>
                    </div>
                    <p className="text-sm mt-1 text-white/90">{coupon.description}</p>
                    {coupon.min_order_value && (
                      <p className="text-xs mt-1 bg-white/20 inline-block px-2 py-0.5 rounded">
                        Min order: ₹{coupon.min_order_value}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">
                      {coupon.discount_type === 'percentage' 
                        ? `-${coupon.discount_value}%` 
                        : `-₹${coupon.discount_value}`}
                    </p>
                    {coupon.expiry_date && (
                      <p className="text-xs text-white/90">
                        Valid till: {coupon.expiry_date}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="absolute -left-1 top-1/2 w-4 h-6 bg-white rounded-r-full transform -translate-y-1/2"></div>
                <div className="absolute -right-1 top-1/2 w-4 h-6 bg-white rounded-l-full transform -translate-y-1/2"></div>
              </div>
            ))}

            {availableCoupons.length === 0 && (
              <p className="text-center py-8 text-gray-500">No coupons available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponSystem;

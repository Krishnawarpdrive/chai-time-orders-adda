
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Percent, Tag } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  isPercent: boolean;
  maxDiscount?: number;
  expiryDate: string;
  minOrderValue?: number;
  description: string;
  isActive: boolean;
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME20',
    discount: 20,
    isPercent: true,
    maxDiscount: 100,
    expiryDate: '2025-06-30',
    minOrderValue: 200,
    description: '20% off on your first order',
    isActive: true
  },
  {
    id: '2',
    code: 'FLAT50',
    discount: 50,
    isPercent: false,
    expiryDate: '2025-05-15',
    minOrderValue: 300,
    description: 'Flat ₹50 off on orders above ₹300',
    isActive: true
  },
  {
    id: '3',
    code: 'SUMMER25',
    discount: 25,
    isPercent: true,
    maxDiscount: 150,
    expiryDate: '2025-07-31',
    description: 'Summer special offer',
    isActive: true
  }
];

const CouponManager = () => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [orderAmount, setOrderAmount] = useState<number>(500);
  const { toast } = useToast();

  const handleApplyCoupon = () => {
    // Find coupon by code
    const coupon = mockCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    
    if (!coupon) {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is invalid.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if coupon is active
    if (!coupon.isActive) {
      toast({
        title: "Inactive Coupon",
        description: "This coupon is no longer active.",
        variant: "destructive"
      });
      return;
    }
    
    // Check expiry date
    if (new Date(coupon.expiryDate) < new Date()) {
      toast({
        title: "Expired Coupon",
        description: "This coupon has expired.",
        variant: "destructive"
      });
      return;
    }
    
    // Check minimum order value
    if (coupon.minOrderValue && orderAmount < coupon.minOrderValue) {
      toast({
        title: "Minimum Order Value Not Met",
        description: `This coupon requires a minimum order value of ₹${coupon.minOrderValue}.`,
        variant: "destructive"
      });
      return;
    }
    
    setAppliedCoupon(coupon);
    setSelectedCoupon(coupon);
    
    toast({
      title: "Coupon Applied",
      description: `Successfully applied coupon ${coupon.code}.`,
    });
  };

  const calculateDiscount = (coupon: Coupon) => {
    if (!coupon) return 0;
    
    let discount = 0;
    if (coupon.isPercent) {
      discount = (orderAmount * coupon.discount) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discount;
    }
    
    return discount;
  };

  const displayDiscount = (coupon: Coupon) => {
    if (coupon.isPercent) {
      return `${coupon.discount}%${coupon.maxDiscount ? ` up to ₹${coupon.maxDiscount}` : ''}`;
    }
    return `₹${coupon.discount}`;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setSelectedCoupon(null);
    
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from this order."
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-coffee-green">Apply Coupon</h2>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Total:</span>
              <span className="font-semibold">₹{orderAmount.toFixed(2)}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between items-center text-green-600">
                <span className="flex items-center">
                  <Percent size={16} className="mr-1" />
                  Discount ({appliedCoupon.code}):
                </span>
                <span className="font-semibold">-₹{calculateDiscount(appliedCoupon).toFixed(2)}</span>
              </div>
            )}
            
            <div className="border-t pt-2 flex justify-between items-center font-semibold">
              <span>Final Amount:</span>
              <span className="text-lg">
                ₹{(orderAmount - (appliedCoupon ? calculateDiscount(appliedCoupon) : 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Coupon Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="uppercase"
            />
            <Button 
              onClick={handleApplyCoupon}
              disabled={!couponCode || appliedCoupon !== null}
              className="bg-coffee-green hover:bg-coffee-green/90"
            >
              Apply
            </Button>
            
            {appliedCoupon && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRemoveCoupon}
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                <X size={16} />
              </Button>
            )}
          </div>
          
          {selectedCoupon && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-md p-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                  <span className="font-medium text-green-700">{selectedCoupon.code}</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  {displayDiscount(selectedCoupon)}
                </Badge>
              </div>
              <p className="mt-1 text-green-700">{selectedCoupon.description}</p>
              {selectedCoupon.minOrderValue && (
                <p className="mt-1 text-xs text-green-600">
                  Min. order value: ₹{selectedCoupon.minOrderValue}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Available Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockCoupons.map(coupon => (
              <div 
                key={coupon.id} 
                className="border border-gray-200 rounded-md p-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setCouponCode(coupon.code);
                  setSelectedCoupon(coupon);
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-coffee-green mr-2" />
                    <span className="font-medium text-coffee-green">{coupon.code}</span>
                  </div>
                  <Badge className="bg-coffee-green/20 text-coffee-green hover:bg-coffee-green/30">
                    {displayDiscount(coupon)}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-600">{coupon.description}</p>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Valid till {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                  {coupon.minOrderValue && (
                    <span>Min. order: ₹{coupon.minOrderValue}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CouponManager;

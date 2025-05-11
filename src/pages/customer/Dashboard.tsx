
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ShoppingBag, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="mb-4 sm:mb-6">
        <h2 className="font-hackney text-2xl sm:text-3xl text-coffee-green mb-1">Welcome to ParseNue</h2>
        <p className="text-gray-600 text-xs sm:text-sm">Your favorite coffee shop dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-coffee-green" />
              Recent Order
            </CardTitle>
            <CardDescription>Your last order with us</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#ORD12345</div>
            <div className="text-sm text-gray-500">2 Cappuccino, 1 Croissant</div>
            <div className="mt-2 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded inline-block">
              Ready to Pick
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/customer/orders')}>
              View Details
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Award className="mr-2 h-5 w-5 text-coffee-green" />
              Loyalty Status
            </CardTitle>
            <CardDescription>Your rewards and points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Silver Member</div>
            <div className="text-sm text-gray-500">120 points accumulated</div>
            <div className="mt-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded inline-block">
              30 points to Gold
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/customer/profile')}>
              View Rewards
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-coffee-green" />
              Quick Order
            </CardTitle>
            <CardDescription>Place a new order now</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Ready to enjoy your favorite coffee?</p>
            <p className="text-xs text-gray-500 mt-1">Estimated preparation time: 8-10 minutes</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-coffee-green hover:bg-coffee-green/90" onClick={() => navigate('/customer/menu')}>
              Order Now
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Featured Products</CardTitle>
            <CardDescription>Try our new seasonal specialties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-coffee-green/10 p-3 rounded-lg">
                <div className="font-semibold text-coffee-green">Pumpkin Spice Latte</div>
                <p className="text-sm text-gray-600 mt-1">Our seasonal favorite with cinnamon and nutmeg</p>
                <div className="text-bisi-orange font-bold mt-2">₹180</div>
              </div>
              <div className="bg-coffee-green/10 p-3 rounded-lg">
                <div className="font-semibold text-coffee-green">Maple Pecan Croissant</div>
                <p className="text-sm text-gray-600 mt-1">Freshly baked with crunchy pecans</p>
                <div className="text-bisi-orange font-bold mt-2">₹120</div>
              </div>
              <div className="bg-coffee-green/10 p-3 rounded-lg">
                <div className="font-semibold text-coffee-green">Caramel Cold Brew</div>
                <p className="text-sm text-gray-600 mt-1">Smooth cold brew with caramel swirl</p>
                <div className="text-bisi-orange font-bold mt-2">₹200</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/customer/menu')}>
              View Full Menu
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default CustomerDashboard;


import React from 'react';
import Sidebar from '@/components/Sidebar';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StaffPerformanceDashboard from '@/components/staff/StaffPerformanceDashboard';
import CouponManager from '@/components/coupons/CouponManager';

const StaffPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40">
          <h1 className="font-hackney text-2xl text-coffee-green">Staff Management</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-bisi-orange rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium hidden md:block">Admin User</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-milk-sugar overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="font-hackney text-3xl text-coffee-green mb-1">Staff Dashboard</h2>
              <p className="text-gray-600 text-sm">Monitor staff performance and manage coupons</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <StaffPerformanceDashboard />
              </div>
              
              <div className="space-y-4">
                <CouponManager />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffPage;

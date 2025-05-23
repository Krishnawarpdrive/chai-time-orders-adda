
import React from 'react';
import Sidebar from '@/components/Sidebar';
import { Bell, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReportingDashboard from '@/components/analytics/ReportingDashboard';

const ReportsPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40">
          <h1 className="font-hackney text-xl sm:text-2xl text-coffee-green">Reports & Analytics</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-bisi-orange rounded-full"></span>
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-sm font-medium hidden md:block">Admin User</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 bg-milk-sugar overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="font-hackney text-2xl sm:text-3xl text-coffee-green mb-1">Analytics Dashboard</h2>
                <p className="text-gray-600 text-xs sm:text-sm">View comprehensive reports and analytics on sales, orders, and inventory</p>
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-coffee-green text-coffee-green hover:bg-coffee-green/10"
                size="sm"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export Reports</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>

            <ReportingDashboard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;

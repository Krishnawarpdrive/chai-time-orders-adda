
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerView } from '@/components/views/CustomerView';
import { ItemView } from '@/components/views/ItemView';

const Index = () => {
  const { toast } = useToast();

  const handleNewOrder = () => {
    toast({
      title: "New Order",
      description: "Creating a new order...",
    });
    // Here you would normally open a modal or navigate to a new order page
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="font-hackney text-2xl text-coffee-green">Staff Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-bisi-orange rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium hidden md:block">Admin User</span>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-milk-sugar overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h2 className="font-hackney text-3xl text-coffee-green mb-1">Orders Management</h2>
                <p className="text-gray-600 text-sm">ಬಿಸಿ ಬಿಸಿ ಆರ್ಡರ್‌ಗಳು! Manage your hot orders here.</p>
              </div>
              <Button 
                className="mt-4 sm:mt-0 bg-bisi-orange hover:bg-bisi-orange/90"
                onClick={handleNewOrder}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Order
              </Button>
            </div>

            <Tabs defaultValue="customer" className="w-full">
              <TabsList className="mb-4 bg-white border border-gray-200">
                <TabsTrigger value="customer" className="data-[state=active]:bg-coffee-green data-[state=active]:text-white">
                  Customer View
                </TabsTrigger>
                <TabsTrigger value="item" className="data-[state=active]:bg-coffee-green data-[state=active]:text-white">
                  Item View
                </TabsTrigger>
              </TabsList>
              <TabsContent value="customer" className="mt-0">
                <CustomerView />
              </TabsContent>
              <TabsContent value="item" className="mt-0">
                <ItemView />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

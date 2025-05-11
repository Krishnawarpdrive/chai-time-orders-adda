
import React from 'react';
import Sidebar from '@/components/Sidebar';
import ProductInventorySidebar from '@/components/ProductInventorySidebar';
import { Bell, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const InventoryPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40">
          <h1 className="font-hackney text-2xl text-coffee-green">Inventory Management</h1>
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
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="font-hackney text-3xl text-coffee-green mb-1">Inventory Control</h2>
              <p className="text-gray-600 text-sm">Manage your inventory levels and submit requests for new items.</p>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4 bg-white border border-gray-200">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-coffee-green data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-coffee-green data-[state=active]:text-white"
                >
                  Request History
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-coffee-green data-[state=active]:text-white"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-coffee-green">Total Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold">24</div>
                      <p className="text-sm text-muted-foreground">8 categories</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-coffee-green">Low Stock Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold text-amber-500">6</div>
                      <p className="text-sm text-muted-foreground">Below reorder level</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-coffee-green">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold text-blue-500">2</div>
                      <p className="text-sm text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="col-span-3 bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-coffee-green font-semibold mb-3 flex items-center">
                      <Clipboard className="mr-2 h-5 w-5" />
                      Recent Inventory Activities
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="p-3 border border-green-100 rounded-md bg-green-50">
                        <div className="flex justify-between">
                          <span className="font-medium">Stock Update: Coffee Powder</span>
                          <span className="text-sm text-gray-500">Today, 10:23 AM</span>
                        </div>
                        <p className="text-sm">Quantity increased from 12 kg to 25 kg</p>
                      </div>
                      
                      <div className="p-3 border border-amber-100 rounded-md bg-amber-50">
                        <div className="flex justify-between">
                          <span className="font-medium">Low Stock Alert: Sugar</span>
                          <span className="text-sm text-gray-500">Today, 09:15 AM</span>
                        </div>
                        <p className="text-sm">Current: 8 kg (Below reorder level of 10 kg)</p>
                      </div>
                      
                      <div className="p-3 border border-blue-100 rounded-md bg-blue-50">
                        <div className="flex justify-between">
                          <span className="font-medium">Request Submitted: Paper Cups</span>
                          <span className="text-sm text-gray-500">Yesterday, 03:45 PM</span>
                        </div>
                        <p className="text-sm">Requested 500 units</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right sidebar with inventory details will be rendered by ProductInventorySidebar */}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Request History</CardTitle>
                    <CardDescription>A log of all previous inventory requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Request history will appear here</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Settings</CardTitle>
                    <CardDescription>Configure reorder levels and thresholds</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Settings will appear here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* Inventory Sidebar */}
      <ProductInventorySidebar />
    </div>
  );
};

export default InventoryPage;

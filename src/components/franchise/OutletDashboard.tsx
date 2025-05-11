
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, AlertCircle, Clock, MapPin, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import OutletsTable from './OutletsTable';

interface OutletMetrics {
  id: string;
  name: string;
  location: string;
  orderVolume: number;
  pendingOrders: number;
  completedOrders: number;
  inventoryStatus: 'Good' | 'Warning' | 'Critical';
  customerRating: number;
  hasScheduledAudit: boolean;
  lastAuditDate: string;
  auditScore?: number;
}

const mockOutletData: OutletMetrics[] = [
  {
    id: '1',
    name: 'Coasters Indiranagar',
    location: 'Indiranagar, Bangalore',
    orderVolume: 145,
    pendingOrders: 12,
    completedOrders: 133,
    inventoryStatus: 'Good',
    customerRating: 4.7,
    hasScheduledAudit: true,
    lastAuditDate: '2025-04-02',
    auditScore: 92
  },
  {
    id: '2',
    name: 'Coasters Koramangala',
    location: 'Koramangala, Bangalore',
    orderVolume: 98,
    pendingOrders: 8,
    completedOrders: 90,
    inventoryStatus: 'Warning',
    customerRating: 4.3,
    hasScheduledAudit: false,
    lastAuditDate: '2025-03-15',
    auditScore: 85
  },
  {
    id: '3',
    name: 'Coasters HSR Layout',
    location: 'HSR Layout, Bangalore',
    orderVolume: 76,
    pendingOrders: 15,
    completedOrders: 61,
    inventoryStatus: 'Critical',
    customerRating: 3.9,
    hasScheduledAudit: false,
    lastAuditDate: '2025-02-28',
    auditScore: 78
  },
  {
    id: '4',
    name: 'Coasters Whitefield',
    location: 'Whitefield, Bangalore',
    orderVolume: 112,
    pendingOrders: 7,
    completedOrders: 105,
    inventoryStatus: 'Good',
    customerRating: 4.5,
    hasScheduledAudit: true,
    lastAuditDate: '2025-04-08',
    auditScore: 88
  }
];

const OutletDashboard = () => {
  const [showAuditAlert, setShowAuditAlert] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const getInventoryStatusColor = (status: string) => {
    switch(status) {
      case 'Good': return 'bg-green-100 text-green-800';
      case 'Warning': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-coffee-green">Franchise Outlets</h2>
        <div className="flex items-center gap-2">
          <div className="bg-muted rounded-md p-1 flex">
            <Button 
              size="sm" 
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              className={viewMode === 'grid' ? 'bg-coffee-green text-white' : ''}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={16} />
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              className={viewMode === 'table' ? 'bg-coffee-green text-white' : ''}
              onClick={() => setViewMode('table')}
            >
              <TableIcon size={16} />
            </Button>
          </div>
          <Button size="sm" variant="outline" className="border-coffee-green text-coffee-green hover:bg-coffee-green/10">
            Schedule Audit
          </Button>
        </div>
      </div>
      
      {showAuditAlert && (
        <Alert className="bg-coffee-green/10 border-coffee-green">
          <AlertCircle className="h-4 w-4 text-coffee-green" />
          <AlertTitle className="text-coffee-green">Scheduled Audits</AlertTitle>
          <AlertDescription className="text-coffee-green/90">
            There are 2 outlets due for audit this week. Click to see details.
          </AlertDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2" 
            onClick={() => setShowAuditAlert(false)}
          >
            <Check className="h-4 w-4" />
          </Button>
        </Alert>
      )}
      
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="audits">Audits</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockOutletData.map(outlet => (
                <Card key={outlet.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-coffee-green">{outlet.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin size={14} /> {outlet.location}
                        </CardDescription>
                      </div>
                      {outlet.hasScheduledAudit && (
                        <Badge className="bg-bisi-orange">Audit Scheduled</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500">Total Orders</span>
                        <span className="font-semibold text-lg">{outlet.orderVolume}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Pending</span>
                        <span className="font-semibold text-lg flex items-center">
                          {outlet.pendingOrders}
                          <Clock size={16} className="text-yellow-500 ml-1" />
                        </span>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-gray-500">Rating</span>
                        <span className="font-semibold">⭐ {outlet.customerRating}/5</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Inventory</span>
                        <Badge className={getInventoryStatusColor(outlet.inventoryStatus)}>
                          {outlet.inventoryStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full text-xs text-gray-500">
                      Last audited: {outlet.lastAuditDate} (Score: {outlet.auditScore})
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <OutletsTable outlets={mockOutletData} />
          )}
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders Management</CardTitle>
              <CardDescription>Track order status across all outlets</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Orders content will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Monitor inventory levels across all outlets</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Inventory content will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audits">
          <Card>
            <CardHeader>
              <CardTitle>Audit Schedule</CardTitle>
              <CardDescription>Manage upcoming and past audits</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Audit content will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutletDashboard;

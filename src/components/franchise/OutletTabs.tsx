
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OutletGridView from './OutletGridView';
import OutletsTable from './OutletsTable';
import { OutletMetrics, getInventoryStatusColor } from './types';

interface OutletTabsProps {
  viewMode: 'grid' | 'table';
  outlets: OutletMetrics[];
}

const OutletTabs = ({ viewMode, outlets }: OutletTabsProps) => {
  return (
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
          <OutletGridView 
            outlets={outlets} 
            getInventoryStatusColor={getInventoryStatusColor} 
          />
        ) : (
          <OutletsTable outlets={outlets} />
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
  );
};

export default OutletTabs;

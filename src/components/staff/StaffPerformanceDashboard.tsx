
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffPerformanceTable from './StaffPerformanceTable';
import AddStaffDrawer from './AddStaffDrawer';
import { useStaff, useStaffWithPerformance } from '@/hooks/useStaff';

const StaffPerformanceDashboard = () => {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const { data: staff } = useStaff();
  const { data: staffWithPerformance } = useStaffWithPerformance();

  // Calculate summary metrics
  const totalStaff = staff?.length || 0;
  const activeStaff = staff?.filter(s => s.status === 'active').length || 0;
  const todaysTotalSales = staffWithPerformance?.reduce((sum, s) => 
    sum + (s.performance?.total_sales || 0), 0) || 0;
  const todaysOrders = staffWithPerformance?.reduce((sum, s) => 
    sum + (s.performance?.orders_completed || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-coffee-green">Staff Management</h2>
          <p className="text-gray-600">Manage staff members and monitor performance</p>
        </div>
        
        <Button 
          onClick={() => setIsAddStaffOpen(true)}
          className="bg-coffee-green hover:bg-coffee-green/90 flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-coffee-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-coffee-green">{totalStaff}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeStaff}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{todaysTotalSales.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{todaysOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <StaffPerformanceTable />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Analytics features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddStaffDrawer 
        open={isAddStaffOpen} 
        onOpenChange={setIsAddStaffOpen} 
      />
    </div>
  );
};

export default StaffPerformanceDashboard;

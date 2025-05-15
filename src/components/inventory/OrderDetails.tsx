
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInventoryRequests } from '@/hooks/useInventoryRequests';
import { format } from 'date-fns';

const OrderDetails = () => {
  const { requests, loading, error, formatDateString } = useInventoryRequests();
  
  // Filter requests based on status
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const previousRequests = requests.filter(req => req.status !== 'pending');

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-coffee-green border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading order details...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500">Error loading order details: {error}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <Tabs defaultValue="pending" className="w-full">
        <div className="px-4 pt-4 border-b">
          <TabsList>
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-coffee-green data-[state=active]:text-white"
            >
              Pending Orders
              {pendingRequests.length > 0 && (
                <Badge className="ml-2 bg-amber-500">{pendingRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="previous" 
              className="data-[state=active]:bg-coffee-green data-[state=active]:text-white"
            >
              Previous Orders
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pending" className="p-0">
          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No pending orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[15%]">Order ID</TableHead>
                    <TableHead className="w-[25%]">Raw Material</TableHead>
                    <TableHead className="w-[15%] text-center">Quantity</TableHead>
                    <TableHead className="w-[15%] text-center">Status</TableHead>
                    <TableHead className="w-[15%] text-center">Date</TableHead>
                    <TableHead className="w-[15%] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.id.substring(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell>{order.inventory_item?.name}</TableCell>
                      <TableCell className="text-center">
                        {order.requested_quantity} {order.inventory_item?.unit}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-amber-500 text-white">
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{formatDate(order.created_at)}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="previous" className="p-0">
          {previousRequests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No previous orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[15%]">Order ID</TableHead>
                    <TableHead className="w-[25%]">Raw Material</TableHead>
                    <TableHead className="w-[15%] text-center">Quantity</TableHead>
                    <TableHead className="w-[15%] text-center">Status</TableHead>
                    <TableHead className="w-[15%] text-center">Date</TableHead>
                    <TableHead className="w-[15%] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previousRequests.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.id.substring(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell>{order.inventory_item?.name}</TableCell>
                      <TableCell className="text-center">
                        {order.requested_quantity} {order.inventory_item?.unit}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={
                          order.status === 'approved' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }>
                          {order.status === 'approved' ? 'Approved' : 'Rejected'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{formatDate(order.created_at)}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default OrderDetails;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Package, Truck } from 'lucide-react';
import { usePurchaseOrders } from '@/hooks/usePurchaseOrders';
import { PurchaseOrder } from '@/types/inventory-enhanced';
import { format } from 'date-fns';
import CreatePurchaseOrderDialog from './CreatePurchaseOrderDialog';

const PurchaseOrderManagement = () => {
  const { purchaseOrders, loading, updatePurchaseOrderStatus } = usePurchaseOrders();
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'sent':
        return 'bg-blue-500';
      case 'confirmed':
        return 'bg-green-500';
      case 'partially_delivered':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-green-600';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  const filterOrdersByStatus = (status: string | null = null) => {
    if (!status) return purchaseOrders;
    return purchaseOrders.filter(order => order.status === status);
  };

  const PurchaseOrderTable = ({ orders }: { orders: PurchaseOrder[] }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PO Number</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Outlet</TableHead>
            <TableHead className="text-center">Items</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.po_number}</TableCell>
              <TableCell>{order.vendor?.name}</TableCell>
              <TableCell>{order.outlet?.name}</TableCell>
              <TableCell className="text-center">{order.items?.length || 0}</TableCell>
              <TableCell className="text-right font-medium">
                ${order.total_amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(order.order_date)}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {order.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePurchaseOrderStatus(order.id, 'sent')}
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-coffee-green border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading purchase orders...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-coffee-green">Purchase Order Management</h3>
          <p className="text-sm text-gray-600">Track and manage purchase orders</p>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Purchase Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-coffee-green">{purchaseOrders.length}</p>
              </div>
              <Package className="h-8 w-8 text-coffee-green" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filterOrdersByStatus('pending').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filterOrdersByStatus('sent').length + filterOrdersByStatus('confirmed').length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {filterOrdersByStatus('delivered').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-6 pt-6">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="all">
                <PurchaseOrderTable orders={purchaseOrders} />
              </TabsContent>
              
              <TabsContent value="pending">
                <PurchaseOrderTable orders={filterOrdersByStatus('pending')} />
              </TabsContent>
              
              <TabsContent value="confirmed">
                <PurchaseOrderTable orders={filterOrdersByStatus('confirmed')} />
              </TabsContent>
              
              <TabsContent value="delivered">
                <PurchaseOrderTable orders={filterOrdersByStatus('delivered')} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <CreatePurchaseOrderDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default PurchaseOrderManagement;

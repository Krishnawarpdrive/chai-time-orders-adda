
import React, { useState } from 'react';
import OutletAuditAlert from './OutletAuditAlert';
import OutletViewSwitcher from './OutletViewSwitcher';
import OutletTabs from './OutletTabs';
import { mockOutletData } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, AlertTriangle, CheckCircle } from 'lucide-react';

const OutletDashboard = () => {
  const [showAuditAlert, setShowAuditAlert] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Calculate summary metrics
  const totalOutlets = mockOutletData.length;
  const lowStockOutlets = mockOutletData.filter(outlet => outlet.inventoryStatus === 'Critical').length;
  const totalOrders = mockOutletData.reduce((sum, outlet) => sum + outlet.orderVolume, 0);
  const pendingOrders = mockOutletData.reduce((sum, outlet) => sum + outlet.pendingOrders, 0);
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Outlets</p>
                <p className="text-2xl font-bold text-coffee-green">{totalOutlets}</p>
              </div>
              <Package className="h-8 w-8 text-coffee-green" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-amber-600">{pendingOrders}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-red-600">{lowStockOutlets}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-coffee-green">Franchise Outlets</h2>
        <OutletViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />
      </div>
      
      <OutletAuditAlert 
        showAuditAlert={showAuditAlert} 
        setShowAuditAlert={setShowAuditAlert} 
      />
      
      <OutletTabs viewMode={viewMode} outlets={mockOutletData} />
    </div>
  );
};

export default OutletDashboard;


import React, { useState } from 'react';
import OutletAuditAlert from './OutletAuditAlert';
import OutletViewSwitcher from './OutletViewSwitcher';
import OutletTabs from './OutletTabs';
import { mockOutletData } from './types';

const OutletDashboard = () => {
  const [showAuditAlert, setShowAuditAlert] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  return (
    <div className="space-y-4">
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

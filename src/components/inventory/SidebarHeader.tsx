
import React from 'react';
import { Package, Check, CalendarClock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format, addBusinessDays } from 'date-fns';

interface SidebarHeaderProps {
  isRequestMode: boolean;
  requestItemsCount: number;
  toggleRequestMode: () => void;
  openRequestDialog: () => void;
}

const SidebarHeader = ({ 
  isRequestMode, 
  requestItemsCount, 
  toggleRequestMode, 
  openRequestDialog 
}: SidebarHeaderProps) => {
  // Calculate estimated delivery date (2 business days from now)
  const estimatedDeliveryDate = addBusinessDays(new Date(), 2);
  const formattedDeliveryDate = format(estimatedDeliveryDate, 'EEEE, MMMM d');
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-coffee-green flex items-center gap-2">
        <Package size={20} />
        Product Inventory
      </h2>

      <div className="mb-4 flex justify-between items-center">
        <Button
          onClick={toggleRequestMode}
          variant={isRequestMode ? "default" : "outline"}
          size="sm"
          className={isRequestMode ? "bg-coffee-green hover:bg-coffee-green/90" : ""}
        >
          {isRequestMode ? (
            <>
              <Check size={16} />
              Request Mode
            </>
          ) : (
            "Request Inventory"
          )}
        </Button>
        
        {isRequestMode && requestItemsCount > 0 && (
          <Button
            onClick={openRequestDialog}
            variant="default"
            size="sm"
            className="bg-bisi-orange hover:bg-bisi-orange/90"
          >
            Review ({requestItemsCount})
          </Button>
        )}
      </div>

      {isRequestMode && (
        <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-100 rounded-md flex items-center text-xs text-blue-700">
          <CalendarClock size={14} className="mr-2 flex-shrink-0" />
          <span>Estimated delivery: <strong>{formattedDeliveryDate}</strong></span>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;

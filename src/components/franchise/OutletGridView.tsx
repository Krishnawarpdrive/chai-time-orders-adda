
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from 'lucide-react';
import { OutletMetrics } from "@/components/franchise/types";

interface OutletGridViewProps {
  outlets: OutletMetrics[];
  getInventoryStatusColor: (status: string) => string;
}

const OutletGridView = ({ outlets, getInventoryStatusColor }: OutletGridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {outlets.map(outlet => (
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
  );
};

export default OutletGridView;


import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clipboard, AlertCircle } from 'lucide-react';
import { OutletMetrics, getInventoryStatusColor } from './types';

interface OutletsTableProps {
  outlets: OutletMetrics[];
}

const OutletsTable = ({ outlets }: OutletsTableProps) => {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Outlet Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-center">Orders</TableHead>
            <TableHead className="text-center">Pending</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead className="text-center">Inventory</TableHead>
            <TableHead className="text-center">Last Audit</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outlets.map((outlet) => (
            <TableRow key={outlet.id}>
              <TableCell className="font-medium">
                {outlet.name}
                {outlet.hasScheduledAudit && (
                  <Badge className="ml-2 bg-bisi-orange">Audit Scheduled</Badge>
                )}
              </TableCell>
              <TableCell className="flex items-center gap-1">
                <MapPin size={14} /> {outlet.location}
              </TableCell>
              <TableCell className="text-center">{outlet.orderVolume}</TableCell>
              <TableCell className="text-center font-medium">
                {outlet.pendingOrders > 0 ? (
                  <span className="text-amber-600">{outlet.pendingOrders}</span>
                ) : (
                  outlet.pendingOrders
                )}
              </TableCell>
              <TableCell className="text-center">⭐ {outlet.customerRating}</TableCell>
              <TableCell className="text-center">
                <Badge className={getInventoryStatusColor(outlet.inventoryStatus)}>
                  {outlet.inventoryStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-center text-sm">
                <div className="flex flex-col">
                  <span>{outlet.lastAuditDate}</span>
                  <span className="text-xs text-muted-foreground">Score: {outlet.auditScore}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Clipboard className="h-4 w-4" />
                  </Button>
                  {outlet.inventoryStatus === 'Critical' && (
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-500 border-red-500 hover:bg-red-50">
                      <AlertCircle className="h-4 w-4" />
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
};

export default OutletsTable;

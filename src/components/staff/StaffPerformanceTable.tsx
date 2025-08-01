
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useStaffWithPerformance } from '@/hooks/useStaff';
import { Skeleton } from '@/components/ui/skeleton';

const StaffPerformanceTable = () => {
  const { data: staffWithPerformance, isLoading, error } = useStaffWithPerformance();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading staff performance data</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount?: number) => {
    return amount ? `₹${amount.toLocaleString()}` : '₹0';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-coffee-green" />
          Staff Performance Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Products Sold</TableHead>
                <TableHead className="text-center">Orders Completed</TableHead>
                <TableHead className="text-center">Total Sales</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead className="text-center">Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffWithPerformance?.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {staff.first_name} {staff.last_name}
                      </span>
                      <span className="text-sm text-gray-500">{staff.employee_id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{staff.position}</span>
                      {staff.department && (
                        <span className="text-sm text-gray-500">{staff.department}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(staff.status)}>
                      {staff.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-medium">
                        {staff.performance?.products_sold || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4 text-coffee-green" />
                      <span className="font-medium">
                        {staff.performance?.orders_completed || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="h-4 w-4 text-coffee-green" />
                      <span className="font-medium">
                        {formatCurrency(staff.performance?.total_sales)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">
                        {staff.performance?.customer_rating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">
                      {staff.performance?.shift_hours || 0}h
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {(!staffWithPerformance || staffWithPerformance.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No staff performance data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffPerformanceTable;

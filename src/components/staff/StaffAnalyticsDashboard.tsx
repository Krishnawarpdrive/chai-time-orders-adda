
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Clock, Calendar } from 'lucide-react';
import { useStaffWithPerformance } from '@/hooks/useStaff';
import { Skeleton } from '@/components/ui/skeleton';

const StaffAnalyticsDashboard = () => {
  const { data: staffWithPerformance, isLoading } = useStaffWithPerformance();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Prepare data for charts
  const performanceData = staffWithPerformance?.map(staff => ({
    name: `${staff.first_name} ${staff.last_name}`,
    sales: staff.performance?.total_sales || 0,
    orders: staff.performance?.orders_completed || 0,
    hours: staff.performance?.shift_hours || 0,
    rating: staff.performance?.customer_rating || 0,
  })) || [];

  const departmentData = staffWithPerformance?.reduce((acc: any[], staff) => {
    const dept = staff.department || 'Unassigned';
    const existing = acc.find(item => item.name === dept);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: dept, count: 1 });
    }
    return acc;
  }, []) || [];

  const statusData = staffWithPerformance?.reduce((acc: any[], staff) => {
    const existing = acc.find(item => item.name === staff.status);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ 
        name: staff.status, 
        count: 1,
        color: staff.status === 'active' ? '#10B981' : 
               staff.status === 'inactive' ? '#F59E0B' : '#EF4444'
      });
    }
    return acc;
  }, []) || [];

  const workingDaysData = staffWithPerformance?.reduce((acc: any[], staff) => {
    const days = staff.working_days || 'Monday-Friday';
    const existing = acc.find(item => item.name === days);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: days, count: 1 });
    }
    return acc;
  }, []) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-coffee-green" />
              Staff Performance Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'sales' ? `₹${value.toLocaleString()}` : value,
                    name === 'sales' ? 'Sales' : 
                    name === 'orders' ? 'Orders' : 
                    name === 'hours' ? 'Hours' : 'Rating'
                  ]} />
                  <Bar dataKey="sales" fill="#10B981" name="sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-coffee-green" />
              Staff by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-coffee-green" />
              Staff Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-coffee-green" />
              Working Days Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workingDaysData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'rating' ? value.toFixed(1) : value,
                  name === 'rating' ? 'Rating' : 
                  name === 'orders' ? 'Orders' : 'Hours'
                ]} />
                <Line type="monotone" dataKey="orders" stroke="#10B981" name="orders" />
                <Line type="monotone" dataKey="hours" stroke="#3B82F6" name="hours" />
                <Line type="monotone" dataKey="rating" stroke="#F59E0B" name="rating" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffAnalyticsDashboard;

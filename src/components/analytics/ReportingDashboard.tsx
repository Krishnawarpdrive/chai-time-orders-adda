
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const revenueData = [
  { name: 'Mon', revenue: 12000 },
  { name: 'Tue', revenue: 15000 },
  { name: 'Wed', revenue: 13500 },
  { name: 'Thu', revenue: 16800 },
  { name: 'Fri', revenue: 19200 },
  { name: 'Sat', revenue: 22000 },
  { name: 'Sun', revenue: 18500 },
];

const orderTrendData = [
  { name: 'Mon', completed: 85, pending: 12 },
  { name: 'Tue', completed: 110, pending: 18 },
  { name: 'Wed', completed: 95, pending: 15 },
  { name: 'Thu', completed: 120, pending: 20 },
  { name: 'Fri', completed: 145, pending: 25 },
  { name: 'Sat', completed: 160, pending: 30 },
  { name: 'Sun', completed: 135, pending: 22 },
];

const inventoryConsumptionData = [
  { name: 'Tea Powder', value: 35 },
  { name: 'Coffee Powder', value: 42 },
  { name: 'Milk', value: 55 },
  { name: 'Sugar', value: 28 },
  { name: 'Cups', value: 65 },
];

const COLORS = ['#024E1B', '#0A8754', '#28a745', '#4BB07B', '#7BD4A4'];

const feedbackData = [
  { name: '1 Star', value: 5 },
  { name: '2 Stars', value: 12 },
  { name: '3 Stars', value: 25 },
  { name: '4 Stars', value: 48 },
  { name: '5 Stars', value: 85 },
];

const FEEDBACK_COLORS = ['#ff6b6b', '#ff8e72', '#ffce56', '#77dd77', '#3da35d'];

const ReportingDashboard = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-coffee-green">Reporting & Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-coffee-green">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <p className="text-3xl font-semibold">₹22,150</p>
              <p className="text-sm text-green-600 flex items-center">
                <span>↑ 12% from yesterday</span>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-coffee-green">Orders Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <p className="text-3xl font-semibold">165</p>
              <p className="text-sm">145 Completed / 20 Pending</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-coffee-green">Avg. Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <p className="text-3xl font-semibold">4.6/5.0</p>
              <p className="text-sm flex items-center">
                <span className="text-yellow-500">★★★★★</span>
                <span className="ml-1">(85 ratings today)</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales & Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Revenue</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#024E1B" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#024E1B" name="Completed" />
                  <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Consumption (Weekly)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryConsumptionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, value}) => `${name}: ${value}%`}
                  >
                    {inventoryConsumptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Consumption']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feedbackData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {feedbackData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={FEEDBACK_COLORS[index % FEEDBACK_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ratings`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportingDashboard;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Clock, Users, ShoppingCart, 
  DollarSign, Star, Download, Calendar as CalendarIcon,
  Coffee, AlertTriangle, CheckCircle, UserCheck
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { analyticsService, SalesData, OperationalData, CustomerFeedbackData } from '@/services/analyticsService';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

export default function ComprehensiveDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(subDays(new Date(), 7)),
    to: endOfDay(new Date())
  });
  const [productFilter, setProductFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState('all');
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [operationalData, setOperationalData] = useState<OperationalData | null>(null);
  const [feedbackData, setFeedbackData] = useState<CustomerFeedbackData | null>(null);
  const [menuCategories, setMenuCategories] = useState<string[]>([]);
  const [staffList, setStaffList] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchData();
    }
    fetchMenuCategories();
    fetchStaffList();
  }, [dateRange, productFilter, staffFilter]);

  const fetchData = async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    setIsLoading(true);
    try {
      const [sales, operational, feedback] = await Promise.all([
        analyticsService.getSalesData({ from: dateRange.from, to: dateRange.to }, productFilter, staffFilter),
        analyticsService.getOperationalData({ from: dateRange.from, to: dateRange.to }, staffFilter),
        analyticsService.getCustomerFeedbackData()
      ]);

      setSalesData(sales);
      setOperationalData(operational);
      setFeedbackData(feedback);

      // Generate insights and recommendations
      const generatedInsights = analyticsService.getInsights(sales, operational);
      const generatedRecommendations = analyticsService.getRecommendations(sales, operational);
      
      setInsights(generatedInsights);
      setRecommendations(generatedRecommendations);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenuCategories = async () => {
    try {
      const items = await analyticsService.getMenuItems();
      const categories = [...new Set(items.map(item => item.category))];
      setMenuCategories(categories);
    } catch (error) {
      console.error('Error fetching menu categories:', error);
    }
  };

  const fetchStaffList = async () => {
    try {
      const staff = await analyticsService.getStaffList();
      setStaffList(staff);
    } catch (error) {
      console.error('Error fetching staff list:', error);
    }
  };

  const handleExport = () => {
    const data = {
      salesData,
      operationalData,
      feedbackData,
      insights,
      recommendations,
      dateRange,
      productFilter
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-coffee-green">Sales & Operations Dashboard</h2>
          <p className="text-gray-600">
            {dateRange?.from && dateRange?.to ? (
              `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
            ) : (
              'Select date range'
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {menuCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={staffFilter} onValueChange={setStaffFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staffList.map(staff => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-coffee-green">
                  ₹{salesData?.totalRevenue.toLocaleString() || 0}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last period
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-bisi-orange" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-coffee-green">
                  {salesData?.totalOrders || 0}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% from last period
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-bisi-orange" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-coffee-green">
                  ₹{salesData?.averageOrderValue.toFixed(0) || 0}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3% from last period
                </p>
              </div>
              <Coffee className="w-8 h-8 text-bisi-orange" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-coffee-green">
                  {operationalData?.completionRate.toFixed(1) || 0}%
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Excellent performance
                </p>
              </div>
              <Users className="w-8 h-8 text-bisi-orange" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData?.dailyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                  formatter={(value: any) => [`₹${value}`, 'Revenue']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--coffee-green))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--coffee-green))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Order Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData?.hourlyBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'orders' ? `${value} orders` : `₹${value}`,
                    name === 'orders' ? 'Orders' : 'Revenue'
                  ]}
                />
                <Legend />
                <Bar dataKey="orders" fill="hsl(var(--bisi-orange))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance & Customer Feedback */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData?.topProducts.map((product, index) => (
                <div key={product.productName} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{product.productName}</p>
                      <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{product.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{product.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{feedbackData?.averageRating.toFixed(1)}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{feedbackData?.totalReviews} total reviews</p>
                  <p className="text-xs text-green-600">+5% this month</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {feedbackData?.ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center gap-2">
                    <span className="text-sm w-6">{item.rating}★</span>
                    <Progress 
                      value={(item.count / (feedbackData?.totalReviews || 1)) * 100} 
                      className="flex-1" 
                    />
                    <span className="text-sm text-gray-600 w-8">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Details & Staff Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Operational Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-1">
              <div className="grid gap-4 grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Average Preparation Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-bisi-orange" />
                    <span className="text-xl font-bold">{operationalData?.averagePreparationTime} min</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={cn(
                      "w-5 h-5",
                      (operationalData?.pendingOrders || 0) > 10 ? "text-red-500" : "text-green-500"
                    )} />
                    <span className="text-xl font-bold">{operationalData?.pendingOrders}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Peak Hours</p>
                  <div className="flex flex-wrap gap-1">
                    {operationalData?.peakHours.map(hour => (
                      <Badge key={hour} variant="secondary">{hour}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Performance */}
        {operationalData?.staffPerformance && operationalData.staffPerformance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Staff Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operationalData.staffPerformance.slice(0, 5).map((staff) => (
                  <div key={staff.staffId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-coffee-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {staff.staffName.charAt(staff.staffName.length - 1)}
                      </div>
                      <div>
                        <p className="font-medium">{staff.staffName}</p>
                        <p className="text-sm text-gray-600">{staff.ordersCompleted} orders completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{staff.efficiency.toFixed(0)}% efficiency</p>
                      <p className="text-xs text-gray-600">{staff.averagePreparationTime.toFixed(1)}min avg</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Insights & Recommendations */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.length > 0 ? insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{insight}</p>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No insights available for the current data.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Actionable Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.length > 0 ? recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{rec}</p>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No recommendations available for the current data.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
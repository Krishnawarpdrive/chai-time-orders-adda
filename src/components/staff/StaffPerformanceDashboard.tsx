
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Clock, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StaffPerformanceProps {
  staffId: string;
  name: string;
  completionRate: number;
  avgOrderTime: number; // in minutes
  accuracyRate: number;
  customerRating: number; // out of 5
  totalOrdersToday: number;
  totalOrdersCompleted: number;
}

const StaffPerformanceCard = ({ 
  name, 
  completionRate, 
  avgOrderTime, 
  accuracyRate, 
  customerRating,
  totalOrdersToday,
  totalOrdersCompleted 
}: StaffPerformanceProps) => {
  
  // Determine performance status based on metrics
  const getPerformanceStatus = () => {
    const averageScore = (completionRate + (accuracyRate * 20) + (customerRating * 20)) / 3;
    if (averageScore >= 80) return { label: "Excellent", color: "bg-green-500" };
    if (averageScore >= 60) return { label: "Good", color: "bg-green-400" };
    if (averageScore >= 40) return { label: "Average", color: "bg-yellow-400" };
    return { label: "Needs Improvement", color: "bg-red-500" };
  };

  const performanceStatus = getPerformanceStatus();
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-coffee-green">{name}</CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs text-white ${performanceStatus.color}`}>
            {performanceStatus.label}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle size={16} className="text-coffee-green" />
                Completion Rate
              </span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="flex items-center gap-1">
                <Clock size={16} className="text-coffee-green" />
                Avg. Order Time
              </span>
              <span className="font-medium">{avgOrderTime} min</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (avgOrderTime * 5))} 
              className="h-2" 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle size={16} className="text-coffee-green" />
                Accuracy Rate
              </span>
              <span className="font-medium">{accuracyRate}%</span>
            </div>
            <Progress value={accuracyRate} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <Star size={16} className="text-yellow-500 mr-1" />
              <span className="text-sm">Rating: {customerRating.toFixed(1)}/5.0</span>
            </div>
            <div className="text-sm text-gray-600">
              {totalOrdersCompleted}/{totalOrdersToday} orders
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const mockStaffData: StaffPerformanceProps[] = [
  {
    staffId: '1',
    name: 'Arjun Kumar',
    completionRate: 92,
    avgOrderTime: 4.5,
    accuracyRate: 95,
    customerRating: 4.8,
    totalOrdersToday: 24,
    totalOrdersCompleted: 22
  },
  {
    staffId: '2',
    name: 'Priya Sharma',
    completionRate: 86,
    avgOrderTime: 5.2,
    accuracyRate: 90,
    customerRating: 4.5,
    totalOrdersToday: 20,
    totalOrdersCompleted: 17
  },
  {
    staffId: '3',
    name: 'Raj Patel',
    completionRate: 75,
    avgOrderTime: 6.8,
    accuracyRate: 85,
    customerRating: 3.9,
    totalOrdersToday: 18,
    totalOrdersCompleted: 13
  },
];

const StaffPerformanceDashboard = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-coffee-green">Staff Performance</h2>
        <Tabs defaultValue="today" className="w-[220px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockStaffData.map(staff => (
          <StaffPerformanceCard 
            key={staff.staffId}
            {...staff}
          />
        ))}
      </div>
    </div>
  );
};

export default StaffPerformanceDashboard;

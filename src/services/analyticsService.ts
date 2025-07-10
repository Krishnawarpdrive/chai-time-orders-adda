import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem, MenuItem } from '@/types/supabase';

export interface SalesData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: ProductSalesData[];
  hourlyBreakdown: HourlyData[];
  dailyTrend: DailyTrendData[];
}

export interface ProductSalesData {
  productName: string;
  quantity: number;
  revenue: number;
  percentage: number;
}

export interface HourlyData {
  hour: string;
  orders: number;
  revenue: number;
}

export interface DailyTrendData {
  date: string;
  revenue: number;
  orders: number;
}

export interface OperationalData {
  averagePreparationTime: number;
  completionRate: number;
  pendingOrders: number;
  peakHours: string[];
}

export interface CustomerFeedbackData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
}

class AnalyticsService {
  async getSalesData(dateRange: { from: Date; to: Date }, productFilter?: string): Promise<SalesData> {
    try {
      // Fetch orders with items
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (*)
          )
        `)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .eq('status', 'Completed');

      if (ordersError) throw ordersError;

      // Filter by product if specified
      let filteredOrders = orders || [];
      if (productFilter && productFilter !== 'all') {
        filteredOrders = orders?.filter(order => 
          order.order_items?.some(item => 
            item.menu_items?.category === productFilter
          )
        ) || [];
      }

      const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.amount), 0);
      const totalOrders = filteredOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate top products
      const productSales = new Map<string, { quantity: number; revenue: number }>();
      
      filteredOrders.forEach(order => {
        order.order_items?.forEach(item => {
          if (item.menu_items) {
            const key = item.menu_items.name;
            const current = productSales.get(key) || { quantity: 0, revenue: 0 };
            productSales.set(key, {
              quantity: current.quantity + item.quantity,
              revenue: current.revenue + (item.quantity * Number(item.menu_items.price))
            });
          }
        });
      });

      const topProducts: ProductSalesData[] = Array.from(productSales.entries())
        .map(([name, data]) => ({
          productName: name,
          quantity: data.quantity,
          revenue: data.revenue,
          percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Calculate hourly breakdown
      const hourlyData = new Map<string, { orders: number; revenue: number }>();
      filteredOrders.forEach(order => {
        const hour = new Date(order.created_at).getHours().toString().padStart(2, '0') + ':00';
        const current = hourlyData.get(hour) || { orders: 0, revenue: 0 };
        hourlyData.set(hour, {
          orders: current.orders + 1,
          revenue: current.revenue + Number(order.amount)
        });
      });

      const hourlyBreakdown: HourlyData[] = Array.from(hourlyData.entries())
        .map(([hour, data]) => ({ hour, ...data }))
        .sort((a, b) => a.hour.localeCompare(b.hour));

      // Calculate daily trend (last 7 days)
      const dailyData = new Map<string, { orders: number; revenue: number }>();
      filteredOrders.forEach(order => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        const current = dailyData.get(date) || { orders: 0, revenue: 0 };
        dailyData.set(date, {
          orders: current.orders + 1,
          revenue: current.revenue + Number(order.amount)
        });
      });

      const dailyTrend: DailyTrendData[] = Array.from(dailyData.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        topProducts,
        hourlyBreakdown,
        dailyTrend
      };
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw error;
    }
  }

  async getOperationalData(dateRange: { from: Date; to: Date }): Promise<OperationalData> {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());

      if (error) throw error;

      const completedOrders = orders?.filter(order => order.status === 'Completed') || [];
      const pendingOrders = orders?.filter(order => 
        ['Pending', 'Accepted', 'Preparing'].includes(order.status)
      ).length || 0;

      // Calculate average preparation time (mock calculation)
      const averagePreparationTime = 12; // minutes

      // Calculate completion rate
      const completionRate = orders?.length ? (completedOrders.length / orders.length) * 100 : 0;

      // Identify peak hours
      const hourCounts = new Map<number, number>();
      completedOrders.forEach(order => {
        const hour = new Date(order.created_at).getHours();
        hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      });

      const peakHours = Array.from(hourCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hour]) => `${hour.toString().padStart(2, '0')}:00`);

      return {
        averagePreparationTime,
        completionRate,
        pendingOrders,
        peakHours
      };
    } catch (error) {
      console.error('Error fetching operational data:', error);
      throw error;
    }
  }

  async getCustomerFeedbackData(): Promise<CustomerFeedbackData> {
    // Mock data since we don't have a feedback table yet
    return {
      averageRating: 4.2,
      totalReviews: 247,
      ratingDistribution: [
        { rating: 5, count: 120 },
        { rating: 4, count: 87 },
        { rating: 3, count: 25 },
        { rating: 2, count: 10 },
        { rating: 1, count: 5 }
      ]
    };
  }

  async getMenuItems() {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  }

  getInsights(salesData: SalesData, operationalData: OperationalData): string[] {
    const insights: string[] = [];

    // Revenue insights
    if (salesData.averageOrderValue > 50) {
      insights.push("High average order value indicates premium customer base");
    }

    if (salesData.totalOrders > 100) {
      insights.push("Strong daily order volume shows healthy business flow");
    }

    // Operational insights
    if (operationalData.completionRate > 95) {
      insights.push("Excellent order completion rate demonstrates operational efficiency");
    } else if (operationalData.completionRate < 85) {
      insights.push("Order completion rate below optimal - review kitchen workflows");
    }

    if (operationalData.averagePreparationTime > 15) {
      insights.push("Preparation time above average - consider process optimization");
    }

    // Product insights
    if (salesData.topProducts.length > 0) {
      const topProduct = salesData.topProducts[0];
      if (topProduct.percentage > 40) {
        insights.push(`${topProduct.productName} dominates sales - consider promoting other items`);
      }
    }

    return insights;
  }

  getRecommendations(salesData: SalesData, operationalData: OperationalData): string[] {
    const recommendations: string[] = [];

    // Peak hours recommendations
    if (operationalData.peakHours.length > 0) {
      recommendations.push(`Schedule additional staff during peak hours: ${operationalData.peakHours.join(', ')}`);
    }

    // Product recommendations
    if (salesData.topProducts.length > 0) {
      const lowPerformers = salesData.topProducts.filter(p => p.percentage < 10);
      if (lowPerformers.length > 0) {
        recommendations.push("Consider promotional campaigns for underperforming products");
      }
    }

    // Operational recommendations
    if (operationalData.pendingOrders > 10) {
      recommendations.push("High pending orders - consider increasing kitchen capacity");
    }

    if (operationalData.averagePreparationTime > 15) {
      recommendations.push("Implement prep time optimization strategies");
    }

    // Revenue recommendations
    if (salesData.averageOrderValue < 30) {
      recommendations.push("Introduce upselling strategies to increase average order value");
    }

    return recommendations;
  }
}

export const analyticsService = new AnalyticsService();
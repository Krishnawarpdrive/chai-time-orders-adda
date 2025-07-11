import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Coffee, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  status: string;
  amount: number;
  created_at: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  quantity: number;
  item?: {
    name: string;
    category: string;
  };
}

const statusColumns = [
  { 
    title: 'Not Started', 
    statuses: ['Not Started', 'Pending'], 
    color: 'bg-destructive/10 border-destructive/20',
    headerColor: 'text-destructive',
    icon: AlertCircle 
  },
  { 
    title: 'Preparing', 
    statuses: ['Accepted', 'Preparing'], 
    color: 'bg-coffee-green/10 border-coffee-green/20',
    headerColor: 'text-coffee-green',
    icon: Clock 
  },
  { 
    title: 'Pick Up', 
    statuses: ['Ready To Pick', 'Ready'], 
    color: 'bg-accent/20 border-accent',
    headerColor: 'text-accent-foreground',
    icon: CheckCircle 
  }
];

const getItemIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'coffee':
    case 'beverages':
      return <Coffee className="w-6 h-6 animate-pulse" />;
    default:
      return <Coffee className="w-6 h-6" />;
  }
};

const OrderCard: React.FC<{ order: Order; isHighlighted: boolean }> = ({ order, isHighlighted }) => {
  const orderAge = Math.floor((Date.now() - new Date(order.created_at).getTime()) / (1000 * 60));
  const isUrgent = orderAge > 15;

  return (
    <Card className={cn(
      "mb-4 transition-all duration-500 hover:scale-105",
      isHighlighted && "ring-4 ring-primary/50 shadow-lg",
      isUrgent && "border-destructive bg-destructive/5"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-hackney font-bold text-primary">
              #{order.order_id}
            </span>
            {isUrgent && (
              <AlertCircle className="w-5 h-5 text-destructive animate-pulse" />
            )}
          </div>
          <span className="text-lg font-medium text-muted-foreground">
            {orderAge}m ago
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-card-foreground">
          {order.customer_name}
        </h3>
        
        {order.items && order.items.length > 0 && (
          <div className="space-y-2">
            {order.items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-base">
                {getItemIcon(item.item?.category || '')}
                <span className="flex-1">{item.item?.name}</span>
                <span className="font-medium">x{item.quantity}</span>
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="text-sm text-muted-foreground">
                +{order.items.length - 3} more items
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-border">
          <span className="text-lg font-bold text-primary">
            ₹{order.amount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusColumn: React.FC<{ 
  column: typeof statusColumns[0]; 
  orders: Order[];
  highlightedOrder: string | null;
}> = ({ column, orders, highlightedOrder }) => {
  const Icon = column.icon;
  
  return (
    <div className={cn("rounded-xl border-2 p-6 min-h-[80vh]", column.color)}>
      <div className="flex items-center gap-3 mb-6">
        <Icon className={cn("w-8 h-8", column.headerColor)} />
        <div>
          <h2 className={cn("text-3xl font-hackney font-bold", column.headerColor)}>
            {column.title}
          </h2>
          <span className="text-lg text-muted-foreground">
            {orders.length} orders
          </span>
        </div>
      </div>
      
      <div className="space-y-4 max-h-[calc(80vh-120px)] overflow-y-auto">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Icon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-xl text-muted-foreground">No orders</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isHighlighted={highlightedOrder === order.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default function TVDisplay() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [highlightedOrder, setHighlightedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['Not Started', 'Pending', 'Accepted', 'Preparing', 'Ready To Pick', 'Ready'])
        .order('created_at', { ascending: true });

      if (ordersError) throw ordersError;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: itemsData } = await supabase
            .from('order_items')
            .select(`
              id,
              quantity,
              item:item_id(name, category)
            `)
            .eq('order_id', order.id);

          return {
            ...order,
            items: itemsData || []
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('tv-display-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order updated:', payload);
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setHighlightedOrder(payload.new.id);
            setTimeout(() => setHighlightedOrder(null), 3000);
          }
          fetchOrders();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Coffee className="w-16 h-16 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-2xl font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-hackney font-bold text-primary mb-2">
          Order Status
        </h1>
        <p className="text-2xl text-muted-foreground">
          Live updates • {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
        {statusColumns.map((column) => {
          const columnOrders = orders.filter(order => 
            column.statuses.includes(order.status)
          );
          
          return (
            <StatusColumn
              key={column.title}
              column={column}
              orders={columnOrders}
              highlightedOrder={highlightedOrder}
            />
          );
        })}
      </div>

      {/* Footer stats */}
      <div className="mt-8 text-center">
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
          {statusColumns.map((column) => {
            const count = orders.filter(order => 
              column.statuses.includes(order.status)
            ).length;
            
            return (
              <div key={column.title} className="text-center">
                <div className={cn("text-3xl font-bold", column.headerColor)}>
                  {count}
                </div>
                <div className="text-sm text-muted-foreground">
                  {column.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
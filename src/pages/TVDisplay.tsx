import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Coffee, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CoastersLogo, DecorativeBorder } from '@/components/ui/coasters-logo';
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
    color: 'bg-muted/50 border-border',
    headerColor: 'text-muted-foreground',
    icon: Coffee 
  },
  { 
    title: 'Preparing', 
    statuses: ['Accepted', 'Preparing'], 
    color: 'bg-primary/10 border-primary/20',
    headerColor: 'text-primary',
    icon: Coffee 
  },
  { 
    title: 'Pick Up', 
    statuses: ['Ready To Pick', 'Ready'], 
    color: 'bg-secondary/20 border-secondary',
    headerColor: 'text-secondary-foreground',
    icon: CheckCircle 
  }
];

const getItemIcon = (category: string, status: string, isReady: boolean = false) => {
  let iconClass = "w-6 h-6";
  
  if (status === 'Preparing') {
    iconClass += isReady ? " animate-bounce text-green-500" : " animate-pulse text-primary";
  } else if (status === 'Ready To Pick' || status === 'Ready') {
    iconClass += " animate-bounce text-secondary-foreground";
  } else {
    iconClass += " text-muted-foreground";
  }
  
  return <Coffee className={iconClass} />;
};

const OrderCard: React.FC<{ order: Order; isHighlighted: boolean; columnTitle: string }> = ({ order, isHighlighted, columnTitle }) => {
  // Simulate item readiness - in real app, this would come from order_items status
  const isItemReady = (itemIndex: number) => {
    // For demo: alternate items are ready in Preparing column
    return columnTitle === 'Preparing' && itemIndex % 2 === 0;
  };

  return (
    <Card className={cn(
      "mb-4 transition-all duration-500 hover:scale-105",
      isHighlighted && "ring-4 ring-primary/50 shadow-lg"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl font-hackney font-bold text-primary">
            #{order.order_id}
          </span>
        </div>
        
        {order.items && order.items.length > 0 && (
          <div className="space-y-3">
            {order.items.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-lg relative">
                {getItemIcon(item.item?.category || '', order.status, isItemReady(index))}
                <span className="flex-1 font-medium">{item.item?.name}</span>
                <span className="font-bold text-primary">x{item.quantity}</span>
                {isItemReady(index) && columnTitle === 'Preparing' && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Prepared
                  </span>
                )}
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="text-center text-sm text-muted-foreground font-medium">
                +{order.items.length - 4} more items
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-border text-center">
          <span className="text-xl font-bold text-primary">
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
  
  // Animation classes based on column
  let iconAnimation = "";
  if (column.title === 'Preparing') {
    iconAnimation = "animate-spin";
  } else if (column.title === 'Pick Up') {
    iconAnimation = "animate-bounce";
  }
  
  return (
    <div className={cn("rounded-xl border-2 p-6 min-h-[80vh]", column.color)}>
      <div className="flex flex-col items-center mb-6">
        <Icon className={cn("w-12 h-12 mb-3", column.headerColor, iconAnimation)} />
        <h2 className={cn("text-3xl font-hackney font-bold text-center", column.headerColor)}>
          {column.title}
        </h2>
        <span className="text-lg text-muted-foreground mt-1">
          {orders.length} orders
        </span>
      </div>
      
      <div className="space-y-4 max-h-[calc(80vh-160px)] overflow-y-auto">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Icon className={cn("w-20 h-20 mx-auto mb-4 text-muted-foreground/30", iconAnimation)} />
            <p className="text-xl text-muted-foreground">No orders</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isHighlighted={highlightedOrder === order.id}
              columnTitle={column.title}
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
      {/* Header with Coasters branding */}
      <div className="text-center mb-8">
        <CoastersLogo size="lg" className="mb-4" />
        <DecorativeBorder className="w-64 h-6 mx-auto mb-4" />
        <p className="text-2xl text-muted-foreground font-medium">
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
                <div className="text-sm text-muted-foreground font-medium">
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
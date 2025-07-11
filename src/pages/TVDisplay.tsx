import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Coffee, Clock, CheckCircle, Timer, ChefHat, Bell } from 'lucide-react';
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
  status?: string;
  item?: {
    name: string;
    category: string;
  };
}

const statusColumns = [
  { 
    title: 'Queue', 
    statuses: ['Not Started', 'Pending'], 
    color: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200',
    headerColor: 'text-slate-600',
    icon: Clock,
    accent: 'hsl(var(--slate-500))'
  },
  { 
    title: 'Kitchen', 
    statuses: ['Accepted', 'Preparing'], 
    color: 'bg-gradient-to-br from-primary/5 to-primary/15 border-primary/30',
    headerColor: 'text-primary',
    icon: ChefHat,
    accent: 'hsl(var(--primary))'
  },
  { 
    title: 'Ready', 
    statuses: ['Ready To Pick', 'Ready'], 
    color: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200',
    headerColor: 'text-emerald-600',
    icon: Bell,
    accent: 'hsl(142, 76%, 36%)'
  }
];

const getItemIcon = (category: string, itemStatus: string, orderStatus: string) => {
  const getStatusColor = () => {
    if (itemStatus === 'Ready' || itemStatus === 'Finished') return 'text-emerald-500';
    if (itemStatus === 'Preparing' || itemStatus === 'Started') return 'text-primary';
    return 'text-slate-400';
  };

  const getAnimation = () => {
    if (itemStatus === 'Ready' || itemStatus === 'Finished') return 'animate-bounce';
    if (itemStatus === 'Preparing' || itemStatus === 'Started') return 'animate-pulse';
    return '';
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Coffee className={cn("w-5 h-5", getStatusColor(), getAnimation())} />
    </motion.div>
  );
};

const OrderCard: React.FC<{ order: Order; isHighlighted: boolean; columnTitle: string }> = ({ order, isHighlighted, columnTitle }) => {
  const getOrderAge = () => {
    const now = new Date();
    const orderTime = new Date(order.created_at);
    const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    return diffMinutes;
  };

  const getUrgencyColor = () => {
    const age = getOrderAge();
    if (age > 20) return 'border-red-400 bg-red-50';
    if (age > 10) return 'border-orange-400 bg-orange-50';
    return '';
  };

  const cardVariants = {
    initial: { scale: 0.95, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.95, opacity: 0, y: -20 },
    hover: { scale: 1.02, y: -4 }
  };

  const highlightVariants = {
    initial: { boxShadow: '0 0 0 0px hsl(var(--primary) / 0.5)' },
    animate: { 
      boxShadow: [
        '0 0 0 0px hsl(var(--primary) / 0.5)',
        '0 0 0 8px hsl(var(--primary) / 0.2)',
        '0 0 0 0px hsl(var(--primary) / 0.5)'
      ]
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        "border-2 bg-white/80 backdrop-blur-sm",
        getUrgencyColor(),
        isHighlighted && "ring-2 ring-primary/50"
      )}>
        {isHighlighted && (
          <motion.div
            variants={highlightVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 2, repeat: 2 }}
            className="absolute inset-0 rounded-lg"
          />
        )}
        
        <CardContent className="p-5">
          {/* Order Header */}
          <div className="flex items-center justify-between mb-4">
            <motion.span 
              className="text-2xl font-hackney font-bold text-primary"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              #{order.order_id}
            </motion.span>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">{getOrderAge()}m ago</div>
              {getOrderAge() > 15 && (
                <motion.div 
                  className="text-xs text-red-500 font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  URGENT
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-2.5">
              <AnimatePresence>
                {order.items.slice(0, 5).map((item, index) => {
                  const itemStatus = item.status || 'Not Started';
                  
                  return (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg transition-all",
                        "hover:bg-primary/5",
                        itemStatus === 'Ready' && "bg-emerald-50 border border-emerald-200"
                      )}
                    >
                      {getItemIcon(item.item?.category || '', itemStatus, order.status)}
                      <span className="flex-1 font-medium text-sm truncate">
                        {item.item?.name}
                      </span>
                      <span className="font-bold text-primary text-sm">×{item.quantity}</span>
                      
                      {itemStatus === 'Ready' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-emerald-400 rounded-full"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {order.items.length > 5 && (
                <div className="text-center text-xs text-muted-foreground font-medium py-1">
                  +{order.items.length - 5} more items
                </div>
              )}
            </div>
          )}
          
          {/* Order Footer */}
          <motion.div 
            className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-lg font-bold text-primary">
              ₹{order.amount}
            </span>
            
            {columnTitle === 'Kitchen' && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Timer className="w-3 h-3" />
                <span>~{Math.max(5 - Math.floor(getOrderAge() / 2), 1)}m</span>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StatusColumn: React.FC<{ 
  column: typeof statusColumns[0]; 
  orders: Order[];
  highlightedOrder: string | null;
  index: number;
}> = ({ column, orders, highlightedOrder, index }) => {
  const Icon = column.icon;
  
  const getIconAnimation = () => {
    if (column.title === 'Kitchen') return 'animate-pulse';
    if (column.title === 'Ready') return 'animate-bounce';
    return '';
  };

  const columnVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  };

  const headerVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  };

  return (
    <motion.div
      variants={columnVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        "rounded-2xl border-2 p-6 min-h-[85vh] relative overflow-hidden",
        "backdrop-blur-sm shadow-lg",
        column.color
      )}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, ${column.accent} 1px, transparent 1px), radial-gradient(circle at 80% 20%, ${column.accent} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        variants={headerVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.3 + index * 0.1 }}
        className="flex flex-col items-center mb-6 relative z-10"
      >
        <motion.div
          animate={{ 
            rotate: column.title === 'Kitchen' ? [0, 5, -5, 0] : 0 
          }}
          transition={{ 
            duration: 2, 
            repeat: column.title === 'Kitchen' ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <Icon className={cn(
            "w-14 h-14 mb-3 drop-shadow-sm", 
            column.headerColor, 
            getIconAnimation()
          )} />
        </motion.div>
        
        <h2 className={cn(
          "text-3xl font-hackney font-bold text-center mb-2", 
          column.headerColor
        )}>
          {column.title}
        </h2>
        
        <motion.div
          className="flex items-center gap-2"
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            "border border-current/20 bg-white/50"
          )}>
            <span className={column.headerColor}>{orders.length} orders</span>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Orders List */}
      <div className="space-y-3 max-h-[calc(85vh-180px)] overflow-y-auto custom-scrollbar relative z-10">
        <AnimatePresence mode="popLayout">
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <Icon className={cn(
                "w-24 h-24 mx-auto mb-4 opacity-20", 
                getIconAnimation()
              )} />
              <p className="text-xl text-muted-foreground font-medium">
                No orders in {column.title.toLowerCase()}
              </p>
            </motion.div>
          ) : (
            orders.map((order, orderIndex) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ 
                  duration: 0.3,
                  delay: orderIndex * 0.05,
                  layout: { duration: 0.3 }
                }}
              >
                <OrderCard
                  order={order}
                  isHighlighted={highlightedOrder === order.id}
                  columnTitle={column.title}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
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
              status,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Coffee className="w-20 h-20 mx-auto mb-6 text-primary" />
          </motion.div>
          <motion.p
            className="text-2xl font-medium text-muted-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading kitchen display...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 p-6">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <CoastersLogo size="lg" className="mb-4 drop-shadow-sm" />
          </motion.div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <DecorativeBorder className="w-80 h-6 mx-auto mb-6" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-3 text-xl text-muted-foreground font-medium"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-emerald-500 rounded-full"
            />
            <span>Live Kitchen Display</span>
            <span className="text-primary font-mono">
              {new Date().toLocaleTimeString()}
            </span>
          </motion.div>
        </motion.div>

        {/* Three-column layout */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
          {statusColumns.map((column, index) => {
            const columnOrders = orders.filter(order => 
              column.statuses.includes(order.status)
            );
            
            return (
              <StatusColumn
                key={column.title}
                column={column}
                orders={columnOrders}
                highlightedOrder={highlightedOrder}
                index={index}
              />
            );
          })}
        </motion.div>

        {/* Enhanced Footer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {statusColumns.map((column, index) => {
              const count = orders.filter(order => 
                column.statuses.includes(order.status)
              ).length;
              
              return (
                <motion.div
                  key={column.title}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                  className="text-center"
                >
                  <motion.div
                    className={cn("text-4xl font-bold mb-1", column.headerColor)}
                    animate={{ scale: count > 0 ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {count}
                  </motion.div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                    {column.title}
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 text-xs text-muted-foreground"
          >
            Last updated: {new Date().toLocaleString()}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
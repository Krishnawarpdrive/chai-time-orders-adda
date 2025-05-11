import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem, MenuItem, Customer } from "@/types/supabase";

export const orderService = {
  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*');
      
    if (error) {
      console.error("Error fetching menu items:", error);
      return [];
    }
    return data as MenuItem[];
  },

  // Customers
  async getCustomerByPhone(phoneNumber: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();
      
    if (error) {
      if (error.code !== 'PGRST116') { // No rows returned
        console.error("Error fetching customer:", error);
      }
      return null;
    }
    return data as Customer;
  },
  
  async createCustomer(customer: Pick<Customer, 'name' | 'phone_number'> & Partial<Omit<Customer, 'name' | 'phone_number'>>): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customer.name,
        phone_number: customer.phone_number,
        dob: customer.dob || null,
        badge: customer.badge || 'New'
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating customer:", error);
      return null;
    }
    return data as Customer;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
    return data as Order[];
  },
  
  async getOrderWithItems(orderId: string): Promise<Order | null> {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
      
    if (orderError) {
      console.error("Error fetching order:", orderError);
      return null;
    }
    
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*, item:item_id(name, price, category)')
      .eq('order_id', orderId);
      
    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return orderData as Order;
    }
    
    return {
      ...orderData,
      items: orderItems as OrderItem[]
    } as Order;
  },

  async getOrderHistoryByCustomer(customerName: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, item:item_id(name, price, category))')
      .eq('customer_name', customerName)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching customer order history:", error);
      return [];
    }
    return data as Order[];
  },

  async createOrder(
    order: Pick<Order, 'order_id' | 'customer_name' | 'phone_number' | 'amount'> & Partial<Omit<Order, 'order_id' | 'customer_name' | 'phone_number' | 'amount'>>, 
    orderItems: Partial<OrderItem>[]
  ): Promise<Order | null> {
    // Start a transaction
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_id: order.order_id,
        customer_name: order.customer_name,
        phone_number: order.phone_number,
        amount: order.amount,
        dob: order.dob || null,
        customer_badge: order.customer_badge || 'New',
        status: order.status || 'Pending'
      })
      .select()
      .single();
      
    if (orderError) {
      console.error("Error creating order:", orderError);
      return null;
    }
    
    // Add items to the order
    const orderItemsWithId = orderItems.map(item => ({
      ...item,
      order_id: orderData.id,
      quantity: item.quantity || 1 // Fix: Ensure quantity is set
    }));
    
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithId)
      .select();
      
    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Ideally, we would roll back the transaction here
      return orderData as Order;
    }
    
    return {
      ...orderData,
      items: itemsData as OrderItem[]
    } as Order;
  },

  // Order Items
  async updateOrderItemStatus(itemId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('order_items')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', itemId);
      
    if (error) {
      console.error("Error updating order item status:", error);
    }
  },

  // Helper method to get item-based view
  async getItemBasedView(): Promise<any[]> {
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('*');
      
    if (menuError) {
      console.error("Error fetching menu items:", menuError);
      return [];
    }
    
    const result = [];
    
    for (const item of menuItems) {
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*, order:order_id(order_id, id, customer_name)')
        .eq('item_id', item.id);
        
      if (itemsError) {
        console.error(`Error fetching order items for ${item.name}:`, itemsError);
        continue;
      }
      
      const orders = orderItems.map(orderItem => ({
        orderId: orderItem.order.order_id,
        customerId: orderItem.order.id,
        customerName: orderItem.order.customer_name,
        quantity: orderItem.quantity,
        status: orderItem.status,
        itemId: item.id
      }));
      
      result.push({
        id: item.id,
        name: item.name,
        totalQuantity: orderItems.reduce((sum, item) => sum + item.quantity, 0),
        status: 'Not Started',
        orders
      });
    }
    
    return result;
  }
};


export interface Customer {
  id: string;
  name: string;
  phone_number: string;
  dob: string | null;
  badge: string;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'coffee' | 'tea' | 'snack';
}

export type OrderStatus = 
  | 'Pending' 
  | 'Accepted' 
  | 'Preparing' 
  | 'Ready To Pick' 
  | 'Picked' 
  | 'Completed' 
  | 'Cancelled'
  | 'Not Started'
  | 'Started'
  | 'Finished'
  | 'Ready for Hand Over';

export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  phone_number: string;
  dob: string | null;
  customer_badge: string;
  amount: number;
  status: OrderStatus | string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  quantity: number;
  status: string;
  created_at: string;
  updated_at: string;
  item?: MenuItem;
}

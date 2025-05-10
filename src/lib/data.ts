
export type OrderStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Ready To Pick' | 'Picked' | 'Completed' | 'Cancelled';
export type CustomerLoyalty = 'Frequent' | 'Periodic' | 'New';
export type PaymentType = 'Cash' | 'Credit' | 'Digital Wallet';

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  orderId: string;
  date: string;
  customer: string;
  customerLoyalty: CustomerLoyalty;
  status: OrderStatus;
  amount: number;
  paymentType: PaymentType;
  items: OrderItem[];
}

export const orderData: Order[] = [
  {
    id: 1,
    orderId: 'ORD-001',
    date: '2025-05-10T08:30:00',
    customer: 'Rajesh Kumar',
    customerLoyalty: 'Frequent',
    status: 'Pending',
    amount: 450,
    paymentType: 'Cash',
    items: [
      { id: 1, name: 'Filter Coffee', quantity: 2, price: 80 },
      { id: 2, name: 'Masala Dosa', quantity: 1, price: 120 },
      { id: 3, name: 'Chow Chow Bath', quantity: 1, price: 90 },
      { id: 4, name: 'Idli Sambar', quantity: 2, price: 80 },
    ]
  },
  {
    id: 2,
    orderId: 'ORD-002',
    date: '2025-05-10T09:15:00',
    customer: 'Priya Sharma',
    customerLoyalty: 'Periodic',
    status: 'Accepted',
    amount: 275,
    paymentType: 'Credit',
    items: [
      { id: 1, name: 'Veg Biryani', quantity: 1, price: 180 },
      { id: 2, name: 'Gulab Jamun', quantity: 3, price: 95 },
    ]
  },
  {
    id: 3,
    orderId: 'ORD-003',
    date: '2025-05-10T10:00:00',
    customer: 'Vikram Singh',
    customerLoyalty: 'New',
    status: 'Preparing',
    amount: 320,
    paymentType: 'Digital Wallet',
    items: [
      { id: 1, name: 'Butter Chicken', quantity: 1, price: 220 },
      { id: 2, name: 'Naan', quantity: 2, price: 60 },
      { id: 3, name: 'Sweet Lassi', quantity: 1, price: 40 },
    ]
  },
  {
    id: 4,
    orderId: 'ORD-004',
    date: '2025-05-10T10:30:00',
    customer: 'Anjali Nair',
    customerLoyalty: 'Frequent',
    status: 'Ready To Pick',
    amount: 520,
    paymentType: 'Digital Wallet',
    items: [
      { id: 1, name: 'Chocolate Cake', quantity: 1, price: 350 },
      { id: 2, name: 'Cold Coffee', quantity: 2, price: 170 },
    ]
  },
  {
    id: 5,
    orderId: 'ORD-005',
    date: '2025-05-10T11:15:00',
    customer: 'Karthik Reddy',
    customerLoyalty: 'Periodic',
    status: 'Picked',
    amount: 190,
    paymentType: 'Cash',
    items: [
      { id: 1, name: 'South Indian Thali', quantity: 1, price: 190 },
    ]
  },
  {
    id: 6,
    orderId: 'ORD-006',
    date: '2025-05-10T12:00:00',
    customer: 'Meena Patil',
    customerLoyalty: 'Frequent',
    status: 'Completed',
    amount: 350,
    paymentType: 'Credit',
    items: [
      { id: 1, name: 'Penne Pasta', quantity: 1, price: 210 },
      { id: 2, name: 'Garlic Bread', quantity: 1, price: 80 },
      { id: 3, name: 'Cold Drink', quantity: 1, price: 60 },
    ]
  },
  {
    id: 7,
    orderId: 'ORD-007',
    date: '2025-05-10T12:45:00',
    customer: 'Rahul Verma',
    customerLoyalty: 'New',
    status: 'Cancelled',
    amount: 410,
    paymentType: 'Digital Wallet',
    items: [
      { id: 1, name: 'Pizza Margherita', quantity: 1, price: 280 },
      { id: 2, name: 'French Fries', quantity: 1, price: 130 },
    ]
  },
  {
    id: 8,
    orderId: 'ORD-008',
    date: '2025-05-10T13:30:00',
    customer: 'Shreya Desai',
    customerLoyalty: 'New',
    status: 'Pending',
    amount: 280,
    paymentType: 'Cash',
    items: [
      { id: 1, name: 'Veg Sandwich', quantity: 2, price: 160 },
      { id: 2, name: 'Mango Shake', quantity: 2, price: 120 },
    ]
  },
  {
    id: 9,
    orderId: 'ORD-009',
    date: '2025-05-10T14:15:00',
    customer: 'Manoj Pillai',
    customerLoyalty: 'Periodic',
    status: 'Accepted',
    amount: 390,
    paymentType: 'Credit',
    items: [
      { id: 1, name: 'Mysore Pak', quantity: 3, price: 210 },
      { id: 2, name: 'Filter Coffee', quantity: 3, price: 120 },
      { id: 3, name: 'Khara Bath', quantity: 1, price: 60 },
    ]
  },
  {
    id: 10,
    orderId: 'ORD-010',
    date: '2025-05-10T15:00:00',
    customer: 'Lalitha Iyer',
    customerLoyalty: 'Frequent',
    status: 'Preparing',
    amount: 500,
    paymentType: 'Digital Wallet',
    items: [
      { id: 1, name: 'Paneer Butter Masala', quantity: 1, price: 220 },
      { id: 2, name: 'Rumali Roti', quantity: 4, price: 120 },
      { id: 3, name: 'Jeera Rice', quantity: 1, price: 160 },
    ]
  },
];

export const filterOptions = [
  { label: 'All Orders', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Accepted', value: 'Accepted' },
  { label: 'Preparing', value: 'Preparing' },
  { label: 'Ready To Pick', value: 'Ready To Pick' },
  { label: 'Picked', value: 'Picked' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
];

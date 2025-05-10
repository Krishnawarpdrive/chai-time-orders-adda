
export type OrderStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Ready To Pick' | 'Picked' | 'Completed' | 'Cancelled';

export interface Order {
  id: number;
  orderId: string;
  date: string;
  customer: string;
  status: OrderStatus;
  amount: number;
}

export const orderData: Order[] = [
  {
    id: 1,
    orderId: 'ORD-001',
    date: '2025-05-10T08:30:00',
    customer: 'Rajesh Kumar',
    status: 'Pending',
    amount: 450,
  },
  {
    id: 2,
    orderId: 'ORD-002',
    date: '2025-05-10T09:15:00',
    customer: 'Priya Sharma',
    status: 'Accepted',
    amount: 275,
  },
  {
    id: 3,
    orderId: 'ORD-003',
    date: '2025-05-10T10:00:00',
    customer: 'Vikram Singh',
    status: 'Preparing',
    amount: 320,
  },
  {
    id: 4,
    orderId: 'ORD-004',
    date: '2025-05-10T10:30:00',
    customer: 'Anjali Nair',
    status: 'Ready To Pick',
    amount: 520,
  },
  {
    id: 5,
    orderId: 'ORD-005',
    date: '2025-05-10T11:15:00',
    customer: 'Karthik Reddy',
    status: 'Picked',
    amount: 190,
  },
  {
    id: 6,
    orderId: 'ORD-006',
    date: '2025-05-10T12:00:00',
    customer: 'Meena Patil',
    status: 'Completed',
    amount: 350,
  },
  {
    id: 7,
    orderId: 'ORD-007',
    date: '2025-05-10T12:45:00',
    customer: 'Rahul Verma',
    status: 'Cancelled',
    amount: 410,
  },
  {
    id: 8,
    orderId: 'ORD-008',
    date: '2025-05-10T13:30:00',
    customer: 'Shreya Desai',
    status: 'Pending',
    amount: 280,
  },
  {
    id: 9,
    orderId: 'ORD-009',
    date: '2025-05-10T14:15:00',
    customer: 'Manoj Pillai',
    status: 'Accepted',
    amount: 390,
  },
  {
    id: 10,
    orderId: 'ORD-010',
    date: '2025-05-10T15:00:00',
    customer: 'Lalitha Iyer',
    status: 'Preparing',
    amount: 500,
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

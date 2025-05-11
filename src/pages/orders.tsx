
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { OrdersTable } from '@/components/OrdersTable';
import { Order } from '@/lib/data';

// Sample orders data for initial rendering
const sampleOrders: Order[] = [
  {
    id: 1,
    orderId: "ORD-001",
    date: "2023-05-15T09:30:00",
    customer: "John Smith",
    customerLoyalty: "gold",
    status: "completed",
    amount: 245.50,
    paymentType: "card",
    items: [
      { id: 1, name: "Cappuccino", price: 120, quantity: 1 },
      { id: 2, name: "Chocolate Croissant", price: 95, quantity: 1 },
      { id: 3, name: "Fresh Orange Juice", price: 30.5, quantity: 1 }
    ]
  },
  {
    id: 2,
    orderId: "ORD-002",
    date: "2023-05-15T10:15:00",
    customer: "Maria Garcia",
    customerLoyalty: "silver",
    status: "in-progress",
    amount: 380.75,
    paymentType: "cash",
    items: [
      { id: 4, name: "Breakfast Combo", price: 280.75, quantity: 1 },
      { id: 5, name: "Latte", price: 100, quantity: 1 }
    ]
  },
  {
    id: 3,
    orderId: "ORD-003",
    date: "2023-05-15T11:45:00",
    customer: "David Wong",
    customerLoyalty: "new",
    status: "pending",
    amount: 175.25,
    paymentType: "upi",
    items: [
      { id: 6, name: "Espresso", price: 85.25, quantity: 1 },
      { id: 7, name: "Blueberry Muffin", price: 90, quantity: 1 }
    ]
  },
  {
    id: 4,
    orderId: "ORD-004",
    date: "2023-05-15T13:20:00",
    customer: "Sarah Johnson",
    customerLoyalty: "bronze",
    status: "completed",
    amount: 520,
    paymentType: "card",
    items: [
      { id: 8, name: "Family Lunch Combo", price: 450, quantity: 1 },
      { id: 9, name: "Iced Tea", price: 70, quantity: 1 }
    ]
  },
  {
    id: 5,
    orderId: "ORD-005",
    date: "2023-05-15T14:10:00",
    customer: "Raj Patel",
    customerLoyalty: "gold",
    status: "cancelled",
    amount: 150,
    paymentType: "upi",
    items: [
      { id: 10, name: "Coffee Cake", price: 150, quantity: 1 }
    ]
  }
];

export default function OrdersPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-coffee-green">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage customer orders and transactions
          </p>
          
          <div className="mt-8">
            <OrdersTable orders={sampleOrders} />
          </div>
        </div>
      </main>
    </div>
  );
}

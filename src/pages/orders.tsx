
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { OrdersTable } from '@/components/OrdersTable';

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
            <OrdersTable />
          </div>
        </div>
      </main>
    </div>
  );
}

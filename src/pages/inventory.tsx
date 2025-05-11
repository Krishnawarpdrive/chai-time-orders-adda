
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ProductInventorySidebar } from '@/components/ProductInventorySidebar';

export default function InventoryPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-coffee-green">Inventory Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your cafe's inventory and supplies
          </p>
          
          <div className="mt-8">
            <ProductInventorySidebar />
          </div>
        </div>
      </main>
    </div>
  );
}

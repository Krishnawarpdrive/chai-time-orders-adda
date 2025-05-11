
import React from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function HomePage() {
  // Reuse the existing main page content
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-coffee-green">
            Bisi Cafe Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your cafe management dashboard
          </p>
          
          {/* Content area */}
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Dashboard cards would go here */}
          </div>
        </div>
      </main>
    </div>
  );
}

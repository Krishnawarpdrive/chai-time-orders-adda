
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Index"; // Staff dashboard (order management)
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import InventoryPage from "./pages/Inventory";
import StaffPage from "./pages/Staff";
import OutletsPage from "./pages/Outlets";
import ReportsPage from "./pages/Reports";
import ReferPage from "./pages/Refer";
import CustomerHome from "./pages/CustomerHome";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerOrders from "./pages/CustomerOrders";
import CustomerRefer from "./pages/CustomerRefer";
import CustomerCart from "./pages/CustomerCart";
import TVDisplay from "./pages/TVDisplay";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const App = () => {
  // Read the stored persona to determine initial routing
  const storedPersona = localStorage.getItem('selected_persona') || 'customer';

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Customer routes */}
              <Route path="/" element={<CustomerHome />} />
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/orders" element={<CustomerOrders />} />
              <Route path="/refer" element={<CustomerRefer />} />
              <Route path="/cart" element={<CustomerCart />} />
              
              {/* Staff routes */}
              <Route path="/staff" element={<Home />} />
              <Route path="/staff/customers" element={<Home />} />
              <Route path="/staff/inventory" element={<InventoryPage />} />
              <Route path="/staff/products" element={<Products />} />
              <Route path="/staff/categories" element={<Home />} />
              <Route path="/staff/offers" element={<Home />} />
              <Route path="/staff/reports" element={<ReportsPage />} />
              
              {/* Franchise routes */}
              <Route path="/franchise" element={<Home />} />
              <Route path="/franchise/customers" element={<Home />} />
              <Route path="/franchise/inventory" element={<InventoryPage />} />
              <Route path="/franchise/staff" element={<StaffPage />} />
              <Route path="/franchise/products" element={<Products />} />
              <Route path="/franchise/categories" element={<Home />} />
              <Route path="/franchise/offers" element={<Home />} />
              <Route path="/franchise/reports" element={<ReportsPage />} />
              
              {/* Brand routes */}
              <Route path="/brand" element={<Home />} />
              <Route path="/brand/customers" element={<Home />} />
              <Route path="/brand/inventory" element={<InventoryPage />} />
              <Route path="/brand/staff" element={<StaffPage />} />
              <Route path="/brand/outlets" element={<OutletsPage />} />
              <Route path="/brand/products" element={<Products />} />
              <Route path="/brand/categories" element={<Home />} />
              <Route path="/brand/offers" element={<Home />} />
              <Route path="/brand/reports" element={<ReportsPage />} />
              
              {/* Redirect legacy paths */}
              <Route path="/admin" element={<Navigate to="/staff" replace />} />
              <Route path="/customers" element={<Navigate to="/staff/customers" replace />} />
              <Route path="/inventory" element={<Navigate to="/staff/inventory" replace />} />
              <Route path="/staff" element={<Navigate to="/franchise/staff" replace />} />
              <Route path="/outlets" element={<Navigate to="/brand/outlets" replace />} />
              <Route path="/categories" element={<Navigate to="/staff/categories" replace />} />
              <Route path="/products" element={<Navigate to="/staff/products" replace />} />
              <Route path="/offers" element={<Navigate to="/staff/offers" replace />} />
              <Route path="/reports" element={<Navigate to="/staff/reports" replace />} />
              
              {/* TV Display route */}
              <Route path="/tv-display" element={<TVDisplay />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App;

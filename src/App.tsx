
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Index";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import InventoryPage from "./pages/Inventory";
import StaffPage from "./pages/Staff";
import OutletsPage from "./pages/Outlets";
import ReportsPage from "./pages/Reports";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Customer Pages
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerOrders from "./pages/customer/Orders";
import CustomerMenu from "./pages/customer/Menu";
import CustomerProfile from "./pages/customer/Profile";

// Layouts
import CustomerLayout from "./layouts/CustomerLayout";

// Auth Provider
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />

              {/* Staff/Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
                <Route path="/" element={<Home />} />
                <Route path="/customers" element={<Home />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/outlets" element={<OutletsPage />} />
                <Route path="/categories" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/offers" element={<Home />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Route>

              {/* Customer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                <Route element={<CustomerLayout />}>
                  <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                  <Route path="/customer/orders" element={<CustomerOrders />} />
                  <Route path="/customer/menu" element={<CustomerMenu />} />
                  <Route path="/customer/profile" element={<CustomerProfile />} />
                </Route>
              </Route>

              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

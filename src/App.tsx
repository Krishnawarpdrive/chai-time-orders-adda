
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Index"; // Corrected import - using the correct casing
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import InventoryPage from "./pages/Inventory";
import StaffPage from "./pages/Staff";
import OutletsPage from "./pages/Outlets";
import ReportsPage from "./pages/Reports";
import ReferPage from "./pages/Refer";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customers" element={<Home />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/outlets" element={<OutletsPage />} />
            <Route path="/categories" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/offers" element={<Home />} />
            <Route path="/orders" element={<Home />} />
            <Route path="/profile" element={<Home />} />
            <Route path="/cart" element={<Home />} />
            <Route path="/refer" element={<ReferPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

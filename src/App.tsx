import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Barbers from "./pages/Barbers";
import Booking from "./pages/Booking";
import Auth from "./pages/Auth";
import Explore from "./pages/Explore";
import RegisterBusiness from "./pages/RegisterBusiness";
import MyBookings from "./pages/MyBookings";
import ManagerDashboard from "./pages/ManagerDashboard";
import BarberDashboard from "./pages/BarberDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/barbers" element={<Barbers />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/register-business" element={<RegisterBusiness />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/barber/schedule" element={<BarberDashboard />} />
              <Route path="/barber/dashboard" element={<BarberDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import DashboardSeeker from "./pages/seeker/DashboardSeeker";
import Explore from "./pages/seeker/Explore";
import Events from "./pages/seeker/Events";
import Bookings from "./pages/seeker/Bookings";
import DashboardHost from "./pages/host/DashboardHost";
import AddParking from "./pages/host/AddParking";
import Calendar from "./pages/host/Calendar";
import HostBookings from "./pages/host/HostBookings";
import Transactions from "./pages/host/Transactions";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminParking from "./pages/admin/AdminParking";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminReports from "./pages/admin/AdminReports";
import BookSlot from "./pages/seeker/BookSlot";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* Seeker Routes */}
            <Route path="/dashboard-seeker" element={<DashboardSeeker />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/events" element={<Events />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/book-slot/:spotId" element={<BookSlot />} />
            
            {/* Host Routes */}
            <Route path="/dashboard-host" element={<DashboardHost />} />
            <Route path="/add-parking" element={<AddParking />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/host-bookings" element={<HostBookings />} />
            <Route path="/transactions" element={<Transactions />} />
            
            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-parking" element={<AdminParking />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/admin-transactions" element={<AdminTransactions />} />
            <Route path="/admin-reports" element={<AdminReports />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

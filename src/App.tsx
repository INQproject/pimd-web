
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FindParking from "./pages/FindParking";
import Events from "./pages/seeker/Events";
import ListDriveway from "./pages/ListDriveway";
import AreasWeServe from "./pages/AreasWeServe";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import MyUploads from "./pages/MyUploads";
import BookSlot from "./pages/seeker/BookSlot";
import EventBooking from "./pages/seeker/EventBooking";
import ManageAvailability from "./pages/host/ManageAvailability";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRefunds from "./pages/admin/AdminRefunds";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminListings from "./pages/admin/AdminListings";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminBookForSeeker from "./pages/admin/AdminBookForSeeker";
import AdminCreateSlot from "./pages/admin/AdminCreateSlot";
import AdminPayouts from "./pages/admin/AdminPayouts";

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
            <Route path="/signup" element={<Signup />} />
            <Route path="/find-parking" element={<FindParking />} />
            <Route path="/events" element={<Events />} />
            <Route path="/list-driveway" element={<ListDriveway />} />
            <Route path="/areas" element={<AreasWeServe />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/my-uploads" element={<MyUploads />} />
            <Route path="/book-slot/:spotId" element={<BookSlot />} />
            <Route path="/event-booking/:eventId" element={<EventBooking />} />
            <Route path="/manage-availability/:listingId" element={<ManageAvailability />} />
            
            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-manage-hosts" element={<AdminUsers />} />
            <Route path="/admin-manage-seekers" element={<AdminUsers />} />
            <Route path="/admin-manage-listings" element={<AdminListings />} />
            <Route path="/admin-manage-events" element={<AdminEvents />} />
            <Route path="/admin-book-for-seeker" element={<AdminBookForSeeker />} />
            <Route path="/admin-create-slot-host" element={<AdminCreateSlot />} />
            <Route path="/admin-refunds" element={<AdminRefunds />} />
            <Route path="/admin-payouts" element={<AdminPayouts />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


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
import AdminRefunds from "./pages/admin/AdminRefunds";

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
            <Route path="/admin/refunds" element={<AdminRefunds />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

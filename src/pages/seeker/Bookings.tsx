
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

const mockBookings = [
  {
    id: 'PD001',
    spotName: 'Downtown Driveway - Sarah\'s Place',
    address: '123 Main St, Downtown LA',
    date: '2024-03-15',
    time: '9:00 AM - 11:00 AM',
    amount: 27,
    status: 'upcoming',
    bookingDate: '2024-03-10',
  },
  {
    id: 'PD002',
    spotName: 'City Center Parking',
    address: '456 Business Ave',
    date: '2024-03-08',
    time: '2:00 PM - 4:00 PM',
    amount: 33,
    status: 'completed',
    bookingDate: '2024-03-05',
  },
  {
    id: 'PD003',
    spotName: 'Residential Driveway',
    address: '789 Oak Street',
    date: '2024-02-28',
    time: '10:00 AM - 12:00 PM',
    amount: 19,
    status: 'completed',
    bookingDate: '2024-02-25',
  },
  {
    id: 'PD004',
    spotName: 'Secure Garage Space',
    address: '321 Pine Road',
    date: '2024-02-20',
    time: '6:00 PM - 8:00 PM',
    amount: 42,
    status: 'completed',
    bookingDate: '2024-02-18',
  },
];

const Bookings = () => {
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewReceipt = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setShowReceipt(true);
  };

  const upcomingBookings = mockBookings.filter(b => b.status === 'upcoming');
  const pastBookings = mockBookings.filter(b => b.status === 'completed');

  return (
    <Layout title="My Bookings">
      <div className="space-y-8 animate-fade-in">
        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="card-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-lg">{booking.spotName}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-text-secondary">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {booking.address}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-text-secondary">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {booking.date} • {booking.time}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ${booking.amount}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">
                          Booking ID: {booking.id}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline"
                          onClick={() => handleViewReceipt(booking)}
                        >
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Bookings */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Booking History</h2>
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <Card key={booking.id} className="card-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{booking.spotName}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-text-secondary">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {booking.address}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-text-secondary">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {booking.date} • {booking.time}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${booking.amount}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        Booking ID: {booking.id}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        onClick={() => handleViewReceipt(booking)}
                      >
                        View Receipt
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {mockBookings.length === 0 && (
          <Card className="card-shadow">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-text-secondary mb-6">
                Start exploring parking spots to make your first booking.
              </p>
              <Button className="btn-primary">
                Find Parking
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Receipt Modal */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Receipt</DialogTitle>
            <DialogDescription>
              Booking ID: {selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Parking Spot:</span>
                  <span>{selectedBooking.spotName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Location:</span>
                  <span className="text-right">{selectedBooking.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date & Time:</span>
                  <span>{selectedBooking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>{selectedBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Booked On:</span>
                  <span>{selectedBooking.bookingDate}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Paid:</span>
                  <span className="text-primary">${selectedBooking.amount}</span>
                </div>
              </div>
              
              <div className="text-center">
                <Badge className={getStatusColor(selectedBooking.status)}>
                  {selectedBooking.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Bookings;

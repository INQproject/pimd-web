
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Car, AlertTriangle } from 'lucide-react';

const MyBookings = () => {
  const [bookings] = useState([
    {
      id: 'B001',
      spotName: 'Downtown Driveway - Sarah\'s Place',
      address: '123 Main St, Downtown LA',
      date: '2024-06-15',
      timeSlot: '9:00 AM - 11:00 AM',
      vehicleNumber: 'ABC-123',
      status: 'confirmed',
      isFuture: true
    },
    {
      id: 'B002',
      spotName: 'City Center Parking',
      address: '456 Business Ave',
      date: '2024-06-20',
      timeSlot: '2:00 PM - 4:00 PM',
      vehicleNumber: 'XYZ-789',
      status: 'confirmed',
      isFuture: true
    },
    {
      id: 'B003',
      spotName: 'Residential Driveway',
      address: '789 Oak Street',
      date: '2024-05-28',
      timeSlot: '10:00 AM - 12:00 PM',
      vehicleNumber: 'DEF-456',
      status: 'completed',
      isFuture: false
    },
    {
      id: 'B004',
      spotName: 'Secure Garage Space',
      address: '321 Pine Road',
      date: '2024-05-20',
      timeSlot: '6:00 PM - 8:00 PM',
      vehicleNumber: 'GHI-789',
      status: 'completed',
      isFuture: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    // Handle booking cancellation
    console.log('Cancelling booking:', bookingId);
  };

  const upcomingBookings = bookings.filter(b => b.isFuture);
  const pastBookings = bookings.filter(b => !b.isFuture);

  return (
    <Layout title="My Bookings">
      <div className="space-y-8">
        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Bookings
            </h2>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-lg">{booking.spotName}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {booking.address}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {booking.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {booking.timeSlot}
                          </div>
                          <div className="flex items-center">
                            <Car className="w-4 h-4 mr-2" />
                            {booking.vehicleNumber}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex items-center"
                        >
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Cancel
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
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{booking.spotName}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {booking.address}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {booking.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {booking.timeSlot}
                        </div>
                        <div className="flex items-center">
                          <Car className="w-4 h-4 mr-2" />
                          {booking.vehicleNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {bookings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">
                Start exploring parking spots to make your first booking.
              </p>
              <Button 
                onClick={() => window.location.href = '/find-parking'}
                className="bg-[#FF6B00] hover:bg-[#FF6B00]/90"
              >
                Find Parking
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;

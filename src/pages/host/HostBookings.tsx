
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HostBookings = () => {
  const bookings = [
    {
      id: 'B001',
      date: '2024-01-15',
      time: '9:00 AM - 11:00 AM',
      seekerName: 'John Doe',
      spot: 'Downtown Driveway - Slot A',
      amount: '$25.00',
      status: 'completed'
    },
    {
      id: 'B002',
      date: '2024-01-16',
      time: '2:00 PM - 6:00 PM',
      seekerName: 'Jane Smith',
      spot: 'Downtown Driveway - Slot B',
      amount: '$50.00',
      status: 'upcoming'
    },
    {
      id: 'B003',
      date: '2024-01-12',
      time: '10:00 AM - 12:00 PM',
      seekerName: 'Mike Johnson',
      spot: 'Main Street Parking',
      amount: '$20.00',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Booking History">
      <Card>
        <CardHeader>
          <CardTitle>All Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold">#{booking.id}</span>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Seeker:</span> {booking.seekerName}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Spot:</span> {booking.spot}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Date & Time:</span> {booking.date} | {booking.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{booking.amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default HostBookings;

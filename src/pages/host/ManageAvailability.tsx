
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { mockParkingSpots } from '@/data/mockParkingData';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface TimeSlot {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

interface Booking {
  id: number;
  timeSlotId: string;
  status: 'booked' | 'available';
  startTime: string;
}

const ManageAvailability = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [newTimeSlotName, setNewTimeSlotName] = useState('');
  const [newTimeSlotStart, setNewTimeSlotStart] = useState('');
  const [newTimeSlotEnd, setNewTimeSlotEnd] = useState('');

  useEffect(() => {
    // Mock data for time slots and bookings
    const mockTimeSlots: TimeSlot[] = [
      { id: 1, name: 'Morning', startTime: '8:00 AM', endTime: '12:00 PM' },
      { id: 2, name: 'Afternoon', startTime: '1:00 PM', endTime: '5:00 PM' },
      { id: 3, name: 'Evening', startTime: '6:00 PM', endTime: '10:00 PM' },
    ];
    setTimeSlots(mockTimeSlots);

    const mockBookings: Booking[] = [
      { id: 1, timeSlotId: '1', status: 'booked', startTime: '2024-06-15' },
      { id: 2, timeSlotId: '2', status: 'available', startTime: '2024-06-16' },
      { id: 3, timeSlotId: '3', status: 'booked', startTime: '2024-06-17' },
    ];
    setBookings(mockBookings);
  }, []);

  const handleAddTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: timeSlots.length + 1,
      name: newTimeSlotName,
      startTime: newTimeSlotStart,
      endTime: newTimeSlotEnd,
    };
    setTimeSlots([...timeSlots, newSlot]);
    setNewTimeSlotName('');
    setNewTimeSlotStart('');
    setNewTimeSlotEnd('');
    toast({
      title: "Time slot added",
      description: "New time slot has been added successfully",
    });
  };

  const handleCancelBooking = (bookingId: number) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: 'available' } : booking
    ));
    toast({
      title: "Booking cancelled",
      description: "The booking has been cancelled and is now available",
    });
  };

  const renderBookings = () => {
    return timeSlots.map(timeSlot => {
      return (
        <div key={timeSlot.id} className="mb-6">
          <h3 className="text-xl font-semibold mb-3">{timeSlot.name}</h3>
          {bookings.length === 0 ? (
            <div className="text-gray-500">No bookings available for this time slot.</div>
          ) : (
            <div className="space-y-3">
              {bookings.filter(booking => booking.timeSlotId === timeSlot.id.toString()).map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 rounded-md shadow-sm border">
                  <div className="space-y-1">
                    <div className="font-medium">Booking Date: {booking.startTime}</div>
                    {booking.startTime && (
                      <div className="text-xs text-gray-600">
                        {timeSlots.find(ts => ts.id.toString() === booking.timeSlotId)?.name || 'Unknown Slot'}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={booking.status === 'booked' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {booking.status}
                    </Badge>
                    {booking.status === 'booked' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="h-6 px-2 text-xs"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  const spot = mockParkingSpots.find(s => s.id.toString() === listingId);

  if (!spot) {
    navigate('/find-parking');
    return null;
  }

  if (!user) {
    navigate('/login', {
      state: {
        returnTo: `/manage-availability/${listingId}`,
        context: 'manage-availability'
      }
    });
    return null;
  }

  return (
    <Layout title="Manage Availability" showBackButton={true}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Time Slot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="timeSlotName">Time Slot Name</Label>
                <Input
                  id="timeSlotName"
                  type="text"
                  value={newTimeSlotName}
                  onChange={(e) => setNewTimeSlotName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newTimeSlotStart}
                  onChange={(e) => setNewTimeSlotStart(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newTimeSlotEnd}
                  onChange={(e) => setNewTimeSlotEnd(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleAddTimeSlot}>Add Time Slot</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {renderBookings()}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ManageAvailability;

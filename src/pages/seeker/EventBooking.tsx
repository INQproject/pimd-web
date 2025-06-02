
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Car, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mockParkingSpots = [
  {
    id: 1,
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    distance: '0.2 miles from event',
    price: 15,
    slots: [
      { id: 1, name: 'Slot 1', timeRange: '9:00 AM - 11:00 AM', capacity: 2, available: 2 },
      { id: 2, name: 'Slot 2', timeRange: '12:00 PM - 2:00 PM', capacity: 1, available: 1 }
    ]
  },
  {
    id: 2,
    name: 'Safe Street Parking',
    address: '456 Oak St, Austin, TX',
    distance: '0.4 miles from event',
    price: 12,
    slots: [
      { id: 3, name: 'Slot A', timeRange: '10:00 AM - 1:00 PM', capacity: 3, available: 3 },
      { id: 4, name: 'Slot B', timeRange: '2:00 PM - 6:00 PM', capacity: 2, available: 1 }
    ]
  }
];

const EventBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const event = location.state?.event;

  const [vehicleCount, setVehicleCount] = useState('1');
  const [vehicleBookings, setVehicleBookings] = useState([
    { spotId: '', slotId: '', startTime: '', endTime: '', price: 0 }
  ]);

  if (!event) {
    navigate('/events');
    return null;
  }

  if (!user) {
    navigate('/login', { state: { returnTo: `/event-booking/${event.id}`, context: 'booking' } });
    return null;
  }

  const handleVehicleCountChange = (count: string) => {
    setVehicleCount(count);
    const newBookings = Array(parseInt(count)).fill(null).map(() => ({
      spotId: '',
      slotId: '',
      startTime: '',
      endTime: '',
      price: 0
    }));
    setVehicleBookings(newBookings);
  };

  const updateVehicleBooking = (index: number, field: string, value: string) => {
    const newBookings = [...vehicleBookings];
    newBookings[index] = { ...newBookings[index], [field]: value };
    
    // Calculate price if we have both times and spot
    if ((field === 'endTime' || field === 'startTime') && newBookings[index].spotId) {
      const booking = newBookings[index];
      const spot = mockParkingSpots.find(s => s.id.toString() === booking.spotId);
      if (booking.startTime && booking.endTime && spot) {
        const start = new Date(`2024-01-01 ${booking.startTime}`);
        const end = new Date(`2024-01-01 ${booking.endTime}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        newBookings[index].price = Math.max(hours * spot.price, 0);
      }
    }
    
    setVehicleBookings(newBookings);
  };

  const getSpotById = (spotId: string) => {
    return mockParkingSpots.find(spot => spot.id.toString() === spotId);
  };

  const getSlotById = (spotId: string, slotId: string) => {
    const spot = getSpotById(spotId);
    return spot?.slots.find(slot => slot.id.toString() === slotId);
  };

  const handleProceedToPayment = () => {
    const totalPrice = vehicleBookings.reduce((sum, booking) => sum + booking.price, 0);
    
    // Create booking summary
    const summary = vehicleBookings.map((booking, index) => {
      const spot = getSpotById(booking.spotId);
      const slot = getSlotById(booking.spotId, booking.slotId);
      return {
        car: index + 1,
        spot: spot?.name || 'Unknown',
        slot: slot?.name || 'Unknown',
        time: `${booking.startTime} - ${booking.endTime}`,
        price: booking.price
      };
    });

    toast({
      title: "Event Parking Booked!",
      description: `Total: $${totalPrice.toFixed(2)} for ${vehicleCount} vehicle(s) at ${event.name}`,
    });

    // In a real app, this would navigate to payment/confirmation
    navigate('/profile');
  };

  const timeOptions = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  return (
    <Layout title={`Parking for ${event.name}`} showBackButton={true}>
      <div className="space-y-8">
        {/* Event Info */}
        <Card className="bg-gradient-to-r from-[#FF6B00]/10 to-[#002F5F]/10 border-none">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <img 
                src={event.image} 
                alt={event.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-[#1C1C1C]">{event.name}</h2>
                <div className="flex items-center space-x-4 text-[#606060] mt-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Parking Spots */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#1C1C1C]">Available Parking Near Event</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {mockParkingSpots.map((spot) => (
              <Card key={spot.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg">{spot.name}</h3>
                      <div className="flex items-center space-x-2 text-[#606060] mt-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{spot.address}</span>
                      </div>
                      <p className="text-sm text-[#FF6B00] font-medium">{spot.distance}</p>
                    </div>
                    <span className="bg-[#FF6B00] text-white px-2 py-1 rounded text-sm font-semibold">
                      ${spot.price}/hr
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Available Slots:</p>
                    {spot.slots.map((slot) => (
                      <div key={slot.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{slot.name}</span>
                          <div className="flex items-center space-x-1 text-sm text-[#606060]">
                            <Clock className="w-3 h-3" />
                            <span>{slot.timeRange}</span>
                          </div>
                        </div>
                        <span className="text-sm text-green-600">
                          {slot.available}/{slot.capacity} available
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Vehicle Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Book Your Parking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vehicle Count */}
            <div className="space-y-2">
              <Label>How many vehicles are you booking for?</Label>
              <Select value={vehicleCount} onValueChange={handleVehicleCountChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} vehicle{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Assignments */}
            {vehicleBookings.map((booking, index) => (
              <Card key={index} className="p-4 bg-gray-50">
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Car className="w-4 h-4" />
                  <span>Car {index + 1}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div>
                    <Label>Parking Spot</Label>
                    <Select 
                      value={booking.spotId} 
                      onValueChange={(value) => updateVehicleBooking(index, 'spotId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select spot" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockParkingSpots.map((spot) => (
                          <SelectItem key={spot.id} value={spot.id.toString()}>
                            {spot.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Slot</Label>
                    <Select 
                      value={booking.slotId} 
                      onValueChange={(value) => updateVehicleBooking(index, 'slotId', value)}
                      disabled={!booking.spotId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {booking.spotId && getSpotById(booking.spotId)?.slots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id.toString()}>
                            {slot.name} ({slot.timeRange})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Start Time</Label>
                    <Select 
                      value={booking.startTime} 
                      onValueChange={(value) => updateVehicleBooking(index, 'startTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Start" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>End Time</Label>
                    <Select 
                      value={booking.endTime} 
                      onValueChange={(value) => updateVehicleBooking(index, 'endTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="End" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Price</Label>
                    <div className="p-2 bg-white border rounded text-center font-semibold">
                      ${booking.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Booking Summary */}
            <Card className="bg-[#F9FAFB] border-[#FF6B00]">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {vehicleBookings.map((booking, index) => {
                  const spot = getSpotById(booking.spotId);
                  const slot = getSlotById(booking.spotId, booking.slotId);
                  return (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div className="text-sm">
                        <span className="font-medium">Car {index + 1}</span>
                        {spot && slot && (
                          <span className="text-[#606060]">
                            {' → '}{spot.name} → {slot.name} ({booking.startTime} - {booking.endTime})
                          </span>
                        )}
                      </div>
                      <span className="font-semibold">${booking.price.toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-[#FF6B00]">
                    ${vehicleBookings.reduce((sum, b) => sum + b.price, 0).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleProceedToPayment}
              className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-lg py-3"
              disabled={vehicleBookings.some(b => !b.spotId || !b.slotId || !b.startTime || !b.endTime)}
            >
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EventBooking;

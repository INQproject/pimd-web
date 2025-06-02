
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Car } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mockParkingSpots = [
  {
    id: 1,
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    price: 15,
    city: 'austin',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400',
    slots: [
      { id: 1, name: 'Slot A', timeRange: '8:00 AM - 12:00 PM', capacity: 2, startTime: '8:00 AM', endTime: '12:00 PM' },
      { id: 2, name: 'Slot B', timeRange: '1:00 PM - 6:00 PM', capacity: 1, startTime: '1:00 PM', endTime: '6:00 PM' }
    ]
  },
  {
    id: 2,
    name: 'Deep Ellum Private Spot',
    address: '456 Elm St, Dallas, TX',
    price: 12,
    city: 'dallas',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400',
    slots: [
      { id: 3, name: 'Slot A', timeRange: '9:00 AM - 2:00 PM', capacity: 3, startTime: '9:00 AM', endTime: '2:00 PM' },
      { id: 4, name: 'Slot B', timeRange: '3:00 PM - 8:00 PM', capacity: 2, startTime: '3:00 PM', endTime: '8:00 PM' }
    ]
  }
];

const allTimeOptions = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
];

const BookSlot = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [vehicleCount, setVehicleCount] = useState('1');
  const [vehicleBookings, setVehicleBookings] = useState([
    { slotId: '', startTime: '', endTime: '', price: 0 }
  ]);

  const spot = mockParkingSpots.find(s => s.id.toString() === spotId);

  if (!spot) {
    navigate('/find-parking');
    return null;
  }

  if (!user) {
    navigate('/login', { state: { returnTo: `/book-slot/${spotId}`, context: 'booking' } });
    return null;
  }

  const handleVehicleCountChange = (count: string) => {
    setVehicleCount(count);
    const newBookings = Array(parseInt(count)).fill(null).map(() => ({
      slotId: '',
      startTime: '',
      endTime: '',
      price: 0
    }));
    setVehicleBookings(newBookings);
  };

  const getSlotById = (slotId: string) => {
    return spot.slots.find(slot => slot.id.toString() === slotId);
  };

  const getAvailableStartTimes = (slotId: string) => {
    const slot = getSlotById(slotId);
    if (!slot) return [];
    
    const slotStartIndex = allTimeOptions.indexOf(slot.startTime);
    const slotEndIndex = allTimeOptions.indexOf(slot.endTime);
    
    return allTimeOptions.slice(slotStartIndex, slotEndIndex);
  };

  const getAvailableEndTimes = (slotId: string, startTime: string) => {
    const slot = getSlotById(slotId);
    if (!slot || !startTime) return [];
    
    const startIndex = allTimeOptions.indexOf(startTime);
    const slotEndIndex = allTimeOptions.indexOf(slot.endTime);
    
    return allTimeOptions.slice(startIndex + 1, slotEndIndex + 1);
  };

  const updateVehicleBooking = (index: number, field: string, value: string) => {
    const newBookings = [...vehicleBookings];
    newBookings[index] = { ...newBookings[index], [field]: value };
    
    // Reset end time if start time changes
    if (field === 'startTime') {
      newBookings[index].endTime = '';
      newBookings[index].price = 0;
    }
    
    // Reset start and end times if slot changes
    if (field === 'slotId') {
      newBookings[index].startTime = '';
      newBookings[index].endTime = '';
      newBookings[index].price = 0;
    }
    
    // Calculate price if we have both times
    if (field === 'endTime' || (field === 'startTime' && newBookings[index].endTime)) {
      const booking = newBookings[index];
      if (booking.startTime && booking.endTime) {
        const startIndex = allTimeOptions.indexOf(booking.startTime);
        const endIndex = allTimeOptions.indexOf(booking.endTime);
        const hours = endIndex - startIndex;
        newBookings[index].price = Math.max(hours * spot.price, 0);
      }
    }
    
    setVehicleBookings(newBookings);
  };

  const handleProceedToPayment = () => {
    const totalPrice = vehicleBookings.reduce((sum, booking) => sum + booking.price, 0);
    
    toast({
      title: "Booking Confirmed",
      description: `Total: $${totalPrice.toFixed(2)} for ${vehicleCount} vehicle(s) at ${spot.name}`,
    });
    
    navigate('/profile');
  };

  const isBookingValid = vehicleBookings.every(booking => 
    booking.slotId && booking.startTime && booking.endTime && booking.price > 0
  );

  return (
    <Layout title={`Book Parking at ${spot.name}`} showBackButton={true}>
      <div className="space-y-8">
        {/* Spot Details */}
        <Card>
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <img 
              src={spot.image} 
              alt={spot.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold text-[#FF6B00]">
                ${spot.price}/hr
              </span>
            </div>
          </div>
          
          <CardHeader>
            <CardTitle className="text-xl">{spot.name}</CardTitle>
            <div className="flex items-center space-x-2 text-[#606060]">
              <MapPin className="w-4 h-4" />
              <span>{spot.address}</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">Available Slots:</p>
              {spot.slots.map(slot => (
                <div key={slot.id} className="text-sm text-[#606060] bg-gray-50 p-2 rounded">
                  {slot.name}: {slot.timeRange} (Capacity: {slot.capacity})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                  <span>Vehicle {index + 1}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <Label>Select Slot</Label>
                    <Select 
                      value={booking.slotId} 
                      onValueChange={(value) => updateVehicleBooking(index, 'slotId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {spot.slots.map((slot) => (
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
                      disabled={!booking.slotId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Start" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableStartTimes(booking.slotId).map(time => (
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
                      disabled={!booking.startTime}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="End" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableEndTimes(booking.slotId, booking.startTime).map(time => (
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
                  const slot = getSlotById(booking.slotId);
                  return (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div className="text-sm">
                        <span className="font-medium">Vehicle {index + 1}</span>
                        {slot && booking.startTime && booking.endTime && (
                          <span className="text-[#606060]">
                            {' → '}{slot.name} ({booking.startTime} - {booking.endTime})
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
              disabled={!isBookingValid}
            >
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BookSlot;

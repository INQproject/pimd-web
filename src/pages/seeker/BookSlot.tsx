
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Car, Shield, Sun, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mockParkingSpots = [
  {
    id: 1,
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    price: 15,
    city: 'austin',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400',
    description: 'Secure private driveway in the heart of downtown Austin. Perfect for business meetings and shopping.',
    amenities: ['CCTV', 'Well-lit', '24/7 Access'],
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
    description: 'Private parking spot in trendy Deep Ellum district. Walking distance to restaurants and nightlife.',
    amenities: ['CCTV', 'Covered'],
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
    
    if (field === 'startTime') {
      newBookings[index].endTime = '';
      newBookings[index].price = 0;
    }
    
    if (field === 'slotId') {
      newBookings[index].startTime = '';
      newBookings[index].endTime = '';
      newBookings[index].price = 0;
    }
    
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

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'cctv': return <Shield className="w-3 h-3" />;
      case 'well-lit': return <Sun className="w-3 h-3" />;
      case '24/7 access': return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <Layout title={`Book Parking at ${spot.name}`} showBackButton={true}>
      <div className="space-y-4">
        {/* Compact Header Section */}
        <div className="max-w-2xl mx-auto">
          {/* Hero Image - Compact */}
          <div className="relative mb-4">
            <div className="aspect-video max-w-lg mx-auto relative overflow-hidden rounded-lg border shadow-sm">
              <img 
                src={spot.image} 
                alt={spot.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-[#FF6B00] text-white px-2 py-1 rounded-full text-xs font-semibold">
                  ${spot.price}/hr
                </span>
              </div>
            </div>
          </div>

          {/* Spot Info Card - Compact */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h1 className="text-lg font-semibold text-[#1C1C1C]">{spot.name}</h1>
                  <div className="flex items-center space-x-1 text-[#606060] text-sm">
                    <MapPin className="w-3 h-3" />
                    <span>{spot.address}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-[#606060] mb-3">{spot.description}</p>
              
              {/* Amenities - Compact */}
              <div className="flex flex-wrap gap-1 mb-3">
                {spot.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs flex items-center space-x-1 px-2 py-0.5">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </Badge>
                ))}
              </div>

              {/* Available Slots - Compact */}
              <div className="text-sm">
                <span className="font-medium text-[#1C1C1C]">Available: </span>
                {spot.slots.map((slot, index) => (
                  <span key={slot.id} className="text-[#606060]">
                    {slot.name} ({slot.timeRange})
                    {index < spot.slots.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid - Compact */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Select Your Parking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Vehicle Count - Compact */}
                <div>
                  <Label className="text-sm font-medium">Number of vehicles</Label>
                  <Select value={vehicleCount} onValueChange={handleVehicleCountChange}>
                    <SelectTrigger className="w-40 h-8 mt-1">
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

                {/* Vehicle Assignments - Compact */}
                {vehicleBookings.map((booking, index) => (
                  <Card key={index} className="p-3 bg-gray-50 border-gray-200">
                    <h4 className="font-medium mb-2 flex items-center space-x-2 text-sm">
                      <Car className="w-3 h-3" />
                      <span>Vehicle {index + 1}</span>
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      <div>
                        <Label className="text-xs">Time Slot</Label>
                        <Select 
                          value={booking.slotId} 
                          onValueChange={(value) => updateVehicleBooking(index, 'slotId', value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Choose" />
                          </SelectTrigger>
                          <SelectContent>
                            {spot.slots.map((slot) => (
                              <SelectItem key={slot.id} value={slot.id.toString()}>
                                {slot.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Start</Label>
                        <Select 
                          value={booking.startTime} 
                          onValueChange={(value) => updateVehicleBooking(index, 'startTime', value)}
                          disabled={!booking.slotId}
                        >
                          <SelectTrigger className="h-8 text-xs">
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
                        <Label className="text-xs">End</Label>
                        <Select 
                          value={booking.endTime} 
                          onValueChange={(value) => updateVehicleBooking(index, 'endTime', value)}
                          disabled={!booking.startTime}
                        >
                          <SelectTrigger className="h-8 text-xs">
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
                        <Label className="text-xs">Price</Label>
                        <div className="h-8 p-1 bg-white border rounded-md text-center font-semibold text-xs flex items-center justify-center">
                          ${booking.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Compact Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card className="bg-[#F9FAFB] border-[#FF6B00]/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {vehicleBookings.map((booking, index) => {
                    const slot = getSlotById(booking.slotId);
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-start">
                          <div className="text-sm">
                            <span className="font-medium">Vehicle {index + 1}</span>
                            {slot && booking.startTime && booking.endTime && (
                              <div className="text-xs text-[#606060]">
                                {slot.name}: {booking.startTime} - {booking.endTime}
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-sm">${booking.price.toFixed(2)}</span>
                        </div>
                        {index < vehicleBookings.length - 1 && <Separator className="my-1" />}
                      </div>
                    );
                  })}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-[#FF6B00]">
                      ${vehicleBookings.reduce((sum, b) => sum + b.price, 0).toFixed(2)}
                    </span>
                  </div>

                  <Button 
                    onClick={handleProceedToPayment}
                    className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white h-10 mt-3"
                    disabled={!isBookingValid}
                  >
                    Proceed to Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookSlot;

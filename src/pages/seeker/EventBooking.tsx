
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Car, Clock, Circle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mockParkingSpots = [
  {
    id: 1,
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    distance: '0.2 miles from event',
    price: 15,
    coordinates: { lat: 30.2672, lng: -97.7431 },
    slots: [
      { id: 1, name: 'Slot 1', timeRange: '9:00 AM - 11:00 AM', capacity: 2, available: 2, startTime: '9:00 AM', endTime: '11:00 AM' },
      { id: 2, name: 'Slot 2', timeRange: '12:00 PM - 2:00 PM', capacity: 1, available: 1, startTime: '12:00 PM', endTime: '2:00 PM' }
    ]
  },
  {
    id: 2,
    name: 'Safe Street Parking',
    address: '456 Oak St, Austin, TX',
    distance: '0.4 miles from event',
    price: 12,
    coordinates: { lat: 30.2700, lng: -97.7400 },
    slots: [
      { id: 3, name: 'Slot A', timeRange: '10:00 AM - 1:00 PM', capacity: 3, available: 3, startTime: '10:00 AM', endTime: '1:00 PM' },
      { id: 4, name: 'Slot B', timeRange: '2:00 PM - 6:00 PM', capacity: 2, available: 1, startTime: '2:00 PM', endTime: '6:00 PM' }
    ]
  }
];

const allTimeOptions = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
];

const EventBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const event = location.state?.event;
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);

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

  const getSpotById = (spotId: string) => {
    return mockParkingSpots.find(spot => spot.id.toString() === spotId);
  };

  const getSlotById = (spotId: string, slotId: string) => {
    const spot = getSpotById(spotId);
    return spot?.slots.find(slot => slot.id.toString() === slotId);
  };

  const getAvailableStartTimes = (spotId: string, slotId: string) => {
    const slot = getSlotById(spotId, slotId);
    if (!slot) return [];
    
    const slotStartIndex = allTimeOptions.indexOf(slot.startTime);
    const slotEndIndex = allTimeOptions.indexOf(slot.endTime);
    
    return allTimeOptions.slice(slotStartIndex, slotEndIndex);
  };

  const getAvailableEndTimes = (spotId: string, slotId: string, startTime: string) => {
    const slot = getSlotById(spotId, slotId);
    if (!slot || !startTime) return [];
    
    const startIndex = allTimeOptions.indexOf(startTime);
    const slotEndIndex = allTimeOptions.indexOf(slot.endTime);
    
    return allTimeOptions.slice(startIndex + 1, slotEndIndex + 1);
  };

  const updateVehicleBooking = (index: number, field: string, value: string) => {
    const newBookings = [...vehicleBookings];
    newBookings[index] = { ...newBookings[index], [field]: value };
    
    // Reset slot, start and end times if spot changes
    if (field === 'spotId') {
      newBookings[index].slotId = '';
      newBookings[index].startTime = '';
      newBookings[index].endTime = '';
      newBookings[index].price = 0;
    }
    
    // Reset start and end times if slot changes
    if (field === 'slotId') {
      newBookings[index].startTime = '';
      newBookings[index].endTime = '';
      newBookings[index].price = 0;
    }
    
    // Reset end time if start time changes
    if (field === 'startTime') {
      newBookings[index].endTime = '';
      newBookings[index].price = 0;
    }
    
    // Calculate price if we have both times and spot
    if ((field === 'endTime' || field === 'startTime') && newBookings[index].spotId) {
      const booking = newBookings[index];
      const spot = getSpotById(booking.spotId);
      if (booking.startTime && booking.endTime && spot) {
        const startIndex = allTimeOptions.indexOf(booking.startTime);
        const endIndex = allTimeOptions.indexOf(booking.endTime);
        const hours = endIndex - startIndex;
        newBookings[index].price = Math.max(hours * spot.price, 0);
      }
    }
    
    setVehicleBookings(newBookings);
  };

  const handleBookSpot = (spotId: number) => {
    navigate(`/book-slot/${spotId}`, { 
      state: { 
        returnTo: `/event-booking/${event.id}`,
        event: event 
      } 
    });
  };

  const handleProceedToPayment = () => {
    const totalPrice = vehicleBookings.reduce((sum, booking) => sum + booking.price, 0);
    
    toast({
      title: "Event Parking Booked!",
      description: `Total: $${totalPrice.toFixed(2)} for ${vehicleCount} vehicle(s) at ${event.name}`,
    });

    navigate('/profile');
  };

  const isBookingValid = vehicleBookings.every(booking => 
    booking.spotId && booking.slotId && booking.startTime && booking.endTime && booking.price > 0
  );

  return (
    <Layout title={`Parking for ${event.name}`} showBackButton={true}>
      <div className="space-y-6">
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

        {/* Map-Style Parking Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1C1C1C]">Available Parking Near Event</h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Static Map with Pins */}
            <div className="relative">
              <div 
                className="h-96 bg-cover bg-center rounded-lg relative border shadow-sm"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop')"
                }}
              >
                {/* Map overlay */}
                <div className="absolute inset-0 bg-blue-50/30 rounded-lg"></div>
                
                {/* Parking Pins */}
                {mockParkingSpots.map((spot, index) => (
                  <div
                    key={spot.id}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-full transition-all duration-200 hover:scale-110 ${
                      selectedSpot === spot.id ? 'scale-110 z-20' : 'z-10'
                    }`}
                    style={{
                      left: `${30 + index * 25}%`,
                      top: `${40 + index * 15}%`
                    }}
                    onClick={() => setSelectedSpot(selectedSpot === spot.id ? null : spot.id)}
                  >
                    {/* Pin */}
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white ${
                        selectedSpot === spot.id ? 'bg-[#FF6B00] scale-125' : 'bg-[#FF6B00]'
                      }`}>
                        ${spot.price}
                      </div>
                      <div className={`w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent mx-auto ${
                        selectedSpot === spot.id ? 'border-t-[#FF6B00]' : 'border-t-[#FF6B00]'
                      }`}></div>
                    </div>
                    
                    {/* Tooltip */}
                    {selectedSpot === spot.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white p-3 rounded-lg shadow-lg border min-w-48 z-30">
                        <div className="text-sm">
                          <p className="font-semibold text-[#1C1C1C]">{spot.name}</p>
                          <p className="text-[#606060] text-xs">{spot.distance}</p>
                          <p className="text-[#FF6B00] font-bold">${spot.price}/hr</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Event Location Marker */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-full"
                  style={{ left: '50%', top: '30%' }}
                >
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="w-0 h-0 border-l-3 border-r-3 border-t-6 border-transparent border-t-red-500 mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Spot Details */}
            <div className="space-y-4">
              {selectedSpot ? (
                // Selected spot details
                (() => {
                  const spot = mockParkingSpots.find(s => s.id === selectedSpot);
                  if (!spot) return null;
                  
                  return (
                    <Card className="border-[#FF6B00]/30 shadow-lg">
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
                          <span className="bg-[#FF6B00] text-white px-3 py-1 rounded-lg text-sm font-semibold">
                            ${spot.price}/hr
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="font-medium text-sm mb-2">Available Slots:</p>
                          {spot.slots.map((slot) => (
                            <div key={slot.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <span className="font-medium">{slot.name}</span>
                                <div className="flex items-center space-x-1 text-sm text-[#606060]">
                                  <Clock className="w-3 h-3" />
                                  <span>{slot.timeRange}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm text-green-600 font-medium">
                                  {slot.available}/{slot.capacity} available
                                </span>
                              </div>
                            </div>
                          ))}
                          
                          <Button 
                            onClick={() => handleBookSpot(spot.id)}
                            className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white mt-4"
                          >
                            Book This Spot
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()
              ) : (
                // Default instruction
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="p-8 text-center">
                    <Circle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Parking Spot</h3>
                    <p className="text-gray-500">
                      Click on any orange pin on the map to view parking details and book your spot.
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {/* All spots list for quick reference */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-[#606060]">Quick List:</h4>
                {mockParkingSpots.map((spot) => (
                  <div 
                    key={spot.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedSpot === spot.id 
                        ? 'border-[#FF6B00] bg-[#FF6B00]/5' 
                        : 'border-gray-200 hover:border-[#FF6B00]/50'
                    }`}
                    onClick={() => setSelectedSpot(selectedSpot === spot.id ? null : spot.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{spot.name}</p>
                        <p className="text-xs text-[#606060]">{spot.distance}</p>
                      </div>
                      <span className="text-sm font-bold text-[#FF6B00]">${spot.price}/hr</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventBooking;

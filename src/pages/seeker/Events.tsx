import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Users, Car, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const mockEvents = [
  {
    id: 1,
    name: 'Austin City Limits Music Festival',
    date: 'Oct 6-8, 2024',
    time: '2:00 PM - 11:00 PM',
    location: 'Zilker Park, Austin',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500',
    description: 'Three days of amazing music featuring top artists from around the world.',
    city: 'austin'
  },
  {
    id: 2,
    name: 'Dallas Cowboys vs Giants',
    date: 'Nov 24, 2024',
    time: '7:30 PM',
    location: 'AT&T Stadium, Dallas',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=500',
    description: 'Don\'t miss this epic NFL showdown between two giants!',
    city: 'dallas'
  },
  {
    id: 3,
    name: 'South by Southwest (SXSW)',
    date: 'Mar 10-19, 2025',
    time: 'All Day',
    location: 'Downtown Austin',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500',
    description: 'The ultimate music, interactive, and film festival.',
    city: 'austin'
  },
  {
    id: 4,
    name: 'Dallas Art Fair',
    date: 'Apr 18-21, 2024',
    time: '10:00 AM - 7:00 PM',
    location: 'Fashion Industry Gallery, Dallas',
    category: 'Arts',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=500',
    description: 'Contemporary art from emerging and established artists.',
    city: 'dallas'
  },
  {
    id: 5,
    name: 'Austin Food & Wine Festival',
    date: 'May 1-3, 2024',
    time: '11:00 AM - 9:00 PM',
    location: 'Republic Square, Austin',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=500',
    description: 'Taste the finest cuisine from local chefs and wineries.',
    city: 'austin'
  },
  {
    id: 6,
    name: 'Dallas Marathon',
    date: 'Dec 8, 2024',
    time: '6:00 AM',
    location: 'Downtown Dallas',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500',
    description: 'Join thousands of runners in this scenic city marathon.',
    city: 'dallas'
  },
];

interface EventParkingSpot {
  id: number;
  name: string;
  address: string;
  distance: string;
  totalSlots: number;
  slots: {
    id: number;
    name: string;
    time: string;
    price: number;
    maxVehicles: number;
    available: boolean;
  }[];
}

interface VehicleBooking {
  id: number;
  spotId: number | null;
  spotName: string;
  slotId: number | null;
  slotName: string;
  slotTime: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
}

const mockEventParkingSpots: EventParkingSpot[] = [
  {
    id: 1,
    name: 'Downtown Event Parking',
    address: '150 Congress Ave, Austin, TX',
    distance: '0.2 miles from event',
    totalSlots: 3,
    slots: [
      { id: 1, name: 'Morning Slot', time: '8:00 AM - 12:00 PM', price: 20, maxVehicles: 4, available: true },
      { id: 2, name: 'Afternoon Slot', time: '12:00 PM - 6:00 PM', price: 25, maxVehicles: 3, available: true },
      { id: 3, name: 'Evening Slot', time: '6:00 PM - 11:00 PM', price: 30, maxVehicles: 2, available: true }
    ]
  },
  {
    id: 2,
    name: 'Event Center Driveway',
    address: '200 Zilker Dr, Austin, TX',
    distance: '0.1 miles from event',
    totalSlots: 2,
    slots: [
      { id: 4, name: 'All Day', time: '6:00 AM - 11:00 PM', price: 45, maxVehicles: 2, available: true },
      { id: 5, name: 'Event Hours', time: '1:00 PM - 11:00 PM', price: 35, maxVehicles: 3, available: true }
    ]
  },
  {
    id: 3,
    name: 'Festival Grounds Parking',
    address: '300 Barton Springs Rd, Austin, TX',
    distance: '0.3 miles from event',
    totalSlots: 4,
    slots: [
      { id: 6, name: 'Early Bird', time: '7:00 AM - 11:00 AM', price: 15, maxVehicles: 5, available: true },
      { id: 7, name: 'Mid Day', time: '11:00 AM - 3:00 PM', price: 20, maxVehicles: 4, available: true },
      { id: 8, name: 'Peak Hours', time: '3:00 PM - 8:00 PM', price: 30, maxVehicles: 3, available: true },
      { id: 9, name: 'Late Night', time: '8:00 PM - 1:00 AM', price: 25, maxVehicles: 2, available: true }
    ]
  }
];

const Events = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<'all' | 'austin' | 'dallas'>('all');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [expandedSpots, setExpandedSpots] = useState<number[]>([]);
  const [numVehicles, setNumVehicles] = useState(1);
  const [vehicles, setVehicles] = useState<VehicleBooking[]>([
    { id: 1, spotId: null, spotName: '', slotId: null, slotName: '', slotTime: '', startTime: '', endTime: '', duration: 0, price: 0 }
  ]);
  const [showBookingSummary, setShowBookingSummary] = useState(false);

  const filteredEvents = selectedCity === 'all' 
    ? mockEvents 
    : mockEvents.filter(event => event.city === selectedCity);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Sports': 'bg-blue-100 text-blue-800',
      'Music': 'bg-purple-100 text-purple-800',
      'Business': 'bg-green-100 text-green-800',
      'Food': 'bg-orange-100 text-orange-800',
      'Arts': 'bg-pink-100 text-pink-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDurationLabel = (hours: string) => {
    const durationMap: { [key: string]: string } = {
      '0.5': '30 minutes',
      '1': '1 hour',
      '2': '2 hours',
      '3': '3 hours',
      '4': '4 hours',
      '8': 'Full day'
    };
    return durationMap[hours] || `${hours} hours`;
  };

  const toggleSpotExpansion = (spotId: number) => {
    setExpandedSpots(prev => 
      prev.includes(spotId) 
        ? prev.filter(id => id !== spotId)
        : [...prev, spotId]
    );
  };

  const handleVehicleCountChange = (count: string) => {
    const numCount = parseInt(count);
    setNumVehicles(numCount);
    
    const newVehicles = Array.from({ length: numCount }, (_, i) => 
      vehicles[i] || { 
        id: i + 1, 
        spotId: null, 
        spotName: '', 
        slotId: null, 
        slotName: '', 
        slotTime: '', 
        startTime: '', 
        endTime: '', 
        duration: 0, 
        price: 0 
      }
    );
    setVehicles(newVehicles);
  };

  const updateVehicle = (vehicleId: number, field: keyof VehicleBooking, value: any) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const updated = { ...v, [field]: value };
        
        // Reset dependent fields when spot changes
        if (field === 'spotId') {
          const selectedSpot = mockEventParkingSpots.find(s => s.id === value);
          updated.spotName = selectedSpot?.name || '';
          updated.slotId = null;
          updated.slotName = '';
          updated.slotTime = '';
          updated.startTime = '';
          updated.endTime = '';
          updated.duration = 0;
          updated.price = 0;
        }
        
        // Reset dependent fields when slot changes
        if (field === 'slotId') {
          const selectedSpot = mockEventParkingSpots.find(s => s.id === updated.spotId);
          const selectedSlot = selectedSpot?.slots.find(slot => slot.id === value);
          if (selectedSlot) {
            updated.slotName = selectedSlot.name;
            updated.slotTime = selectedSlot.time;
            updated.startTime = '';
            updated.endTime = '';
            updated.duration = 0;
            updated.price = 0;
          }
        }
        
        // Calculate duration and price when times are set
        if (updated.startTime && updated.endTime && updated.slotId) {
          const startHour = convertTo24Hour(updated.startTime);
          const endHour = convertTo24Hour(updated.endTime);
          const duration = endHour - startHour;
          
          if (duration > 0) {
            updated.duration = duration;
            const selectedSpot = mockEventParkingSpots.find(s => s.id === updated.spotId);
            const selectedSlot = selectedSpot?.slots.find(slot => slot.id === updated.slotId);
            if (selectedSlot) {
              const slotDuration = getSlotDurationHours(selectedSlot.time);
              const pricePerHour = selectedSlot.price / slotDuration;
              updated.price = Math.round(pricePerHour * duration);
            }
          }
        }
        
        return updated;
      }
      return v;
    }));
  };

  const convertTo24Hour = (time12: string) => {
    const [time, period] = time12.split(' ');
    let [hours, minutes = '0'] = time.split(':');
    let hour = parseInt(hours);
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    return hour + parseInt(minutes) / 60;
  };

  const convertTo12Hour = (hour24: number, minute: number = 0) => {
    const hour = Math.floor(hour24);
    const min = minute || (hour24 % 1) * 60;
    
    if (hour === 0) return `12:${min.toString().padStart(2, '0')} AM`;
    if (hour < 12) return `${hour}:${min.toString().padStart(2, '0')} AM`;
    if (hour === 12) return `12:${min.toString().padStart(2, '0')} PM`;
    return `${hour - 12}:${min.toString().padStart(2, '0')} PM`;
  };

  const getSlotDurationHours = (timeString: string) => {
    const [start, end] = timeString.split(' - ');
    const startHour = convertTo24Hour(start.trim());
    const endHour = convertTo24Hour(end.trim());
    return endHour - startHour;
  };

  const generateTimeOptions = (slotTime: string) => {
    const [start, end] = slotTime.split(' - ');
    const options = [];
    
    const startHour = convertTo24Hour(start.trim());
    const endHour = convertTo24Hour(end.trim());
    
    for (let hour = startHour; hour <= endHour; hour += 0.5) {
      if (hour >= endHour) break;
      const time12 = convertTo12Hour(hour);
      options.push(time12);
    }
    
    return options;
  };

  const getAvailableTimeOptions = (vehicleId: number, timeType: 'start' | 'end') => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle || !vehicle.slotTime) return [];

    const timeOptions = generateTimeOptions(vehicle.slotTime);
    
    if (timeType === 'end') {
      return timeOptions.filter(time => 
        !vehicle.startTime || convertTo24Hour(time) > convertTo24Hour(vehicle.startTime)
      );
    }
    
    return timeOptions.slice(0, -1);
  };

  const getAvailableSlotsForSpot = (spotId: number) => {
    const spot = mockEventParkingSpots.find(s => s.id === spotId);
    return spot?.slots || [];
  };

  const calculateTotalPrice = () => {
    return vehicles.reduce((total, vehicle) => total + vehicle.price, 0);
  };

  const isValidBooking = () => {
    return vehicles.every(v => v.spotId && v.slotId && v.startTime && v.endTime && v.duration > 0) && 
           numVehicles >= 1;
  };

  const handleProceedToPayment = () => {
    // Navigate to payment or show success
    setShowBookingSummary(false);
    navigate('/profile');
  };

  const handleFindParking = (event: any) => {
    setSelectedEvent(event);
    // Reset state
    setNumVehicles(1);
    setVehicles([{ id: 1, spotId: null, spotName: '', slotId: null, slotName: '', slotTime: '', startTime: '', endTime: '', duration: 0, price: 0 }]);
    setExpandedSpots([]);
  };

  const groupedBookingsBySpot = vehicles.reduce((acc, vehicle) => {
    if (vehicle.spotId && vehicle.duration > 0) {
      const spotName = vehicle.spotName;
      if (!acc[spotName]) {
        acc[spotName] = [];
      }
      acc[spotName].push(vehicle);
    }
    return acc;
  }, {} as Record<string, VehicleBooking[]>);

  return (
    <Layout title="Upcoming Events">
      <div className="space-y-8">
        {/* Hero Section */}
        <div 
          className="relative h-64 bg-cover bg-center rounded-2xl overflow-hidden"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200')"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Discover Austin & Dallas Events</h1>
              <p className="text-xl">Find convenient parking for all major events</p>
            </div>
          </div>
        </div>

        {/* City Filter */}
        <div className="flex justify-center space-x-4">
          <Button
            variant={selectedCity === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCity('all')}
            className={selectedCity === 'all' ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90' : ''}
          >
            All Cities
          </Button>
          <Button
            variant={selectedCity === 'austin' ? 'default' : 'outline'}
            onClick={() => setSelectedCity('austin')}
            className={selectedCity === 'austin' ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90' : ''}
          >
            Austin
          </Button>
          <Button
            variant={selectedCity === 'dallas' ? 'default' : 'outline'}
            onClick={() => setSelectedCity('dallas')}
            className={selectedCity === 'dallas' ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90' : ''}
          >
            Dallas
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-all duration-200 group">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img 
                  src={event.image} 
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{event.name}</CardTitle>
                <CardDescription className="space-y-2">
                  <div className="flex items-center space-x-2 text-[#606060]">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#606060]">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-[#606060] mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => handleFindParking(event)}
                      className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
                    >
                      <Car className="w-4 h-4 mr-2" />
                      Find Parking
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-[#FF6B00]" />
                        <span>Event Parking for {event.name}</span>
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Vehicle Count Selection */}
                      <div className="space-y-2 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <Label htmlFor="vehicleCount">How many vehicles are you booking for?</Label>
                        <Select value={numVehicles.toString()} onValueChange={handleVehicleCountChange}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select number of vehicles" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} vehicle{num > 1 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Available Parking Spots */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Available Parking Spots Near Event</h3>
                        {mockEventParkingSpots.map((spot) => (
                          <Card key={spot.id} className="border-2">
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{spot.name}</CardTitle>
                                  <CardDescription className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="w-4 h-4" />
                                      <span>{spot.address}</span>
                                    </div>
                                    <div className="text-sm text-green-600 font-medium">
                                      {spot.distance}
                                    </div>
                                  </CardDescription>
                                </div>
                                <Collapsible>
                                  <CollapsibleTrigger
                                    onClick={() => toggleSpotExpansion(spot.id)}
                                    className="flex items-center space-x-2 text-sm text-[#FF6B00] hover:text-[#FF6B00]/80"
                                  >
                                    <span>{spot.totalSlots} slots available</span>
                                    {expandedSpots.includes(spot.id) ? 
                                      <ChevronUp className="w-4 h-4" /> : 
                                      <ChevronDown className="w-4 h-4" />
                                    }
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="mt-3 space-y-2">
                                      {spot.slots.map((slot) => (
                                        <div key={slot.id} className="p-3 bg-gray-50 rounded border">
                                          <div className="flex justify-between items-center">
                                            <div>
                                              <span className="font-medium">{slot.name}</span>
                                              <div className="text-sm text-gray-600">{slot.time}</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="font-semibold text-[#FF6B00]">${slot.price}</div>
                                              <div className="text-xs text-gray-500">Max {slot.maxVehicles} cars</div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>

                      {/* Vehicle Assignment Forms */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Assign Vehicles to Slots</h3>
                        {vehicles.map((vehicle) => (
                          <Card key={vehicle.id} className="p-4 bg-gray-50">
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Car className="h-4 w-4 text-[#FF6B00]" />
                                <span className="font-medium">Car {vehicle.id}</span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                  <Label>Select Parking Spot</Label>
                                  <Select 
                                    value={vehicle.spotId?.toString() || ''} 
                                    onValueChange={(value) => updateVehicle(vehicle.id, 'spotId', parseInt(value))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose spot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {mockEventParkingSpots.map((spot) => (
                                        <SelectItem key={spot.id} value={spot.id.toString()}>
                                          {spot.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Select Slot</Label>
                                  <Select 
                                    value={vehicle.slotId?.toString() || ''} 
                                    onValueChange={(value) => updateVehicle(vehicle.id, 'slotId', parseInt(value))}
                                    disabled={!vehicle.spotId}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getAvailableSlotsForSpot(vehicle.spotId || 0).map((slot) => (
                                        <SelectItem key={slot.id} value={slot.id.toString()}>
                                          {slot.name} ({slot.time})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Start Time</Label>
                                  <Select 
                                    value={vehicle.startTime} 
                                    onValueChange={(value) => updateVehicle(vehicle.id, 'startTime', value)}
                                    disabled={!vehicle.slotId}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Start time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getAvailableTimeOptions(vehicle.id, 'start').map((time) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>End Time</Label>
                                  <Select 
                                    value={vehicle.endTime} 
                                    onValueChange={(value) => updateVehicle(vehicle.id, 'endTime', value)}
                                    disabled={!vehicle.slotId || !vehicle.startTime}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="End time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getAvailableTimeOptions(vehicle.id, 'end').map((time) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {vehicle.duration > 0 && (
                                <div className="bg-white p-3 rounded border">
                                  <div className="flex justify-between items-center text-sm">
                                    <span>Duration: {vehicle.duration} hour{vehicle.duration !== 1 ? 's' : ''}</span>
                                    <span className="font-semibold text-[#FF6B00]">${vehicle.price}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>

                      {/* Booking Summary */}
                      {Object.keys(groupedBookingsBySpot).length > 0 && (
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <h3 className="font-semibold text-lg mb-3">Booking Summary</h3>
                          <div className="space-y-3">
                            {Object.entries(groupedBookingsBySpot).map(([spotName, spotVehicles]) => (
                              <div key={spotName} className="bg-white p-3 rounded border">
                                <div className="font-medium text-[#FF6B00] mb-2">{spotName}</div>
                                <div className="space-y-1">
                                  {spotVehicles.map((vehicle) => (
                                    <div key={vehicle.id} className="flex justify-between items-center text-sm">
                                      <span>Car {vehicle.id}: {vehicle.slotName} ({vehicle.startTime} - {vehicle.endTime})</span>
                                      <span className="font-semibold">${vehicle.price}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <div className="border-t pt-3 mt-3">
                              <div className="flex justify-between items-center font-bold text-lg">
                                <span>Total Cost:</span>
                                <span className="text-[#FF6B00]">${calculateTotalPrice()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button 
                        onClick={handleProceedToPayment} 
                        className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
                        disabled={!isValidBooking()}
                      >
                        Proceed to Payment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-[#FF6B00]/10 to-[#002F5F]/10 border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-[#1C1C1C] mb-4">Don't see your event?</h3>
            <p className="text-[#606060] mb-6 max-w-2xl mx-auto">
              Search for parking by location or browse all available spots in your area.
            </p>
            <Button 
              onClick={() => navigate('/find-parking')}
              className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
            >
              Browse All Parking Spots
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Events;

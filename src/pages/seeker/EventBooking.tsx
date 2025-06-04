
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Car, Clock, DollarSign, Navigation } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const mockParkingSpots = [
  {
    id: 1,
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    distance: '0.2 miles from event',
    price: 15,
    coordinates: { x: 35, y: 40 },
    slots: [
      { 
        id: 1, 
        name: 'Morning Slot', 
        timeRange: '9:00 AM - 11:00 AM', 
        capacity: 2, 
        available: 2, 
        startTime: '9:00 AM', 
        endTime: '11:00 AM',
        availableDates: ['2024-10-06', '2024-10-07', '2024-10-08']
      },
      { 
        id: 2, 
        name: 'Afternoon Slot', 
        timeRange: '12:00 PM - 2:00 PM', 
        capacity: 1, 
        available: 1, 
        startTime: '12:00 PM', 
        endTime: '2:00 PM',
        availableDates: ['2024-10-06', '2024-10-07', '2024-10-08']
      }
    ]
  },
  {
    id: 2,
    name: 'Safe Street Parking',
    address: '456 Oak St, Austin, TX',
    distance: '0.4 miles from event',
    price: 12,
    coordinates: { x: 60, y: 50 },
    slots: [
      { 
        id: 3, 
        name: 'Extended Slot', 
        timeRange: '10:00 AM - 1:00 PM', 
        capacity: 3, 
        available: 3, 
        startTime: '10:00 AM', 
        endTime: '1:00 PM',
        availableDates: ['2024-10-06', '2024-10-07', '2024-10-08']
      },
      { 
        id: 4, 
        name: 'Evening Slot', 
        timeRange: '2:00 PM - 6:00 PM', 
        capacity: 2, 
        available: 1, 
        startTime: '2:00 PM', 
        endTime: '6:00 PM',
        availableDates: ['2024-10-06', '2024-10-07', '2024-10-08']
      }
    ]
  },
  {
    id: 3,
    name: 'Premium Event Parking',
    address: '789 Zilker Rd, Austin, TX',
    distance: '0.1 miles from event',
    price: 20,
    coordinates: { x: 45, y: 30 },
    slots: [
      { 
        id: 5, 
        name: 'All Day', 
        timeRange: '8:00 AM - 6:00 PM', 
        capacity: 5, 
        available: 4, 
        startTime: '8:00 AM', 
        endTime: '6:00 PM',
        availableDates: ['2024-10-06', '2024-10-07', '2024-10-08']
      }
    ]
  }
];

const EventBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const event = location.state?.event;
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);

  if (!event) {
    navigate('/events');
    return null;
  }

  if (!user) {
    navigate('/login', { state: { returnTo: `/event-booking/${event.id}`, context: 'booking' } });
    return null;
  }

  const getUniqueDatesForSpot = (spot: any) => {
    const allDates: string[] = [];
    spot.slots.forEach((slot: any) => {
      if (slot.availableDates && Array.isArray(slot.availableDates)) {
        slot.availableDates.forEach((date: any) => {
          if (typeof date === 'string') {
            allDates.push(date);
          }
        });
      }
    });
    return [...new Set(allDates)].sort();
  };

  const formatAvailableDates = (dates: string[]) => {
    if (dates.length === 0) return 'No dates available';
    
    const formattedDates = dates.slice(0, 3).map(date => {
      const dateObj = new Date(date);
      return format(dateObj, 'MMM d');
    });
    
    if (dates.length > 3) {
      return `${formattedDates.join(', ')} +${dates.length - 3} more`;
    }
    
    return formattedDates.join(', ');
  };

  const handleBookParking = (spot: any) => {
    navigate(`/book-slot/${spot.id}`, { 
      state: { 
        returnTo: `/event-booking/${event.id}`,
        event: event 
      } 
    });
  };

  const handlePinClick = (spotId: number) => {
    setSelectedSpotId(spotId);
    // Scroll to the corresponding card
    const cardElement = document.getElementById(`spot-card-${spotId}`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCardClick = (spotId: number) => {
    setSelectedSpotId(spotId);
  };

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

        {/* Map View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-[#FF6B00]" />
              <span>Available Parking Near Event</span>
              <div className="flex items-center space-x-1 text-sm text-green-600">
                <Navigation className="h-4 w-4" />
                <span>Map View</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              {/* Static Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                {/* Grid pattern to simulate map */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
                
                {/* Streets simulation */}
                <div className="absolute top-1/3 left-0 right-0 h-2 bg-gray-300 opacity-50"></div>
                <div className="absolute top-2/3 left-0 right-0 h-2 bg-gray-300 opacity-50"></div>
                <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-gray-300 opacity-50"></div>
                <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gray-300 opacity-50"></div>
              </div>

              {/* Event Location Marker */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                style={{ left: '50%', top: '30%' }}
              >
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded shadow-md text-xs font-semibold whitespace-nowrap">
                  {event.name}
                </div>
              </div>

              {/* Parking Spot Pins */}
              {mockParkingSpots.map((spot) => (
                <div
                  key={spot.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                    selectedSpotId === spot.id ? 'scale-125 z-20' : 'z-10'
                  }`}
                  style={{
                    left: `${spot.coordinates.x}%`,
                    top: `${spot.coordinates.y}%`,
                  }}
                  onClick={() => handlePinClick(spot.id)}
                  title={`${spot.name} - $${spot.price}/hr`}
                >
                  <div className={`relative ${selectedSpotId === spot.id ? 'animate-bounce' : ''}`}>
                    {/* Pin Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${
                      selectedSpotId === spot.id ? 'bg-[#FF6B00] ring-4 ring-orange-200' : 'bg-[#FF6B00] hover:bg-[#FF6B00]/90'
                    }`}>
                      <DollarSign className="w-4 h-4" />
                    </div>
                    {/* Price Label */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-semibold text-[#FF6B00] whitespace-nowrap">
                      ${spot.price}/hr
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Parking Spots */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#1C1C1C]">
            Available Parking Spots ({mockParkingSpots.length})
          </h2>
          
          <div className="w-full max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
              {mockParkingSpots.map((spot) => (
                <Card 
                  key={spot.id} 
                  id={`spot-card-${spot.id}`}
                  className={`w-full min-h-[280px] hover:shadow-xl hover:border-[#FF6B00]/30 transition-all duration-300 cursor-pointer group ${
                    selectedSpotId === spot.id ? 'ring-2 ring-[#FF6B00] shadow-lg border-[#FF6B00]/50' : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleCardClick(spot.id)}
                >
                  <CardContent className="p-5 h-full flex flex-col">
                    {/* Header with name and price */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-[#1C1C1C] mb-2 group-hover:text-[#FF6B00] transition-colors">
                          {spot.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-[#FF6B00]" />
                          <span className="truncate">{spot.address}</span>
                        </div>
                        <div className="text-sm text-[#FF6B00] font-medium">
                          {spot.distance}
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <div className="bg-[#FF6B00]/10 px-3 py-2 rounded-lg border border-[#FF6B00]/20">
                          <span className="text-lg font-bold text-[#FF6B00]">${spot.price}</span>
                          <span className="text-sm text-[#FF6B00]/80">/hr</span>
                        </div>
                      </div>
                    </div>

                    {/* Available dates */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 flex-shrink-0 text-[#FF6B00]" />
                        <span className="font-semibold">Available:</span>
                        <span className="text-[#FF6B00] font-medium">
                          {formatAvailableDates(getUniqueDatesForSpot(spot))}
                        </span>
                      </div>
                    </div>

                    {/* Available times */}
                    <div className="flex-1 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-700 mb-3">
                        <Clock className="w-4 h-4 flex-shrink-0 text-[#FF6B00]" />
                        <span className="font-semibold">Time Slots:</span>
                      </div>
                      <div className="space-y-2">
                        {spot.slots.map((slot: any) => (
                          <div key={slot.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <div className="text-sm font-medium text-gray-800">
                              {slot.timeRange}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Capacity: {slot.capacity} vehicle{slot.capacity !== 1 ? 's' : ''} • {slot.available} available
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Book button */}
                    <div className="flex justify-center md:justify-end pt-2">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookParking(spot);
                        }}
                        className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-md w-full md:w-auto"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventBooking;

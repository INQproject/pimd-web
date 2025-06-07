
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Car, Clock, Circle, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mockParkingSpots = [
  {
    id: 1,
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    distance: '0.2 miles from event',
    price: 15,
    coordinates: { x: 35, y: 40 },
    availableDates: ['2025-06-18', '2025-06-19', '2025-06-20'],
    slots: [
      { id: 1, name: 'Slot A', timeRange: '4:00 PM - 8:00 PM', capacity: 2, available: 2, date: '2025-06-18' },
      { id: 2, name: 'Slot B', timeRange: '8:00 PM - 12:00 AM', capacity: 1, available: 1, date: '2025-06-18' },
      { id: 3, name: 'Slot A', timeRange: '4:00 PM - 8:00 PM', capacity: 2, available: 2, date: '2025-06-19' }
    ]
  },
  {
    id: 2,
    name: 'Safe Street Parking',
    address: '456 Oak St, Austin, TX',
    distance: '0.4 miles from event',
    price: 12,
    coordinates: { x: 65, y: 25 },
    availableDates: ['2025-06-18', '2025-06-20'],
    slots: [
      { id: 4, name: 'Slot A', timeRange: '3:00 PM - 7:00 PM', capacity: 3, available: 3, date: '2025-06-18' },
      { id: 5, name: 'Slot B', timeRange: '7:00 PM - 11:00 PM', capacity: 2, available: 1, date: '2025-06-20' }
    ]
  },
  {
    id: 3,
    name: 'Zilker Park Nearby',
    address: '789 Barton Springs Rd, Austin, TX',
    distance: '0.1 miles from event',
    price: 18,
    coordinates: { x: 50, y: 60 },
    availableDates: ['2025-06-18', '2025-06-19'],
    slots: [
      { id: 6, name: 'Slot A', timeRange: '2:00 PM - 6:00 PM', capacity: 4, available: 4, date: '2025-06-18' },
      { id: 7, name: 'Slot B', timeRange: '6:00 PM - 10:00 PM', capacity: 3, available: 2, date: '2025-06-19' }
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

  const handleBookSpot = (spotId: number) => {
    navigate(`/book-slot/${spotId}`, { 
      state: { 
        returnTo: `/event-booking/${event.id}`,
        event: event 
      } 
    });
  };

  const handlePinClick = (spotId: number) => {
    setSelectedSpotId(spotId);
    const cardElement = document.getElementById(`spot-card-${spotId}`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCardClick = (spotId: number) => {
    setSelectedSpotId(spotId);
  };

  const formatDatePill = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${
                      selectedSpotId === spot.id ? 'bg-[#FF6B00] ring-4 ring-orange-200' : 'bg-[#FF6B00] hover:bg-[#FF6B00]/90'
                    }`}>
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-semibold text-[#FF6B00] whitespace-nowrap">
                      ${spot.price}/hr
                    </div>
                  </div>
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
          </CardContent>
        </Card>

        {/* Parking Spots List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#1C1C1C]">
            Available Parking Spots ({mockParkingSpots.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {mockParkingSpots.map((spot) => (
              <Card 
                key={spot.id} 
                id={`spot-card-${spot.id}`}
                className={`hover:shadow-xl hover:border-[#FF6B00]/30 transition-all duration-300 cursor-pointer group ${
                  selectedSpotId === spot.id ? 'ring-2 ring-[#FF6B00] shadow-lg border-[#FF6B00]/50' : 'hover:shadow-lg'
                }`}
                onClick={() => handleCardClick(spot.id)}
              >
                <CardContent className="p-3 h-full flex flex-col">
                  {/* Header with name and price */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-[#1C1C1C] mb-1 group-hover:text-[#FF6B00] transition-colors">
                        {spot.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-xs text-gray-600 mb-1">
                        <MapPin className="w-3 h-3 flex-shrink-0 text-[#FF6B00]" />
                        <span className="truncate">{spot.address}</span>
                      </div>
                      <p className="text-xs text-[#FF6B00] font-medium">{spot.distance}</p>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <div className="bg-[#FF6B00]/10 px-2 py-1 rounded-md border border-[#FF6B00]/20">
                        <span className="text-sm font-bold text-[#FF6B00]">${spot.price}</span>
                        <span className="text-xs text-[#FF6B00]/80">/hr</span>
                      </div>
                    </div>
                  </div>

                  {/* Available Dates */}
                  <div className="flex-1 mb-3">
                    <div className="flex items-center space-x-1 text-xs text-gray-700 mb-2">
                      <Calendar className="w-3 h-3 flex-shrink-0 text-[#FF6B00]" />
                      <span className="font-medium">Available Dates:</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {spot.availableDates.map(date => (
                        <div key={date} className="bg-[#FF6B00]/10 px-2 py-0.5 rounded-full border border-[#FF6B00]/20">
                          <span className="text-xs font-medium text-[#FF6B00]">
                            {formatDatePill(date)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-700 mb-2">
                      <Clock className="w-3 h-3 flex-shrink-0 text-[#FF6B00]" />
                      <span className="font-medium">Time Slots:</span>
                    </div>
                    <div className="space-y-1">
                      {[...new Set(spot.slots.map(slot => slot.timeRange))].map(timeRange => (
                        <div key={timeRange} className="bg-gray-50 rounded-md p-2 border border-gray-100">
                          <div className="text-xs font-medium text-gray-800">
                            {timeRange}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Book button */}
                  <div className="flex justify-center md:justify-end pt-1">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookSpot(spot.id);
                      }}
                      className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-4 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-md w-full md:w-auto text-sm"
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
    </Layout>
  );
};

export default EventBooking;

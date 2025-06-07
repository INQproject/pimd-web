import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Clock, Filter, Car, Navigation, Search, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mockParkingSpots = [
  {
    id: 1,
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    price: 15,
    city: 'austin',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400',
    coordinates: { x: 35, y: 40 }, // Position on static map (percentage)
    slots: [
      { id: 1, name: 'Slot A', timeRange: '8:00 AM - 12:00 PM', capacity: 2 },
      { id: 2, name: 'Slot B', timeRange: '1:00 PM - 6:00 PM', capacity: 1 }
    ]
  },
  {
    id: 2,
    name: 'Deep Ellum Private Spot',
    address: '456 Elm St, Dallas, TX',
    price: 12,
    city: 'dallas',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400',
    coordinates: { x: 65, y: 25 },
    slots: [
      { id: 3, name: 'Slot A', timeRange: '9:00 AM - 2:00 PM', capacity: 3 },
      { id: 4, name: 'Slot B', timeRange: '3:00 PM - 8:00 PM', capacity: 2 }
    ]
  },
  {
    id: 3,
    name: 'Phoenix Mall Parking',
    address: '789 Phoenix Way, Austin, TX',
    price: 8,
    city: 'austin',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400',
    coordinates: { x: 50, y: 60 },
    slots: [
      { id: 5, name: 'Slot A', timeRange: '10:00 AM - 4:00 PM', capacity: 5 },
      { id: 6, name: 'Slot B', timeRange: '5:00 PM - 10:00 PM', capacity: 3 }
    ]
  }
];

const FindParking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [cityFilter, setCityFilter] = useState<'all' | 'austin' | 'dallas'>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);
  const [filteredSpots, setFilteredSpots] = useState(mockParkingSpots);

  const timeOptions = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  // Generate end time options based on start time
  const endTimeOptions = useMemo(() => {
    if (!startTime) return timeOptions;
    
    const startIndex = timeOptions.indexOf(startTime);
    if (startIndex === -1) return timeOptions;
    
    return timeOptions.slice(startIndex + 1);
  }, [startTime]);

  // Request user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Location detected",
            description: "Showing parking spots near your location",
          });
        },
        (error) => {
          console.log('Location access denied:', error);
          toast({
            title: "Location access denied",
            description: "Please use the filters to find parking spots",
            variant: "destructive"
          });
        }
      );
    }
  }, []);

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    // Reset end time if it's now invalid
    if (endTime && timeOptions.indexOf(endTime) <= timeOptions.indexOf(value)) {
      setEndTime('');
    }
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    // Reset end date if it's before start date
    if (endDate && new Date(endDate) < new Date(value)) {
      setEndDate('');
    }
  };

  const isSlotAvailable = (slot: any, selectedStartTime: string, selectedEndTime: string) => {
    if (!selectedStartTime || !selectedEndTime) return true;
    
    // Extract time range from slot
    const [slotStart, slotEnd] = slot.timeRange.split(' - ');
    
    // Convert to 24hr for comparison
    const convertTo24hr = (time12hr: string) => {
      const [time, modifier] = time12hr.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') {
        hours = '00';
      }
      if (modifier === 'PM') {
        hours = (parseInt(hours, 10) + 12).toString();
      }
      return `${hours}:${minutes}`;
    };
    
    const selectedStart24 = convertTo24hr(selectedStartTime);
    const selectedEnd24 = convertTo24hr(selectedEndTime);
    const slotStart24 = convertTo24hr(slotStart);
    const slotEnd24 = convertTo24hr(slotEnd);
    
    // Check if the selected time range fits within the slot
    return selectedStart24 >= slotStart24 && selectedEnd24 <= slotEnd24;
  };

  const applyFilters = () => {
    let filtered = mockParkingSpots;
    
    // Filter by city
    if (cityFilter !== 'all') {
      filtered = filtered.filter(spot => spot.city === cityFilter);
    }
    
    // Filter by time availability
    if (startTime && endTime) {
      filtered = filtered.filter(spot => 
        spot.slots.some(slot => isSlotAvailable(slot, startTime, endTime))
      );
    }
    
    setFilteredSpots(filtered);
    
    toast({
      title: "Filters applied",
      description: `Found ${filtered.length} parking spot${filtered.length !== 1 ? 's' : ''}`,
    });
  };

  const handleBookParking = (spot: any) => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/book-slot/${spot.id}`, context: 'booking' } });
      return;
    }
    navigate(`/book-slot/${spot.id}`);
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
    <Layout title="Find Parking">
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-[#FF6B00]" />
              <span>Search & Filter Parking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select value={cityFilter} onValueChange={(value: 'all' | 'austin' | 'dallas') => setCityFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    <SelectItem value="austin">Austin</SelectItem>
                    <SelectItem value="dallas">Dallas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Select value={startTime} onValueChange={handleStartTimeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {endTimeOptions.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Apply Filters Button */}
            <div className="pt-4">
              <Button 
                onClick={applyFilters}
                className="w-full md:w-auto bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-8 py-3 text-lg font-semibold"
              >
                <Filter className="w-5 h-5 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-[#FF6B00]" />
              <span>Map View</span>
              {userLocation && (
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <Navigation className="h-4 w-4" />
                  <span>Location detected</span>
                </div>
              )}
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
              {filteredSpots.map((spot) => (
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

              {/* User Location Pin (if available) */}
              {userLocation && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                  style={{ left: '20%', top: '30%' }} // Simulated user position
                >
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded shadow-md text-xs font-semibold whitespace-nowrap">
                    You
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#1C1C1C]">
            Available Parking Spots {filteredSpots.length > 0 && `(${filteredSpots.length})`}
          </h2>
          
          {filteredSpots.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="space-y-4">
                <Car className="w-12 h-12 mx-auto text-gray-400" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">No parking spots found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="w-full max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                {filteredSpots.map((spot) => (
                  <Card 
                    key={spot.id} 
                    id={`spot-card-${spot.id}`}
                    className={`w-full min-h-[240px] hover:shadow-xl hover:border-[#FF6B00]/30 transition-all duration-300 cursor-pointer group ${
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
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 flex-shrink-0 text-[#FF6B00]" />
                            <span className="truncate">{spot.address}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <div className="bg-[#FF6B00]/10 px-3 py-2 rounded-lg border border-[#FF6B00]/20">
                            <span className="text-lg font-bold text-[#FF6B00]">${spot.price}</span>
                            <span className="text-sm text-[#FF6B00]/80">/hr</span>
                          </div>
                        </div>
                      </div>

                      {/* Available times */}
                      <div className="flex-1 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-700 mb-3">
                          <Clock className="w-4 h-4 flex-shrink-0 text-[#FF6B00]" />
                          <span className="font-semibold">Available Times:</span>
                        </div>
                        <div className="space-y-2">
                          {spot.slots.map(slot => (
                            <div key={slot.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                              <div className="text-sm font-medium text-gray-800">
                                {slot.timeRange}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                Capacity: {slot.capacity} vehicle{slot.capacity !== 1 ? 's' : ''}
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FindParking;

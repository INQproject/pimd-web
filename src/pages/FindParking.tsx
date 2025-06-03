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
    coordinates: { x: 25, y: 45 }, // Position on static map (percentage)
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
    coordinates: { x: 50, y: 35 },
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
    coordinates: { x: 70, y: 55 },
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

        {/* Custom Static Map View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-[#FF6B00]" />
              <span>Available Parking Nearby</span>
              {userLocation && (
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <Navigation className="h-4 w-4" />
                  <span>Location detected</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg overflow-hidden" style={{ height: '400px' }}>
              {/* Custom Static Map Background */}
              <img 
                src="/lovable-uploads/0e031f32-a542-4ab9-b992-ea48131ba135.png"
                alt="World Map"
                className="w-full h-full object-cover"
              />
              
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
                    {/* Orange Price Pin - matching the uploaded image style */}
                    <div className={`bg-[#FF6B00] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg border-2 border-white ${
                      selectedSpotId === spot.id ? 'ring-4 ring-orange-200' : ''
                    }`}>
                      ${spot.price}
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        <div className="font-semibold">{spot.name}</div>
                        <div>${spot.price}/hr</div>
                        <button 
                          className="mt-1 bg-[#FF6B00] text-white px-2 py-1 rounded text-xs pointer-events-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookParking(spot);
                          }}
                        >
                          Book Now
                        </button>
                      </div>
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
        <div className="space-y-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSpots.map((spot) => (
                <Card 
                  key={spot.id} 
                  id={`spot-card-${spot.id}`}
                  className={`max-w-full md:max-w-[300px] hover:shadow-lg transition-all duration-200 cursor-pointer ${
                    selectedSpotId === spot.id ? 'ring-2 ring-[#FF6B00] shadow-lg' : ''
                  }`}
                  onClick={() => handleCardClick(spot.id)}
                >
                  <CardContent className="p-3">
                    {/* Header with name and price */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-[#1C1C1C] truncate">{spot.name}</h3>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{spot.address.split(',')[0]}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <span className="text-sm font-bold text-[#FF6B00]">${spot.price}/hr</span>
                      </div>
                    </div>

                    {/* Available times */}
                    <div className="mb-3">
                      <div className="flex items-center space-x-1 text-xs text-gray-600 mb-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="font-medium">Available Times:</span>
                      </div>
                      <div className="space-y-1">
                        {spot.slots.map(slot => (
                          <div key={slot.id} className="text-xs text-gray-500">
                            {slot.timeRange} (Cap: {slot.capacity})
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Book button */}
                    <div className="flex justify-end">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookParking(spot);
                        }}
                        size="sm"
                        className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white text-xs px-3 py-1 h-7"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FindParking;

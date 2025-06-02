
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Clock, Filter } from 'lucide-react';

const mockParkingSpots = [
  {
    id: 1,
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    price: 15,
    availability: '8:00 AM - 10:00 PM',
    city: 'austin',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400'
  },
  {
    id: 2,
    name: 'Deep Ellum Private Spot',
    address: '456 Elm St, Dallas, TX',
    price: 12,
    availability: '6:00 AM - 11:00 PM',
    city: 'dallas',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400'
  },
  {
    id: 3,
    name: 'South Lamar Safe Parking',
    address: '789 S Lamar Blvd, Austin, TX',
    price: 18,
    availability: '7:00 AM - 9:00 PM',
    city: 'austin',
    image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=400'
  },
  {
    id: 4,
    name: 'Bishop Arts District Spot',
    address: '321 Bishop Ave, Dallas, TX',
    price: 14,
    availability: '9:00 AM - 8:00 PM',
    city: 'dallas',
    image: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=400'
  }
];

const FindParking = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [cityFilter, setCityFilter] = useState<'all' | 'austin' | 'dallas'>('all');

  const filteredSpots = mockParkingSpots.filter(spot => {
    if (cityFilter !== 'all' && spot.city !== cityFilter) return false;
    if (searchLocation && !spot.address.toLowerCase().includes(searchLocation.toLowerCase())) return false;
    return true;
  });

  const handleBookParking = (spotId: number) => {
    navigate(`/book-slot/${spotId}`);
  };

  return (
    <Layout title="Find Parking">
      <div className="space-y-8">
        {/* Static Map Placeholder */}
        <Card className="overflow-hidden">
          <div className="h-80 bg-gradient-to-br from-blue-100 to-green-100 relative flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-[#FF6B00] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1C1C1C] mb-2">Interactive Map View</h3>
              <p className="text-[#606060]">Parking spots in Austin & Dallas</p>
            </div>
            
            {/* Mock parking pins */}
            <div className="absolute top-20 left-1/4">
              <div className="w-4 h-4 bg-[#FF6B00] rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div className="absolute top-32 right-1/3">
              <div className="w-4 h-4 bg-[#FF6B00] rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div className="absolute bottom-20 left-1/3">
              <div className="w-4 h-4 bg-[#FF6B00] rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-[#FF6B00]" />
              <span>Search & Filter Parking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter Austin or Dallas location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">30 min</SelectItem>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="1.5">1.5 hours</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="8">All day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select value={cityFilter} onValueChange={(value: 'all' | 'austin' | 'dallas') => setCityFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    <SelectItem value="austin">Austin</SelectItem>
                    <SelectItem value="dallas">Dallas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1C1C1C]">Available Parking Spots</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredSpots.map((spot) => (
              <Card key={spot.id} className="hover:shadow-lg transition-all duration-200">
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
                  <CardTitle className="text-lg">{spot.name}</CardTitle>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center space-x-2 text-[#606060]">
                      <MapPin className="w-4 h-4" />
                      <span>{spot.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#606060]">
                      <Clock className="w-4 h-4" />
                      <span>Available: {spot.availability}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Button 
                    onClick={() => handleBookParking(spot.id)}
                    className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
                  >
                    Book Parking
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindParking;

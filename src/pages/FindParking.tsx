
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Clock, Filter, Car } from 'lucide-react';

const mockParkingSpots = [
  {
    id: 1,
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    price: 15,
    city: 'austin',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400',
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
    slots: [
      { id: 3, name: 'Slot A', timeRange: '9:00 AM - 2:00 PM', capacity: 3 },
      { id: 4, name: 'Slot B', timeRange: '3:00 PM - 8:00 PM', capacity: 2 }
    ]
  }
];

const FindParking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [cityFilter, setCityFilter] = useState<'all' | 'austin' | 'dallas'>('all');

  const filteredSpots = mockParkingSpots.filter(spot => {
    if (cityFilter !== 'all' && spot.city !== cityFilter) return false;
    return true;
  });

  const handleBookParking = (spot: any) => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/book-slot/${spot.id}`, context: 'booking' } });
      return;
    }
    navigate(`/book-slot/${spot.id}`);
  };

  const timeOptions = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  return (
    <Layout title="Find Parking">
      <div className="space-y-8">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-[#FF6B00]" />
              <span>Search & Filter Parking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Location</Label>
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
                    {timeOptions.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
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
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
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
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Available Slots:</p>
                      {spot.slots.map(slot => (
                        <div key={slot.id} className="text-sm text-[#606060]">
                          {slot.name}: {slot.timeRange} (Capacity: {slot.capacity})
                        </div>
                      ))}
                    </div>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Button 
                    onClick={() => handleBookParking(spot)}
                    className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
                  >
                    <Car className="w-4 h-4 mr-2" />
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

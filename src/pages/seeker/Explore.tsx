
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, DollarSign } from 'lucide-react';

const mockParkingSpots = [
  {
    id: '1',
    name: 'Downtown Driveway - Sarah\'s Place',
    price: '$12/hour',
    distance: '0.3 miles',
    nextAvailable: '9:00 AM',
    rating: 4.8,
    address: '123 Main St, Downtown',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400',
  },
  {
    id: '2',
    name: 'City Center Parking',
    price: '$15/hour',
    distance: '0.5 miles',
    nextAvailable: '10:30 AM',
    rating: 4.9,
    address: '456 Business Ave',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400',
  },
  {
    id: '3',
    name: 'Residential Driveway',
    price: '$8/hour',
    distance: '0.7 miles',
    nextAvailable: '11:00 AM',
    rating: 4.6,
    address: '789 Oak Street',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400',
  },
  {
    id: '4',
    name: 'Secure Garage Space',
    price: '$20/hour',
    distance: '0.4 miles',
    nextAvailable: '2:00 PM',
    rating: 5.0,
    address: '321 Pine Road',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400',
  },
];

const Explore = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const navigate = useNavigate();

  const handleBookNow = (spotId: string) => {
    navigate(`/book-slot/${spotId}`);
  };

  return (
    <Layout title="Explore Parking">
      <div className="space-y-6 animate-fade-in">
        {/* Map Section */}
        <Card className="card-shadow">
          <CardContent className="p-0">
            <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center opacity-20" 
                   style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800)'}}></div>
              <div className="relative z-10 text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold text-text-primary">Interactive Map View</p>
                <p className="text-text-secondary">Parking spots near your location</p>
              </div>
              
              {/* Simulated pins */}
              <div className="absolute top-16 left-20 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-24 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute bottom-16 left-1/3 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Filter Results</CardTitle>
            <CardDescription>Narrow down your search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
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
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Spots */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Available Parking Spots</h3>
          <div className="grid gap-6">
            {mockParkingSpots.map((spot) => (
              <Card key={spot.id} className="card-shadow hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-32 md:h-auto">
                    <img 
                      src={spot.image} 
                      alt={spot.name}
                      className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary">{spot.name}</h4>
                        <div className="flex items-center space-x-4 text-text-secondary text-sm mt-1">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {spot.distance}
                          </span>
                          <span>★ {spot.rating}</span>
                        </div>
                        <p className="text-text-secondary mt-1">{spot.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{spot.price}</div>
                        <div className="text-text-secondary text-sm">Next: {spot.nextAvailable}</div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleBookNow(spot.id)}
                      className="btn-primary"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;

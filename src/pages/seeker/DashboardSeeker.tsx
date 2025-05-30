
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Upload } from 'lucide-react';

const mockEvents = [
  {
    id: 1,
    name: 'NBA Lakers vs Warriors',
    date: 'March 15, 2024',
    location: 'Crypto.com Arena, LA',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
  },
  {
    id: 2,
    name: 'Music Festival 2024',
    date: 'March 22, 2024',
    location: 'Central Park, NYC',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
  },
  {
    id: 3,
    name: 'Tech Conference',
    date: 'April 5, 2024',
    location: 'Convention Center, SF',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
  },
];

const DashboardSeeker = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();

  const handleLocationSearch = () => {
    if (searchLocation.trim()) {
      navigate('/explore');
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Current location:', position.coords);
          navigate('/explore');
        },
        (error) => {
          console.error('Error getting location:', error);
          navigate('/explore');
        }
      );
    } else {
      navigate('/explore');
    }
  };

  const handleBookEvent = (eventId: number) => {
    navigate('/explore');
  };

  return (
    <Layout title="Find Parking">
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Where do you need to park today?
          </h2>
          <p className="text-text-secondary">
            Search by location or browse popular events in your area
          </p>
        </div>

        {/* Search Section */}
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Input
                  placeholder="Enter location (e.g., Downtown LA, 123 Main St)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                />
                <Button onClick={handleLocationSearch} className="btn-primary">
                  <MapPin className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              
              <div className="text-center">
                <span className="text-text-secondary">or</span>
              </div>
              
              <Button 
                onClick={handleUseMyLocation}
                variant="outline" 
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Use My Current Location
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Events */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Popular Events</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {mockEvents.map((event) => (
              <Card key={event.id} className="card-shadow hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img 
                    src={event.image} 
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center space-x-2 text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-text-secondary mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleBookEvent(event.id)}
                    className="w-full btn-primary"
                  >
                    Book Parking
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">2.5k+</div>
              <div className="text-text-secondary">Available Spots</div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">$8</div>
              <div className="text-text-secondary">Avg. Hourly Rate</div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">50k+</div>
              <div className="text-text-secondary">Happy Customers</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardSeeker;

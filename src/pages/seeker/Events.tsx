
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Car } from 'lucide-react';

const mockEvents = [
  {
    id: 1,
    name: 'Austin City Limits Music Festival',
    date: 'Oct 6-8, 2024',
    time: '2:00 PM - 11:00 PM',
    location: 'Zilker Park, Austin',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop',
    description: 'Three days of amazing music featuring top artists from around the world.',
    city: 'austin'
  },
  {
    id: 2,
    name: 'Dallas Marathon 2025',
    date: 'Dec 8, 2024',
    time: '7:00 AM - 2:00 PM',
    location: 'Downtown Dallas',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=500&h=300&fit=crop',
    description: 'Join thousands of runners in this premier marathon event through the heart of Dallas.',
    city: 'dallas'
  },
  {
    id: 3,
    name: 'South by Southwest (SXSW)',
    date: 'Mar 10-19, 2025',
    time: 'All Day',
    location: 'Downtown Austin',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop',
    description: 'The ultimate music, interactive, and film festival.',
    city: 'austin'
  },
  {
    id: 4,
    name: 'State Fair of Texas',
    date: 'Sep 27 - Oct 20, 2024',
    time: '10:00 AM - 10:00 PM',
    location: 'Fair Park, Dallas',
    category: 'Fair',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
    description: 'The biggest state fair in the United States with rides, food, and entertainment.',
    city: 'dallas'
  },
  {
    id: 5,
    name: 'Austin Food + Wine Festival',
    date: 'Apr 26-28, 2025',
    time: '12:00 PM - 10:00 PM',
    location: 'Auditorium Shores, Austin',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=300&fit=crop',
    description: 'Celebrate Austin\'s incredible food scene with top chefs and local restaurants.',
    city: 'austin'
  },
  {
    id: 6,
    name: 'Dallas Arts District Festival',
    date: 'May 17-18, 2025',
    time: '11:00 AM - 9:00 PM',
    location: 'Dallas Arts District',
    category: 'Arts',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
    description: 'Experience the vibrant arts scene with galleries, performances, and street art.',
    city: 'dallas'
  }
];

const Events = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<'all' | 'austin' | 'dallas'>('all');

  const filteredEvents = selectedCity === 'all' 
    ? mockEvents 
    : mockEvents.filter(event => event.city === selectedCity);

  const handleFindParking = (event: any) => {
    navigate(`/event-booking/${event.id}`, { state: { event } });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Sports': 'bg-blue-100 text-blue-800',
      'Music': 'bg-purple-100 text-purple-800',
      'Business': 'bg-green-100 text-green-800',
      'Food': 'bg-orange-100 text-orange-800',
      'Arts': 'bg-pink-100 text-pink-800',
      'Fair': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout title="Upcoming Events">
      <div className="space-y-8">
        {/* Hero Section */}
        <div 
          className="relative h-64 bg-cover bg-center rounded-2xl overflow-hidden"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=400&fit=crop')"
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
                
                <Button 
                  onClick={() => handleFindParking(event)}
                  className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Find Parking
                </Button>
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

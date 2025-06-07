
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Car } from 'lucide-react';

const mockEvents = [
  {
    id: 1,
    name: 'Austin Food & Wine Festival',
    date: 'June 18-20, 2025',
    time: '5:00 PM - 11:00 PM',
    location: 'Zilker Park, Austin',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500',
    description: 'Savor the best of Austin\'s culinary scene with top chefs, local vendors, and live music.',
    city: 'austin'
  },
  {
    id: 2,
    name: 'Dallas Jazz Night',
    date: 'June 25, 2025',
    time: '7:00 PM - 12:00 AM',
    location: 'Deep Ellum District, Dallas',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500',
    description: 'An evening of smooth jazz featuring local and touring artists in the heart of Deep Ellum.',
    city: 'dallas'
  },
  {
    id: 3,
    name: 'Austin Tech Conference 2025',
    date: 'July 8-10, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'Austin Convention Center',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=500',
    description: 'Connect with innovators and learn about the latest trends in technology and startups.',
    city: 'austin'
  },
  {
    id: 4,
    name: 'Dallas Summer Arts Festival',
    date: 'July 15-17, 2025',
    time: '10:00 AM - 8:00 PM',
    location: 'Klyde Warren Park, Dallas',
    category: 'Arts',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=500',
    description: 'Experience local and regional artists showcasing paintings, sculptures, and live performances.',
    city: 'dallas'
  },
  {
    id: 5,
    name: 'Austin Film Festival',
    date: 'August 5-12, 2025',
    time: '6:00 PM - 11:00 PM',
    location: 'Various Theaters, Austin',
    category: 'Film',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500',
    description: 'Celebrate independent filmmaking with screenings, panels, and networking events.',
    city: 'austin'
  },
  {
    id: 6,
    name: 'Dallas Marathon Weekend',
    date: 'August 20-22, 2025',
    time: '6:00 AM - 3:00 PM',
    location: 'Downtown Dallas',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=500',
    description: 'Join thousands of runners for a weekend of races through the scenic streets of Dallas.',
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
      'Film': 'bg-red-100 text-red-800',
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

        {/* Events Grid - 2 Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
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

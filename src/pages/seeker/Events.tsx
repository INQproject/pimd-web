
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';

const mockEvents = [
  {
    id: 1,
    name: 'NBA Lakers vs Warriors',
    date: 'March 15, 2024',
    time: '7:30 PM',
    location: 'Crypto.com Arena, Downtown LA',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500',
    description: 'Don\'t miss this epic showdown between two basketball giants!'
  },
  {
    id: 2,
    name: 'Summer Music Festival 2024',
    date: 'March 22, 2024',
    time: '2:00 PM',
    location: 'Griffith Park, Los Angeles',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500',
    description: 'A day filled with amazing artists and great vibes.'
  },
  {
    id: 3,
    name: 'Tech Innovation Conference',
    date: 'April 5, 2024',
    time: '9:00 AM',
    location: 'Convention Center, Santa Monica',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500',
    description: 'Discover the latest in tech and network with industry leaders.'
  },
  {
    id: 4,
    name: 'Food & Wine Festival',
    date: 'April 12, 2024',
    time: '11:00 AM',
    location: 'Beverly Hills',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=500',
    description: 'Taste the finest cuisine from local chefs and wineries.'
  },
  {
    id: 5,
    name: 'Art Gallery Opening',
    date: 'April 18, 2024',
    time: '6:00 PM',
    location: 'Museum District, LA',
    category: 'Arts',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=500',
    description: 'Experience contemporary art from emerging local artists.'
  },
  {
    id: 6,
    name: 'Marathon 2024',
    date: 'May 1, 2024',
    time: '6:00 AM',
    location: 'Santa Monica to Venice Beach',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500',
    description: 'Join thousands of runners in this scenic coastal marathon.'
  },
];

const Events = () => {
  const navigate = useNavigate();

  const handleFindParking = (eventId: number) => {
    navigate('/explore');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Sports': 'bg-blue-100 text-blue-800',
      'Music': 'bg-purple-100 text-purple-800',
      'Business': 'bg-green-100 text-green-800',
      'Food': 'bg-orange-100 text-orange-800',
      'Arts': 'bg-pink-100 text-pink-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout title="Upcoming Events">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <p className="text-text-secondary max-w-2xl mx-auto">
            Discover exciting events happening around you and book convenient parking spots nearby.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <Card key={event.id} className="card-shadow hover:shadow-lg transition-all duration-200 group">
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
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                  {event.description}
                </p>
                <Button 
                  onClick={() => handleFindParking(event.id)}
                  className="w-full btn-primary"
                >
                  Find Parking for this Event
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="card-shadow bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Don't see your event?</h3>
            <p className="text-text-secondary mb-6">
              Search for parking by location or browse all available spots in your area.
            </p>
            <Button 
              onClick={() => navigate('/explore')}
              className="btn-primary"
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

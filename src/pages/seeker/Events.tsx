
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Clock, Users, Star, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockEvents = [
  {
    id: 1,
    title: 'Austin City Limits Music Festival',
    date: '2024-10-06',
    endDate: '2024-10-08',
    time: '2:00 PM - 11:00 PM',
    location: 'Zilker Park, Austin, TX',
    description: 'Three days of incredible music featuring top artists from around the world. Experience live performances across multiple stages in the heart of Austin.',
    image: '/lovable-uploads/eecdd7a6-4025-4ea9-af99-2f9f55b16e26.png',
    category: 'Music',
    city: 'austin',
    price: 'From $89',
    rating: 4.8,
    attendees: 75000,
    organizer: 'ACL Productions',
    features: ['Multiple Stages', 'Food Vendors', 'Art Installations', 'VIP Areas']
  },
  {
    id: 2,
    title: 'Dallas Cowboys vs New York Giants',
    date: '2024-11-24',
    endDate: '2024-11-24',
    time: '4:25 PM - 8:00 PM',
    location: 'AT&T Stadium, Arlington, TX',
    description: 'Experience the excitement of NFL football as the Dallas Cowboys take on the New York Giants in this thrilling matchup.',
    image: '/lovable-uploads/d11bc2e9-7980-48e9-898d-070821a8114d.png',
    category: 'Sports',
    city: 'dallas',
    price: 'From $125',
    rating: 4.7,
    attendees: 80000,
    organizer: 'Dallas Cowboys',
    features: ['Premium Seating', 'Concessions', 'Team Store', 'Parking']
  },
  {
    id: 3,
    title: 'South by Southwest (SXSW)',
    date: '2025-03-10',
    endDate: '2025-03-19',
    time: '10:00 AM - 2:00 AM',
    location: 'Downtown Austin, TX',
    description: 'The ultimate celebration of music, interactive media, and film featuring thousands of artists, speakers, and creators from around the globe.',
    image: '/lovable-uploads/c842cc34-b312-4e4f-86aa-4d26f1afd234.png',
    category: 'Festival',
    city: 'austin',
    price: 'From $199',
    rating: 4.9,
    attendees: 400000,
    organizer: 'SXSW LLC',
    features: ['Multiple Venues', 'Networking', 'Workshops', 'Exhibitions']
  },
  {
    id: 4,
    title: 'Austin Food & Wine Festival',
    date: '2024-12-01',
    endDate: '2024-12-03',
    time: '11:00 AM - 10:00 PM',
    location: 'Republic Square, Austin, TX',
    description: 'A culinary celebration featuring renowned chefs, local restaurants, and premium wines from around the world.',
    image: '/lovable-uploads/e5aa39fa-383c-4b13-8f5b-c76690ede908.png',
    category: 'Food',
    city: 'austin',
    price: 'From $75',
    rating: 4.6,
    attendees: 25000,
    organizer: 'Austin Food Events',
    features: ['Chef Demonstrations', 'Wine Tastings', 'Local Vendors', 'VIP Experiences']
  },
  {
    id: 5,
    title: 'Dallas Arts Festival',
    date: '2024-09-15',
    endDate: '2024-09-17',
    time: '9:00 AM - 9:00 PM',
    location: 'Deep Ellum, Dallas, TX',
    description: 'Explore contemporary and traditional arts with local and international artists showcasing their work.',
    image: '/lovable-uploads/3caec63b-7cd1-4c12-a1d7-898caef609d8.png',
    category: 'Arts',
    city: 'dallas',
    price: 'From $35',
    rating: 4.5,
    attendees: 15000,
    organizer: 'Dallas Arts Council',
    features: ['Artist Booths', 'Live Performances', 'Workshops', 'Family Activities']
  },
  {
    id: 6,
    title: 'Austin Tech Summit',
    date: '2024-10-20',
    endDate: '2024-10-22',
    time: '8:00 AM - 6:00 PM',
    location: 'Austin Convention Center, Austin, TX',
    description: 'The premier technology conference bringing together industry leaders, innovators, and entrepreneurs.',
    image: '/lovable-uploads/c3cd7517-8418-4aee-81a8-1236238c8e77.png',
    category: 'Technology',
    city: 'austin',
    price: 'From $299',
    rating: 4.7,
    attendees: 5000,
    organizer: 'Austin Tech Alliance',
    features: ['Keynote Speakers', 'Networking Sessions', 'Product Demos', 'Startup Showcase']
  }
];

const Events = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<'all' | 'austin' | 'dallas'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  const categories = ['all', 'Music', 'Sports', 'Festival', 'Food', 'Arts', 'Technology'];

  const filteredEvents = mockEvents
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === 'all' || event.city === selectedCity;
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      
      return matchesSearch && matchesCity && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'attendees':
          return b.attendees - a.attendees;
        default:
          return 0;
      }
    });

  const handleBookParking = (eventId: number) => {
    navigate(`/event-booking/${eventId}`);
  };

  const formatDate = (dateStr: string, endDateStr?: string) => {
    const date = new Date(dateStr);
    const endDate = endDateStr ? new Date(endDateStr) : null;
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    
    if (endDate && endDate.getTime() !== date.getTime()) {
      return `${date.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
    }
    
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <Layout title="Events" showBackButton={true}>
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search events or venues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* City Filter */}
              <Select value={selectedCity} onValueChange={(value: 'all' | 'austin' | 'dallas') => setSelectedCity(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="austin">Austin</SelectItem>
                  <SelectItem value="dallas">Dallas</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="attendees">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1C1C1C]">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              Showing {selectedCity === 'all' ? 'all cities' : selectedCity} • {selectedCategory === 'all' ? 'all categories' : selectedCategory}
            </span>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-md">
              <div className="relative">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-[#FF6B00] text-white font-semibold">
                    {event.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{event.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="space-y-2">
                  <CardTitle className="text-lg font-bold group-hover:text-[#FF6B00] transition-colors line-clamp-2">
                    {event.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-[#FF6B00]" />
                      <span>{formatDate(event.date, event.endDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-[#FF6B00]" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-[#FF6B00]" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {event.description}
                </CardDescription>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees.toLocaleString()}</span>
                    </div>
                    <div className="text-sm font-semibold text-[#FF6B00]">
                      {event.price}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {event.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {feature}
                      </Badge>
                    ))}
                    {event.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        +{event.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleBookParking(event.id)}
                  className="w-full bg-[#FF6B00] hover:bg-[#e55a00] text-white font-semibold py-2.5 rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  Find Parking
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <Calendar className="w-16 h-16 mx-auto text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or check back later for new events.
                </p>
              </div>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSelectedCity('all');
                setSelectedCategory('all');
              }}>
                Clear Filters
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Events;

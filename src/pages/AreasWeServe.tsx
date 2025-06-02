
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Building, Car, Users } from 'lucide-react';

const austinAreas = [
  {
    id: 1,
    name: 'Downtown Austin',
    description: 'High demand for business meetings, dining, and entertainment venues.',
    highlights: ['Business District', 'Restaurants', 'Nightlife'],
    icon: Building,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 2,
    name: 'South by Southwest Area',
    description: 'Popular during SXSW and year-round for music venues and tech companies.',
    highlights: ['Music Venues', 'Tech Hub', 'Events'],
    icon: Users,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 3,
    name: 'University of Texas',
    description: 'Student housing area with high parking demand during events and classes.',
    highlights: ['Campus Events', 'Student Life', 'Sports'],
    icon: Car,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    id: 4,
    name: 'South Lamar District',
    description: 'Trendy area with food trucks, local businesses, and shopping.',
    highlights: ['Food Scene', 'Shopping', 'Local Business'],
    icon: MapPin,
    color: 'bg-green-100 text-green-600'
  }
];

const dallasAreas = [
  {
    id: 5,
    name: 'Downtown Dallas',
    description: 'Business district with high demand for corporate meetings and events.',
    highlights: ['Corporate Hub', 'Convention Center', 'Dining'],
    icon: Building,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 6,
    name: 'Deep Ellum',
    description: 'Arts district with live music venues, galleries, and nightlife.',
    highlights: ['Arts Scene', 'Live Music', 'Galleries'],
    icon: Users,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 7,
    name: 'Bishop Arts District',
    description: 'Trendy neighborhood with boutique shops, restaurants, and local events.',
    highlights: ['Boutique Shopping', 'Restaurants', 'Local Events'],
    icon: MapPin,
    color: 'bg-pink-100 text-pink-600'
  },
  {
    id: 8,
    name: 'AT&T Stadium Area',
    description: 'High demand during Cowboys games and major events.',
    highlights: ['Sports Events', 'Concerts', 'Major Events'],
    icon: Car,
    color: 'bg-red-100 text-red-600'
  }
];

const AreasWeServe = () => {
  const navigate = useNavigate();

  const handleFindParkingHere = (areaName: string) => {
    navigate('/find-parking', { state: { prefilledLocation: areaName } });
  };

  const AreaCard = ({ area, city }: { area: any, city: string }) => {
    const IconComponent = area.icon;
    
    return (
      <Card className="hover:shadow-lg transition-all duration-200 group">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg ${area.color} flex items-center justify-center`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg">{area.name}</CardTitle>
              <CardDescription>{city}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-[#606060]">{area.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {area.highlights.map((highlight: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-[#FF6B00]/10 text-[#FF6B00] rounded-full text-sm">
                {highlight}
              </span>
            ))}
          </div>
          
          <Button 
            onClick={() => handleFindParkingHere(area.name)}
            className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
          >
            Find Parking Here
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout title="Areas We Serve">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#1C1C1C] mb-4">
            We Serve Austin & Dallas
          </h2>
          <p className="text-[#606060] max-w-2xl mx-auto">
            Find convenient parking in the most popular neighborhoods and districts. 
            Our hosts provide affordable alternatives to expensive lots and garages.
          </p>
        </div>

        {/* Austin Areas */}
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1C1C1C]">Austin Areas</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {austinAreas.map((area) => (
              <AreaCard key={area.id} area={area} city="Austin, TX" />
            ))}
          </div>
        </section>

        {/* Dallas Areas */}
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-[#002F5F] rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1C1C1C]">Dallas Areas</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dallasAreas.map((area) => (
              <AreaCard key={area.id} area={area} city="Dallas, TX" />
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-[#FF6B00]/10 to-[#002F5F]/10 border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-[#1C1C1C] mb-4">
              Don't see your area?
            </h3>
            <p className="text-[#606060] mb-6 max-w-2xl mx-auto">
              We're constantly expanding to new neighborhoods in Austin and Dallas. 
              Browse all available parking spots or list your driveway to help us grow!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/find-parking')}
                className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
              >
                Browse All Parking
              </Button>
              <Button 
                onClick={() => navigate('/list-driveway')}
                variant="outline"
                className="border-[#002F5F] text-[#002F5F] hover:bg-[#002F5F] hover:text-white"
              >
                List Your Driveway
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AreasWeServe;

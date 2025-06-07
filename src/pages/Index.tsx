import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Car, DollarSign, Calendar, Star, Shield, Clock, Users, CheckCircle } from 'lucide-react';

const mockEvents = [{
  id: 1,
  name: 'Austin City Limits Music Festival',
  date: 'Oct 6-8, 2024',
  location: 'Zilker Park, Austin',
  image: '/lovable-uploads/eecdd7a6-4025-4ea9-af99-2f9f55b16e26.png',
  city: 'austin'
}, {
  id: 2,
  name: 'Dallas Cowboys vs Giants',
  date: 'Nov 24, 2024',
  location: 'AT&T Stadium, Dallas',
  image: '/lovable-uploads/d11bc2e9-7980-48e9-898d-070821a8114d.png',
  city: 'dallas'
}, {
  id: 3,
  name: 'South by Southwest (SXSW)',
  date: 'Mar 10-19, 2025',
  location: 'Downtown Austin',
  image: '/lovable-uploads/c842cc34-b312-4e4f-86aa-4d26f1afd234.png',
  city: 'austin'
}];

const Index = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<'all' | 'austin' | 'dallas'>('all');
  const filteredEvents = selectedCity === 'all' ? mockEvents : mockEvents.filter(event => event.city === selectedCity);
  
  const handleFindParking = () => {
    navigate('/find-parking');
  };
  
  const handleListDriveway = () => {
    navigate('/list-driveway');
  };

  return (
    <Layout showNavigation={true}>
      {/* Hero Banner Section */}
      <section className="relative h-96 bg-cover bg-center rounded-2xl mb-12 overflow-hidden" style={{
        backgroundImage: "url('/lovable-uploads/381960f7-fb23-44b9-b472-4411995747ae.png')"
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Private Parking in
              <span className="text-[#FF6B00] block">Near You</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Skip the expensive lots. Park in residential driveways near events, offices, and popular destinations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleFindParking} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <MapPin className="mr-2 h-5 w-5" />
                Find Parking
              </Button>
              <Button onClick={handleListDriveway} variant="outline" className="text-lg px-8 py-4 rounded-lg border-2 border-white hover:bg-white transition-all text-zinc-950">
                <DollarSign className="mr-2 h-5 w-5" />
                List My Driveway
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-12 mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1C1C1C]">Quick Access</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={handleFindParking}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-[#FF6B00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1C1C1C]">Find Nearby Parking</h3>
              <p className="text-[#606060]">Search for available parking spots in your area</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigate('/events')}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-[#FF6B00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1C1C1C]">View Events</h3>
              <p className="text-[#606060]">Discover upcoming events and find parking</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={handleListDriveway}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-[#FF6B00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1C1C1C]">List Your Spot</h3>
              <p className="text-[#606060]">Start earning money from your parking space</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1C1C1C] mb-4">Featured Events</h2>
          <p className="text-[#606060] mb-6">Find parking for these popular events</p>
          
          {/* City Filter Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button variant={selectedCity === 'all' ? 'default' : 'outline'} onClick={() => setSelectedCity('all')} className={selectedCity === 'all' ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90' : ''}>
              All Cities
            </Button>
            <Button variant={selectedCity === 'austin' ? 'default' : 'outline'} onClick={() => setSelectedCity('austin')} className={selectedCity === 'austin' ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90' : ''}>
              Austin
            </Button>
            <Button variant={selectedCity === 'dallas' ? 'default' : 'outline'} onClick={() => setSelectedCity('dallas')} className={selectedCity === 'dallas' ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90' : ''}>
              Dallas
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Card key={event.id} className="hover:shadow-lg transition-all duration-200 group">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{event.name}</CardTitle>
                <CardDescription className="space-y-2">
                  <div className="flex items-center space-x-2 text-[#606060]">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#606060]">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button onClick={() => navigate('/events')} className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
                  Find Parking
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Use Section */}
      <section className="py-16 bg-white rounded-2xl shadow-sm mb-12">
        <div className="px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1C1C1C]">Why Use Park In My Driveway?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1C1C1C]">Save Money</h3>
              <p className="text-[#606060]">Pay up to 70% less than traditional parking lots and garages.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1C1C1C]">Prime Locations</h3>
              <p className="text-[#606060]">Park closer to your destination in residential neighborhoods.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1C1C1C]">Safe & Secure</h3>
              <p className="text-[#606060]">All hosts are verified and spaces are well-maintained.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 mb-12">
        <div className="relative bg-cover bg-center rounded-2xl overflow-hidden" style={{
          backgroundImage: "url('/lovable-uploads/a5f5076f-e50c-466b-8153-0d845a52ec89.png')"
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-70" />
          <div className="relative p-12 text-white">
            <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#FF6B00] mb-2">500+</div>
                <div className="text-lg">Active Hosts</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#FF6B00] mb-2">10K+</div>
                <div className="text-lg">Successful Bookings</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#FF6B00] mb-2">98%</div>
                <div className="text-lg">Customer Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#FF6B00] mb-2">24/7</div>
                <div className="text-lg">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 mt-16 bg-[#002F5F] rounded-2xl text-white">
        <div className="px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-6 w-6 text-[#FF6B00]" />
                <span className="font-bold">Park In My Driveway</span>
              </div>
              <p className="text-gray-300">Making parking affordable and accessible in Austin and Dallas.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/find-parking" className="block text-gray-300 hover:text-white transition-colors">Find Parking</Link>
                <Link to="/events" className="block text-gray-300 hover:text-white transition-colors">Events</Link>
                <Link to="/areas" className="block text-gray-300 hover:text-white transition-colors">Areas We Serve</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-300 hover:text-white transition-colors">About Us</Link>
                <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">Contact Us</Link>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-300">
                <p>📧 support@parkinmydriveway.com</p>
                <p>📞 (512) 555-0123</p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Twitter</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Park In My Driveway. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;

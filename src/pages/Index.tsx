import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Users, Car, Star, ArrowRight } from 'lucide-react';

const Index = () => {
  // Mock data for featured events
  const featuredEvents = [
    {
      id: 1,
      title: "Downtown Music Festival",
      location: "Central Park, Los Angeles",
      date: "June 15, 2024",
      time: "6:00 PM - 11:00 PM",
      category: "Music",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Tech Conference 2024",
      location: "Convention Center, San Francisco",
      date: "June 20, 2024",
      time: "9:00 AM - 6:00 PM",
      category: "Technology",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Food & Wine Festival",
      location: "Waterfront District, San Diego",
      date: "June 25, 2024",
      time: "12:00 PM - 8:00 PM",
      category: "Food",
      image: "/placeholder.svg"
    }
  ];

  // Mock data for stats
  const stats = [
    { label: 'Parking Spots Available', value: '1,200+', icon: MapPin },
    { label: 'Events Covered', value: '300+', icon: Calendar },
    { label: 'Happy Users', value: '5,000+', icon: Users },
    { label: 'Cars Parked', value: '10,000+', icon: Car },
  ];

  return (
    <Layout showNavigation={true}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Find Parking Made Easy</h1>
            <p className="text-lg mb-8">
              Discover and book parking spots near you.
            </p>
            <Link to="/find-parking">
              <Button size="lg" className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
                Find Parking Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <stat.icon className="h-8 w-8 text-[#FF6B00] mb-3" />
                  <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1C1C1C] mb-4">Featured Events</h2>
            <p className="text-lg text-[#606060] max-w-2xl mx-auto">
              Discover upcoming events in your area and find convenient parking nearby
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:scale-105 transform">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#FF6B00] text-white">
                      {event.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-[#1C1C1C]">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-[#606060]">
                      <MapPin className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-[#606060]">
                      <Calendar className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-[#606060]">
                      <Clock className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      {event.time}
                    </div>
                  </div>

                  <Link to="/find-parking">
                    <Button className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
                      Find Parking
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/events">
              <Button variant="outline" size="lg" className="border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/10">
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1C1C] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-8 w-8 text-[#FF6B00]" />
                <span className="text-xl font-bold">Park In My Driveway</span>
              </div>
              <p className="text-gray-400 mb-4">
                Find convenient parking or rent out your driveway space.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/find-parking" className="hover:text-[#FF6B00] transition-colors">Find Parking</Link></li>
                <li><Link to="/list-driveway" className="hover:text-[#FF6B00] transition-colors">List Your Space</Link></li>
                <li><Link to="/events" className="hover:text-[#FF6B00] transition-colors">Events</Link></li>
                <li><Link to="/areas" className="hover:text-[#FF6B00] transition-colors">Areas We Serve</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-[#FF6B00] transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-[#FF6B00] transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Instagram</a></li>
                <li><Link to="/admin-login" className="hover:text-[#FF6B00] transition-colors">Admin Login</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Park In My Driveway. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;

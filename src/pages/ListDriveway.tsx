
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Calendar, Shield, Star, TrendingUp, Users } from 'lucide-react';

const ListDriveway = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLoginToStart = () => {
    navigate('/login', { state: { returnTo: '/host-dashboard' } });
  };

  const features = [
    {
      icon: DollarSign,
      title: 'Earn Extra Income',
      description: 'Make $100-500+ per month from your unused driveway space.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Set your own availability and pricing. Block dates when needed.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'All renters are verified. Insurance protection included.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Star,
      title: 'Easy Management',
      description: 'Simple dashboard to manage bookings and payments.',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Hosts' },
    { number: '$250', label: 'Average Monthly Earnings' },
    { number: '98%', label: 'Host Satisfaction Rate' },
    { number: '24/7', label: 'Customer Support' }
  ];

  if (user) {
    navigate('/host-dashboard');
    return null;
  }

  return (
    <Layout title="List My Driveway">
      <div className="space-y-12">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-[#FF6B00]/10 to-[#002F5F]/10 border-none">
          <CardContent className="p-12 text-center">
            <h1 className="text-4xl font-bold text-[#1C1C1C] mb-6">
              Earn Money with Your Parking Space
            </h1>
            <p className="text-xl text-[#606060] mb-8 max-w-2xl mx-auto">
              Turn your unused driveway into a source of income. Join hundreds of hosts 
              in Austin and Dallas who are earning extra money by sharing their parking spaces.
            </p>
            <Button 
              onClick={handleLoginToStart}
              className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white text-lg px-8 py-4 rounded-lg"
            >
              Login to Start Listing
            </Button>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-[#FF6B00] mb-2">{stat.number}</div>
                <div className="text-[#606060]">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <section>
          <h2 className="text-3xl font-bold text-[#1C1C1C] text-center mb-12">
            Why Host with Us?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#606060]">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-[#1C1C1C] text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6B00] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1C1C1C]">List Your Space</h3>
              <p className="text-[#606060]">
                Create your listing with photos, description, and pricing. 
                Our team will review and approve within 24 hours.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6B00] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1C1C1C]">Set Availability</h3>
              <p className="text-[#606060]">
                Use our calendar to set when your space is available. 
                Update anytime and block dates as needed.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6B00] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1C1C1C]">Earn Money</h3>
              <p className="text-[#606060]">
                Get paid automatically when someone books your space. 
                Track earnings and manage bookings from your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Requirements to Host</CardTitle>
            <CardDescription>Make sure your space meets these simple requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-[#1C1C1C]">Location Requirements:</h4>
                <ul className="space-y-2 text-[#606060]">
                  <li>✅ Located in Austin or Dallas metro area</li>
                  <li>✅ Safe and well-lit area</li>
                  <li>✅ Easy access for vehicles</li>
                  <li>✅ Clear of obstructions</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-[#1C1C1C]">Host Requirements:</h4>
                <ul className="space-y-2 text-[#606060]">
                  <li>✅ Valid government ID</li>
                  <li>✅ Property ownership or permission</li>
                  <li>✅ Bank account for payments</li>
                  <li>✅ Responsive communication</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-[#002F5F] text-white border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Earning?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join our community of hosts and start making money from your unused parking space today.
            </p>
            <Button 
              onClick={handleLoginToStart}
              className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white text-lg px-8 py-4"
            >
              Get Started Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ListDriveway;

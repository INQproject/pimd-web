
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, MapPin, TrendingUp, Plus, Settings } from 'lucide-react';

const HostDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const stats = [
    { title: 'Total Listings', value: '3', icon: MapPin, color: 'text-blue-600' },
    { title: 'Bookings Today', value: '2', icon: Calendar, color: 'text-green-600' },
    { title: 'This Month Earnings', value: '$245', icon: DollarSign, color: 'text-[#FF6B00]' },
    { title: 'Occupancy Rate', value: '78%', icon: TrendingUp, color: 'text-purple-600' }
  ];

  const recentBookings = [
    {
      id: 1,
      spotName: 'Downtown Driveway',
      renterName: 'John D.',
      date: '2024-03-15',
      time: '10:00 AM - 2:00 PM',
      amount: 32,
      status: 'confirmed'
    },
    {
      id: 2,
      spotName: 'Side Parking',
      renterName: 'Sarah M.',
      date: '2024-03-15',
      time: '6:00 PM - 10:00 PM',
      amount: 24,
      status: 'completed'
    }
  ];

  const listings = [
    {
      id: 1,
      name: 'Downtown Driveway',
      address: '123 Main St, Austin, TX',
      status: 'active',
      rate: '$8/hr',
      bookings: 12
    },
    {
      id: 2,
      name: 'Side Parking Space',
      address: '456 Oak Ave, Austin, TX',
      status: 'pending',
      rate: '$6/hr',
      bookings: 0
    }
  ];

  return (
    <Layout title="Host Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-[#FF6B00]/10 to-[#002F5F]/10 border-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#1C1C1C] mb-2">
                  Welcome back, {user.name}!
                </h2>
                <p className="text-[#606060]">
                  Manage your parking listings and track your earnings
                </p>
              </div>
              <Button 
                onClick={() => navigate('/add-parking')}
                className="bg-[#FF6B00] hover:bg-[#FF6B00]/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-[#606060]">{stat.title}</p>
                      <p className="text-2xl font-bold text-[#1C1C1C]">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest reservations for your spaces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-[#1C1C1C]">{booking.spotName}</h4>
                        <p className="text-sm text-[#606060]">Renter: {booking.renterName}</p>
                      </div>
                      <Badge 
                        variant={booking.status === 'completed' ? 'default' : 'secondary'}
                        className={booking.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-[#606060]">
                      <span>{booking.date} • {booking.time}</span>
                      <span className="font-semibold text-[#FF6B00]">${booking.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Listings */}
          <Card>
            <CardHeader>
              <CardTitle>My Listings</CardTitle>
              <CardDescription>Manage your parking spaces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-[#1C1C1C]">{listing.name}</h4>
                        <p className="text-sm text-[#606060]">{listing.address}</p>
                      </div>
                      <Badge 
                        variant={listing.status === 'active' ? 'default' : 'secondary'}
                        className={listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {listing.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#606060]">{listing.bookings} bookings</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-[#FF6B00]">{listing.rate}</span>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => navigate('/add-parking')}
                variant="outline" 
                className="w-full mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HostDashboard;

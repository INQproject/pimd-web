import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, MapPin, DollarSign, Star, Clock, Car, Settings } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'listings'>('info');

  if (!user) {
    navigate('/login');
    return null;
  }

  const mockBookings = [
    {
      id: 1,
      spotName: 'Downtown Austin Driveway',
      date: '2024-03-15',
      time: '9:00 AM - 5:00 PM',
      status: 'confirmed',
      price: 25
    },
    {
      id: 2,
      spotName: 'Phoenix Mall Parking',
      date: '2024-03-20',
      time: '2:00 PM - 8:00 PM',
      status: 'completed',
      price: 15
    }
  ];

  const mockListings = [
    {
      id: 1,
      name: 'My Downtown Spot',
      address: '456 Main St, Austin, TX',
      status: 'active',
      earnings: 150,
      bookings: 8
    }
  ];

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const renderMyInfo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-lg">{user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="text-lg">{user.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Member Since</label>
            <p className="text-lg">March 2024</p>
          </div>
          <div className="pt-4">
            <Button 
              onClick={handleChangePassword}
              variant="outline"
              className="w-full border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-4">
      {mockBookings.map((booking) => (
        <Card key={booking.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{booking.spotName}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{booking.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <Badge 
                  variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                  className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                >
                  {booking.status}
                </Badge>
                <p className="font-semibold text-lg">${booking.price}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderListings = () => (
    <div className="space-y-4">
      {mockListings.map((listing) => (
        <Card key={listing.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{listing.name}</h3>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.address}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Car className="w-4 h-4 text-blue-600" />
                    <span>{listing.bookings} bookings</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {listing.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-lg font-semibold text-green-600">
                  <DollarSign className="w-5 h-5" />
                  <span>{listing.earnings}</span>
                </div>
                <p className="text-sm text-gray-500">Total earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Layout title="My Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-[#FF6B00] to-[#FF6B00]/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="opacity-90">{user.email}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">4.8 rating</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'info'
                ? 'bg-white text-[#FF6B00] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Info
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'bookings'
                ? 'bg-white text-[#FF6B00] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'listings'
                ? 'bg-white text-[#FF6B00] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Listings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && renderMyInfo()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'listings' && renderListings()}
      </div>
    </Layout>
  );
};

export default Profile;

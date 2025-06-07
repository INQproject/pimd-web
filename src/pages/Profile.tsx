
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Calendar, Clock, Car, DollarSign, Edit, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Austin, TX 78701'
  });

  const mockBookings = [
    {
      id: 1,
      spotName: 'Downtown Austin Driveway',
      address: '123 Congress Ave, Austin, TX',
      date: '2024-12-15',
      time: '9:00 AM - 5:00 PM',
      price: 64,
      status: 'confirmed',
      vehicleNumber: 'ABC1234'
    },
    {
      id: 2,
      spotName: 'Deep Ellum Private Spot',
      address: '456 Elm St, Dallas, TX',
      date: '2024-12-18',
      time: '2:00 PM - 8:00 PM',
      price: 72,
      status: 'upcoming',
      vehicleNumber: 'XYZ5678'
    }
  ];

  const mockListings = [
    {
      id: 1,
      name: 'My Downtown Spot',
      address: '789 Oak Street, Austin, TX',
      price: 15,
      status: 'active',
      totalBookings: 23,
      earnings: 1840
    }
  ];

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="PROFILE">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-xl">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#1C1C1C]">{user?.name}</h1>
                <p className="text-[#606060]">{user?.email}</p>
                <Badge variant="secondary" className="mt-2">
                  {user?.role === 'host' ? 'Host' : 'Parker'}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>My Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              
              {isEditing && (
                <Button onClick={handleSaveProfile} className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90">
                  Save Changes
                </Button>
              )}
              
              {/* Forgot Password Button */}
              <Separator className="my-4" />
              <Button 
                variant="outline" 
                className="w-full border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mockBookings.length}</div>
                  <div className="text-sm text-blue-800">Total Bookings</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{mockListings.length}</div>
                  <div className="text-sm text-green-800">Active Listings</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    ${mockListings.reduce((sum, listing) => sum + listing.earnings, 0)}
                  </div>
                  <div className="text-sm text-orange-800">Total Earnings</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">4.8</div>
                  <div className="text-sm text-purple-800">Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your recent parking reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Car className="h-8 w-8 text-[#FF6B00]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1C1C1C]">{booking.spotName}</h4>
                      <div className="flex items-center space-x-2 text-sm text-[#606060]">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.address}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-[#606060] mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Car className="h-4 w-4" />
                          <span>{booking.vehicleNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[#1C1C1C]">${booking.price}</div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Listings (if user is a host) */}
        {user.role === 'host' && (
          <Card>
            <CardHeader>
              <CardTitle>My Listings</CardTitle>
              <CardDescription>Manage your parking spots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockListings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h4 className="font-semibold text-[#1C1C1C]">{listing.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-[#606060]">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.address}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-[#606060] mt-1">
                        <span>{listing.totalBookings} bookings</span>
                        <span>${listing.earnings} earned</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">{listing.status}</Badge>
                      <div className="text-right">
                        <div className="font-semibold text-[#FF6B00]">${listing.price}/hr</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </Layout>
  );
};

export default Profile;

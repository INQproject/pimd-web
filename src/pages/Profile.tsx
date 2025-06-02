
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Settings, Plus } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const mockBookings = [
    {
      id: 1,
      spotName: 'Downtown Austin Driveway',
      date: '2024-03-20',
      time: '2:00 PM - 4:00 PM',
      amount: 30,
      status: 'confirmed'
    },
    {
      id: 2,
      spotName: 'Safe Street Parking',
      date: '2024-03-15',
      time: '10:00 AM - 12:00 PM',
      amount: 24,
      status: 'completed'
    }
  ];

  const mockUploads = [
    {
      id: 1,
      name: 'My Driveway Spot',
      address: '123 Main St, Austin, TX',
      status: 'active',
      rate: '$15/hr',
      bookings: 8,
      earnings: '$450'
    },
    {
      id: 2,
      name: 'Side Yard Parking',
      address: '456 Oak Ave, Austin, TX',
      status: 'pending',
      rate: '$12/hr',
      bookings: 0,
      earnings: '$0'
    }
  ];

  return (
    <Layout title="My Profile">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Welcome, {user.name}!</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#606060]">Email: {user.email}</p>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="uploads">My Uploads</TabsTrigger>
            <TabsTrigger value="info">My Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Your Parking Bookings</h3>
              <Button onClick={() => navigate('/find-parking')} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90">
                Book More Parking
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{booking.spotName}</h4>
                        <div className="flex items-center space-x-4 text-sm text-[#606060] mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{booking.date}</span>
                          </div>
                          <span>{booking.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#FF6B00]">${booking.amount}</p>
                        <Badge 
                          variant={booking.status === 'completed' ? 'default' : 'secondary'}
                          className={booking.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="uploads" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Your Parking Listings</h3>
              <Button onClick={() => navigate('/list-driveway')} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90">
                <Plus className="w-4 h-4 mr-2" />
                Add New Listing
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockUploads.map((upload) => (
                <Card key={upload.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{upload.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-[#606060] mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{upload.address}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm">Rate: <span className="font-semibold text-[#FF6B00]">{upload.rate}</span></span>
                          <span className="text-sm">Bookings: <span className="font-semibold">{upload.bookings}</span></span>
                          <span className="text-sm">Earnings: <span className="font-semibold text-green-600">{upload.earnings}</span></span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={upload.status === 'active' ? 'default' : 'secondary'}
                          className={upload.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {upload.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {mockUploads.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-[#606060] mb-4">You haven't listed any parking spaces yet.</p>
                    <Button onClick={() => navigate('/list-driveway')} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90">
                      List Your First Parking Space
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="text-[#606060]">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <p className="text-[#606060]">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Account Type</label>
                  <p className="text-[#606060]">Standard User</p>
                </div>
                <Button variant="outline" className="mt-4">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;

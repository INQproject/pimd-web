import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, DollarSign, Plus, Lock, User, Clock } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedSpot, setSelectedSpot] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('upcoming');

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

  // Mock host booking history data
  const mockHostBookings = [
    {
      id: 1,
      spotName: 'My Driveway Spot',
      spotId: 1,
      date: '2024-03-25',
      timeSlot: '9:00 AM - 11:00 AM',
      duration: '2 hours',
      bookedBy: 'John Smith',
      bookedByEmail: 'john.smith@email.com',
      amount: 30,
      status: 'upcoming'
    },
    {
      id: 2,
      spotName: 'My Driveway Spot',
      spotId: 1,
      date: '2024-03-22',
      timeSlot: '2:00 PM - 5:00 PM',
      duration: '3 hours',
      bookedBy: 'Sarah Johnson',
      bookedByEmail: 'sarah.j@email.com',
      amount: 45,
      status: 'completed'
    },
    {
      id: 3,
      spotName: 'Side Yard Parking',
      spotId: 2,
      date: '2024-03-20',
      timeSlot: '10:00 AM - 12:00 PM',
      duration: '2 hours',
      bookedBy: 'Mike Davis',
      bookedByEmail: 'mike.davis@email.com',
      amount: 24,
      status: 'completed'
    },
    {
      id: 4,
      spotName: 'My Driveway Spot',
      spotId: 1,
      date: '2024-03-28',
      timeSlot: '1:00 PM - 4:00 PM',
      duration: '3 hours',
      bookedBy: 'Emma Wilson',
      bookedByEmail: 'emma.w@email.com',
      amount: 45,
      status: 'upcoming'
    }
  ];

  // Filter and sort bookings
  const filteredBookings = mockHostBookings
    .filter(booking => selectedSpot === 'all' || booking.spotId.toString() === selectedSpot)
    .sort((a, b) => {
      if (sortOrder === 'upcoming') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  // Group bookings by spot and date
  const groupedBookings = filteredBookings.reduce((acc, booking) => {
    const spotKey = booking.spotName;
    if (!acc[spotKey]) {
      acc[spotKey] = {};
    }
    if (!acc[spotKey][booking.date]) {
      acc[spotKey][booking.date] = [];
    }
    acc[spotKey][booking.date].push(booking);
    return acc;
  }, {} as Record<string, Record<string, typeof mockHostBookings>>);

  const handleManageAvailability = (listingId: number) => {
    navigate(`/manage-availability/${listingId}`);
  };

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="uploads">My Uploads</TabsTrigger>
            <TabsTrigger value="host-history">Host Booking History</TabsTrigger>
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
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleManageAvailability(upload.id)}
                                disabled={upload.status === 'pending'}
                                className={upload.status === 'pending' ? 'opacity-50' : ''}
                              >
                                {upload.status === 'pending' ? (
                                  <Lock className="h-3 w-3" />
                                ) : (
                                  <Calendar className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {upload.status === 'pending' 
                                ? 'Approval required to add slots' 
                                : 'Manage Availability'
                              }
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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

          <TabsContent value="host-history" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-semibold">Host Booking History</h3>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select value={selectedSpot} onValueChange={setSelectedSpot}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by spot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parking Spots</SelectItem>
                    {mockUploads.map((upload) => (
                      <SelectItem key={upload.id} value={upload.id.toString()}>
                        {upload.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {Object.keys(groupedBookings).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-[#606060] mb-4">No bookings found for your parking spots.</p>
                    <Button onClick={() => navigate('/list-driveway')} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90">
                      List Your First Parking Space
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                Object.entries(groupedBookings).map(([spotName, dateGroups]) => (
                  <div key={spotName} className="space-y-4">
                    <h4 className="text-lg font-semibold text-[#FF6B00] border-b border-gray-200 pb-2">
                      {spotName}
                    </h4>
                    
                    {Object.entries(dateGroups).map(([date, bookings]) => (
                      <div key={date} className="space-y-2">
                        <h5 className="text-md font-medium text-[#606060] flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h5>
                        
                        <div className="space-y-2 ml-6">
                          {bookings.map((booking) => (
                            <Card key={booking.id} className="shadow-sm">
                              <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center space-x-4 text-sm">
                                      <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4 text-[#606060]" />
                                        <span className="font-medium">{booking.timeSlot}</span>
                                      </div>
                                      <span className="text-[#606060]">({booking.duration})</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 text-sm">
                                      <User className="w-4 h-4 text-[#606060]" />
                                      <span className="font-medium">{booking.bookedBy}</span>
                                      <span className="text-[#606060]">({booking.bookedByEmail})</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                      <p className="font-semibold text-[#FF6B00] flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" />
                                        ${booking.amount}
                                      </p>
                                    </div>
                                    
                                    <Badge 
                                      variant={booking.status === 'completed' ? 'default' : 'secondary'}
                                      className={
                                        booking.status === 'completed' 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-blue-100 text-blue-800'
                                      }
                                    >
                                      {booking.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
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

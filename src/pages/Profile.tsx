
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, DollarSign, FileText, User, Lock } from 'lucide-react';

const mockBookings = [
  {
    id: 1,
    spotName: 'Downtown Austin Driveway',
    date: '2024-03-15',
    time: '10:00 AM - 12:00 PM',
    amount: 24,
    status: 'completed'
  },
  {
    id: 2,
    spotName: 'Deep Ellum Private Spot',
    date: '2024-03-20',
    time: '2:00 PM - 4:00 PM',
    amount: 18,
    status: 'upcoming'
  }
];

const mockUploads = [
  {
    id: 1,
    filename: 'payout_proof_march_2024.pdf',
    uploadDate: '2024-03-01',
    notes: 'Payout confirmation for February earnings',
    status: 'verified'
  },
  {
    id: 2,
    filename: 'bank_statement_feb_2024.pdf',
    uploadDate: '2024-02-28',
    notes: 'Bank statement showing received payments',
    status: 'pending'
  }
];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewReceipt = (bookingId: number) => {
    // Simulate opening receipt modal
    alert(`Opening receipt for booking #${bookingId}`);
  };

  return (
    <Layout title="My Profile">
      <div className="space-y-8">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge variant="secondary" className="mt-2">
                  {user.role === 'seeker' ? 'Spot Seeker' : 'Host'}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="uploads">My Uploads</TabsTrigger>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
          </TabsList>

          {/* My Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-[#FF6B00]" />
                  <span>My Parking Bookings</span>
                </CardTitle>
                <CardDescription>
                  View your current and past parking reservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockBookings.length > 0 ? (
                  <div className="space-y-4">
                    {mockBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-[#1C1C1C]">{booking.spotName}</h4>
                            <div className="flex items-center space-x-4 text-sm text-[#606060]">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{booking.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span>${booking.amount}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={booking.status === 'completed' ? 'default' : 'secondary'}
                              className={booking.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {booking.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewReceipt(booking.id)}
                            >
                              View Receipt
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-[#606060]">No bookings yet</p>
                    <Button 
                      onClick={() => navigate('/find-parking')}
                      className="mt-4 bg-[#FF6B00] hover:bg-[#FF6B00]/90"
                    >
                      Find Parking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Uploads Tab */}
          <TabsContent value="uploads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-[#FF6B00]" />
                  <span>Document Uploads</span>
                </CardTitle>
                <CardDescription>
                  Upload payout proofs and transaction documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockUploads.length > 0 ? (
                  <div className="space-y-4">
                    {mockUploads.map((upload) => (
                      <div key={upload.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-[#1C1C1C]">{upload.filename}</h4>
                            <p className="text-sm text-[#606060]">{upload.notes}</p>
                            <p className="text-xs text-gray-500">Uploaded: {upload.uploadDate}</p>
                          </div>
                          <Badge 
                            variant={upload.status === 'verified' ? 'default' : 'secondary'}
                            className={upload.status === 'verified' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {upload.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-[#606060] mb-4">Upload new document</p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="file-upload"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-[#606060] mb-4">No uploads yet</p>
                    <p className="text-sm text-gray-500">Upload payout proofs and transaction documents here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-[#FF6B00]" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={user.name} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} readOnly />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Input 
                    id="role" 
                    value={user.role === 'seeker' ? 'Spot Seeker' : 'Host'} 
                    readOnly 
                  />
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-[#1C1C1C] mb-4 flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Account Actions</span>
                  </h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Update Payment Method
                    </Button>
                    <Button 
                      onClick={handleLogout}
                      variant="destructive" 
                      className="w-full justify-start"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;


import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Search, Users, Eye, MapPin, Calendar, User, Check, X } from 'lucide-react';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 234-567-8901',
      status: 'active',
      joinDate: '2024-01-10',
      role: 'host',
      bookings: [
        { id: 1, event: 'Mall Shopping', slot: 'A-12', date: '2024-01-20', status: 'completed' },
        { id: 2, event: 'Concert Event', slot: 'B-05', date: '2024-01-25', status: 'completed' }
      ],
      listings: [
        { id: 1, title: 'Downtown Parking Spot', status: 'active', address: '123 Main St' },
        { id: 2, title: 'Shopping Mall Space', status: 'active', address: '456 Mall Ave' }
      ]
    },
    {
      id: 2,
      name: 'John Seeker',
      email: 'john@example.com',
      phone: '+1 234-567-8902',
      status: 'active',
      joinDate: '2024-01-08',
      role: 'seeker',
      bookings: [
        { id: 3, event: 'Airport Trip', slot: 'C-08', date: '2024-01-22', status: 'completed' },
        { id: 4, event: 'Business Meeting', slot: 'D-15', date: '2024-01-28', status: 'active' },
        { id: 5, event: 'Shopping Trip', slot: 'A-03', date: '2024-02-01', status: 'cancelled' }
      ],
      listings: []
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@example.com',
      phone: '+1 234-567-8903',
      status: 'suspended',
      joinDate: '2024-01-12',
      role: 'host',
      bookings: [],
      listings: [
        { id: 3, title: 'Airport Parking', status: 'suspended', address: '789 Airport Rd' }
      ]
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '+1 234-567-8904',
      status: 'active',
      joinDate: '2024-01-05',
      role: 'seeker',
      bookings: [
        { id: 6, event: 'University Event', slot: 'E-20', date: '2024-01-30', status: 'completed' },
        { id: 7, event: 'Medical Appointment', slot: 'F-12', date: '2024-02-05', status: 'active' }
      ],
      listings: []
    }
  ]);

  const toggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? {
        ...user,
        status: user.status === 'active' ? 'suspended' : 'active'
      } : user
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: "User Status Updated",
      description: `${user?.name} has been ${user?.status === 'active' ? 'suspended' : 'activated'}.`,
    });
  };

  const toggleListingStatus = (listingId: number) => {
    setUsers(prev => prev.map(user => ({
      ...user,
      listings: user.listings.map(listing =>
        listing.id === listingId ? {
          ...listing,
          status: listing.status === 'active' ? 'suspended' : 'active'
        } : listing
      )
    })));

    toast({
      title: "Listing Status Updated",
      description: "Listing status has been changed successfully.",
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Suspended</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Manage Users">
      <div className="space-y-6">
        {/* Search Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>All Users ({filteredUsers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Phone</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Account Status</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">{user.email}</td>
                      <td className="border border-gray-200 px-4 py-2">{user.phone}</td>
                      <td className="border border-gray-200 px-4 py-2">{getStatusBadge(user.status)}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleView(user)}
                          title="View Details"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* User Detail Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Details - {selectedUser?.name}</DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <Tabs defaultValue="user-info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="user-info">User Info</TabsTrigger>
                  <TabsTrigger value="booking-history">Booking History</TabsTrigger>
                  <TabsTrigger value="listed-spots">Listed Spots</TabsTrigger>
                </TabsList>
                
                <TabsContent value="user-info" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p><strong>Name:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Phone:</strong> {selectedUser.phone}</p>
                      </div>
                      <div>
                        <p><strong>Role:</strong> {selectedUser.role}</p>
                        <p><strong>Join Date:</strong> {selectedUser.joinDate}</p>
                        <p><strong>Status:</strong> {getStatusBadge(selectedUser.status)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 pt-4">
                      <span className="font-medium">Account Status:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Inactive</span>
                        <Switch 
                          checked={selectedUser.status === 'active'}
                          onCheckedChange={() => toggleUserStatus(selectedUser.id)}
                        />
                        <span className="text-sm">Active</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="booking-history" className="mt-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Booking History</h3>
                    {selectedUser.bookings.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                              <th className="border border-gray-200 px-4 py-2 text-left">Event</th>
                              <th className="border border-gray-200 px-4 py-2 text-left">Slot</th>
                              <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedUser.bookings.map((booking) => (
                              <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="border border-gray-200 px-4 py-2">{booking.date}</td>
                                <td className="border border-gray-200 px-4 py-2">{booking.event}</td>
                                <td className="border border-gray-200 px-4 py-2">{booking.slot}</td>
                                <td className="border border-gray-200 px-4 py-2">{getStatusBadge(booking.status)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-600">No booking history found.</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="listed-spots" className="mt-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Listed Parking Spots</h3>
                    {selectedUser.listings.length > 0 ? (
                      <div className="space-y-3">
                        {selectedUser.listings.map((listing) => (
                          <div key={listing.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">{listing.title}</span>
                                  {getStatusBadge(listing.status)}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{listing.address}</p>
                              </div>
                              <div className="flex space-x-2">
                                {listing.status === 'active' && (
                                  <Button 
                                    size="sm"
                                    onClick={() => toggleListingStatus(listing.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Suspend
                                  </Button>
                                )}
                                {listing.status === 'suspended' && (
                                  <Button 
                                    size="sm"
                                    onClick={() => toggleListingStatus(listing.id)}
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Activate
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No parking spots listed by this user.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

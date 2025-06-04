
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Car, Eye, Edit, Calendar, User, MapPin } from 'lucide-react';

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [bookings] = useState([
    {
      id: 1,
      bookingId: 'BK001',
      seeker: 'John Seeker',
      host: 'Sarah Johnson',
      spotName: 'Downtown Parking Spot',
      date: '2024-01-20',
      timeSlot: '09:00 - 17:00',
      vehicle: 'Toyota Camry (ABC-123)',
      amount: 45.00,
      status: 'active',
      createdBy: 'user',
      event: null
    },
    {
      id: 2,
      bookingId: 'BK002',
      seeker: 'Emma Wilson',
      host: 'Mike Chen',
      spotName: 'Mall Parking Space',
      date: '2024-01-22',
      timeSlot: '14:00 - 18:00',
      vehicle: 'Honda Civic (XYZ-789)',
      amount: 20.00,
      status: 'completed',
      createdBy: 'admin',
      event: 'Shopping Festival'
    },
    {
      id: 3,
      bookingId: 'BK003',
      seeker: 'Alex Brown',
      host: 'Sarah Johnson',
      spotName: 'Downtown Parking Spot',
      date: '2024-01-25',
      timeSlot: '10:00 - 16:00',
      vehicle: 'BMW X5 (DEF-456)',
      amount: 54.00,
      status: 'cancelled',
      createdBy: 'user',
      event: null
    }
  ]);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.seeker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.spotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="Booking Management">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
                <Car className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Today</p>
                  <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'active').length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">By Admin</p>
                  <p className="text-2xl font-bold">{bookings.filter(b => b.createdBy === 'admin').length}</p>
                </div>
                <User className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold">${bookings.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}</p>
                </div>
                <MapPin className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by booking ID, seeker, host, or spot..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                >
                  All Status
                </Button>
                <Button 
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('active')}
                >
                  Active
                </Button>
                <Button 
                  variant={statusFilter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('completed')}
                >
                  Completed
                </Button>
                <Button 
                  variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('cancelled')}
                >
                  Cancelled
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5" />
              <span>All Bookings ({filteredBookings.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">#{booking.bookingId}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        {booking.createdBy === 'admin' && (
                          <Badge variant="outline" className="border-purple-200 text-purple-800">
                            Created by Admin
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Seeker:</span> {booking.seeker}
                        </div>
                        <div>
                          <span className="font-medium">Host:</span> {booking.host}
                        </div>
                        <div>
                          <span className="font-medium">Spot:</span> {booking.spotName}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {booking.date}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {booking.timeSlot}
                        </div>
                        <div>
                          <span className="font-medium">Vehicle:</span> {booking.vehicle}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> ${booking.amount.toFixed(2)}
                        </div>
                        {booking.event && (
                          <div>
                            <span className="font-medium">Event:</span> {booking.event}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;

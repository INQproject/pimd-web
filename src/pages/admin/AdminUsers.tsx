
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Search, Users, MapPin } from 'lucide-react';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userType, setUserType] = useState('all'); // all, hosts, seekers
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'host',
      status: 'active',
      joinDate: '2024-01-10',
      totalListings: 3,
      totalBookings: 0,
      totalEarnings: 1250.00
    },
    {
      id: 2,
      name: 'John Seeker',
      email: 'john@example.com',
      role: 'seeker',
      status: 'active',
      joinDate: '2024-01-08',
      totalListings: 0,
      totalBookings: 12,
      totalSpent: 485.00
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'host',
      status: 'blocked',
      joinDate: '2024-01-12',
      totalListings: 1,
      totalBookings: 0,
      totalEarnings: 75.00
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma@example.com',
      role: 'seeker',
      status: 'active',
      joinDate: '2024-01-05',
      totalListings: 0,
      totalBookings: 8,
      totalSpent: 320.00
    }
  ]);

  const toggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? {
        ...user,
        status: user.status === 'active' ? 'blocked' : 'active'
      } : user
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = userType === 'all' || user.role === userType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'seeker': return 'bg-blue-100 text-blue-800';
      case 'host': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="User Management">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={userType === 'all' ? 'default' : 'outline'}
                  onClick={() => setUserType('all')}
                >
                  All Users
                </Button>
                <Button 
                  variant={userType === 'hosts' ? 'default' : 'outline'}
                  onClick={() => setUserType('hosts')}
                >
                  Hosts
                </Button>
                <Button 
                  variant={userType === 'seekers' ? 'default' : 'outline'}
                  onClick={() => setUserType('seekers')}
                >
                  Seekers
                </Button>
              </div>
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
            <div className="space-y-4">
              {filteredUsers.map(user => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Email:</span> {user.email}
                        </div>
                        <div>
                          <span className="font-medium">Joined:</span> {user.joinDate}
                        </div>
                        {user.role === 'host' ? (
                          <>
                            <div>
                              <span className="font-medium">Listings:</span> {user.totalListings}
                            </div>
                            <div>
                              <span className="font-medium">Earnings:</span> ${user.totalEarnings?.toFixed(2)}
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="font-medium">Bookings:</span> {user.totalBookings}
                            </div>
                            <div>
                              <span className="font-medium">Spent:</span> ${user.totalSpent?.toFixed(2)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Active</span>
                        <Switch 
                          checked={user.status === 'active'}
                          onCheckedChange={() => toggleUserStatus(user.id)}
                        />
                      </div>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      {user.role === 'host' && (
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4 mr-1" />
                          View Listings
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminUsers;

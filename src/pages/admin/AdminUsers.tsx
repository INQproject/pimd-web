
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const AdminUsers = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Seeker',
      email: 'seeker@example.com',
      role: 'seeker',
      status: 'active',
      joinDate: '2024-01-10',
      totalBookings: 5
    },
    {
      id: 2,
      name: 'Sarah Host',
      email: 'host@example.com',
      role: 'host',
      status: 'active',
      joinDate: '2024-01-08',
      totalListings: 2
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'seeker',
      status: 'blocked',
      joinDate: '2024-01-12',
      totalBookings: 1
    },
    {
      id: 4,
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'host',
      status: 'inactive',
      joinDate: '2024-01-05',
      totalListings: 1
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
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
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Joined:</span> {user.joinDate}
                    </p>
                    <p className="text-sm text-gray-600">
                      {user.role === 'seeker' ? (
                        <><span className="font-medium">Total Bookings:</span> {user.totalBookings}</>
                      ) : (
                        <><span className="font-medium">Total Listings:</span> {user.totalListings}</>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Active</span>
                      <Switch 
                        checked={user.status === 'active'}
                        onCheckedChange={() => toggleUserStatus(user.id)}
                      />
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AdminUsers;

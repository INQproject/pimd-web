
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const AdminParking = () => {
  const [parkingSpaces, setParkingSpaces] = useState([
    {
      id: 1,
      name: 'Downtown Driveway',
      host: 'Sarah Host',
      address: '123 Main St, City',
      status: 'pending',
      slots: 2,
      rate: '$15/hour'
    },
    {
      id: 2,
      name: 'Mall Parking',
      host: 'John Smith',
      address: '456 Mall Rd, City',
      status: 'active',
      slots: 3,
      rate: '$10/hour'
    },
    {
      id: 3,
      name: 'Office Complex',
      host: 'Jane Doe',
      address: '789 Business Ave, City',
      status: 'inactive',
      slots: 1,
      rate: '$20/hour'
    }
  ]);

  const handleApprove = (id: number) => {
    setParkingSpaces(prev => prev.map(space => 
      space.id === id ? { ...space, status: 'active' } : space
    ));
  };

  const handleReject = (id: number) => {
    setParkingSpaces(prev => prev.map(space => 
      space.id === id ? { ...space, status: 'rejected' } : space
    ));
  };

  const toggleStatus = (id: number) => {
    setParkingSpaces(prev => prev.map(space => 
      space.id === id ? { 
        ...space, 
        status: space.status === 'active' ? 'inactive' : 'active' 
      } : space
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Manage Parking Listings">
      <Card>
        <CardHeader>
          <CardTitle>All Parking Spaces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parkingSpaces.map(space => (
              <div key={space.id} className="border rounded-lg p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{space.name}</h3>
                      <Badge className={getStatusColor(space.status)}>
                        {space.status.charAt(0).toUpperCase() + space.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Host:</span> {space.host}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Address:</span> {space.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Slots:</span> {space.slots} | 
                      <span className="font-medium"> Rate:</span> {space.rate}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {space.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="btn-primary"
                          onClick={() => handleApprove(space.id)}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleReject(space.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : space.status !== 'rejected' && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Active</span>
                        <Switch 
                          checked={space.status === 'active'}
                          onCheckedChange={() => toggleStatus(space.id)}
                        />
                      </div>
                    )}
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

export default AdminParking;


import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { MapPin, Search, Eye, Check, X, Edit } from 'lucide-react';

const AdminListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock listings data
  const listings = [
    {
      id: 1,
      title: 'Downtown Parking Spot',
      host: 'Sarah Johnson',
      hostEmail: 'sarah@example.com',
      address: '123 Main St, Downtown',
      price: 15,
      status: 'pending',
      created: '2024-01-20',
      spaces: 2
    },
    {
      id: 2,
      title: 'Mall Parking Space',
      host: 'Mike Chen',
      hostEmail: 'mike@example.com',
      address: '456 Mall Ave, Shopping Center',
      price: 12,
      status: 'active',
      created: '2024-01-18',
      spaces: 1
    },
    {
      id: 3,
      title: 'Airport Long-term Parking',
      host: 'Emma Wilson',
      hostEmail: 'emma@example.com',
      address: '789 Airport Rd, Terminal',
      price: 8,
      status: 'suspended',
      created: '2024-01-15',
      spaces: 5
    },
    {
      id: 4,
      title: 'University Campus Parking',
      host: 'David Brown',
      hostEmail: 'david@example.com',
      address: '321 University Ave, Campus',
      price: 10,
      status: 'active',
      created: '2024-01-22',
      spaces: 3
    }
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: number) => {
    toast({
      title: "Listing Approved",
      description: "The parking listing has been approved and is now active.",
    });
  };

  const handleReject = (id: number) => {
    toast({
      title: "Listing Rejected",
      description: "The parking listing has been rejected.",
      variant: "destructive",
    });
  };

  const handleSuspend = (id: number) => {
    toast({
      title: "Listing Suspended",
      description: "The parking listing has been suspended.",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Manage Listings">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by title, host, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Parking Listings ({filteredListings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Listing</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Host</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Address</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Price/hr</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Spaces</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Created</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{listing.title}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <div>
                          <div className="font-medium">{listing.host}</div>
                          <div className="text-sm text-gray-600">{listing.hostEmail}</div>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">{listing.address}</td>
                      <td className="border border-gray-200 px-4 py-2 font-medium">${listing.price}</td>
                      <td className="border border-gray-200 px-4 py-2">{listing.spaces}</td>
                      <td className="border border-gray-200 px-4 py-2">{getStatusBadge(listing.status)}</td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">{listing.created}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          {listing.status === 'pending' && (
                            <>
                              <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleApprove(listing.id)}>
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleReject(listing.id)}>
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          {listing.status === 'active' && (
                            <Button size="sm" variant="destructive" onClick={() => handleSuspend(listing.id)}>
                              Suspend
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminListings;

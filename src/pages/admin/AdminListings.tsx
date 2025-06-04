
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { MapPin, Search, Eye, Check, X } from 'lucide-react';

const AdminListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Mock listings data with status management
  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'Downtown Parking Spot',
      host: 'Sarah Johnson',
      hostEmail: 'sarah@example.com',
      address: '123 Main St, Downtown',
      price: 15,
      status: 'pending',
      created: '2024-01-20',
      spaces: 2,
      description: 'Secure covered parking space in downtown area, perfect for commuters.',
      features: ['Covered', 'Security Camera', 'EV Charging']
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
      spaces: 1,
      description: 'Convenient parking near shopping center with easy access.',
      features: ['Covered', 'Well-lit', 'Close to entrance']
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
      spaces: 5,
      description: 'Affordable long-term parking solution for travelers.',
      features: ['Long-term rates', 'Shuttle service', 'Security patrol']
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
      spaces: 3,
      description: 'Student-friendly parking near university campus.',
      features: ['Student discount', 'Monthly rates', 'Safe area']
    }
  ]);

  const filterListings = (status) => {
    return listings.filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = status === 'all' || listing.status === status;
      return matchesSearch && matchesStatus;
    });
  };

  const handleView = (listing) => {
    setSelectedListing(listing);
    setIsViewModalOpen(true);
  };

  const handleStatusChange = (id, newStatus) => {
    setListings(prev => prev.map(listing => 
      listing.id === id ? { ...listing, status: newStatus } : listing
    ));

    let toastMessage = '';
    switch (newStatus) {
      case 'active':
        toastMessage = 'Listing has been activated successfully.';
        break;
      case 'suspended':
        toastMessage = 'Listing has been suspended.';
        break;
      case 'rejected':
        toastMessage = 'Listing has been rejected.';
        break;
    }

    toast({
      title: "Status Updated",
      description: toastMessage,
      variant: newStatus === 'suspended' || newStatus === 'rejected' ? "destructive" : "default",
    });

    setIsViewModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Suspended</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderListingsTable = (filteredListings) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Listing</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Host</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Location</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Price/hr</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
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
              <td className="border border-gray-200 px-4 py-2">{getStatusBadge(listing.status)}</td>
              <td className="border border-gray-200 px-4 py-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleView(listing)}
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
  );

  return (
    <AdminLayout title="Manage Listings">
      <div className="space-y-6">
        {/* Search Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Search Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, host, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Parking Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Listings ({filterListings('all').length})</TabsTrigger>
                <TabsTrigger value="active">Active ({filterListings('active').length})</TabsTrigger>
                <TabsTrigger value="suspended">Suspended ({filterListings('suspended').length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({filterListings('pending').length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                {renderListingsTable(filterListings('all'))}
              </TabsContent>
              
              <TabsContent value="active" className="mt-4">
                {renderListingsTable(filterListings('active'))}
              </TabsContent>
              
              <TabsContent value="suspended" className="mt-4">
                {renderListingsTable(filterListings('suspended'))}
              </TabsContent>
              
              <TabsContent value="pending" className="mt-4">
                {renderListingsTable(filterListings('pending'))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* View Listing Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Listing Details</DialogTitle>
            </DialogHeader>
            
            {selectedListing && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedListing.title}</h3>
                    <p className="text-gray-600">{selectedListing.address}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(selectedListing.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Host:</strong> {selectedListing.host}</p>
                    <p><strong>Email:</strong> {selectedListing.hostEmail}</p>
                    <p><strong>Price:</strong> ${selectedListing.price}/hr</p>
                  </div>
                  <div>
                    <p><strong>Spaces:</strong> {selectedListing.spaces}</p>
                    <p><strong>Created:</strong> {selectedListing.created}</p>
                  </div>
                </div>
                
                <div>
                  <p><strong>Description:</strong></p>
                  <p className="text-gray-600">{selectedListing.description}</p>
                </div>
                
                <div>
                  <p><strong>Features:</strong></p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedListing.features.map((feature, index) => (
                      <Badge key={index} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <div className="flex space-x-2">
                {selectedListing?.status === 'active' && (
                  <Button 
                    onClick={() => handleStatusChange(selectedListing.id, 'suspended')}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                )}
                
                {selectedListing?.status === 'suspended' && (
                  <Button 
                    onClick={() => handleStatusChange(selectedListing.id, 'active')}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
                
                {selectedListing?.status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => handleStatusChange(selectedListing.id, 'active')}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleStatusChange(selectedListing.id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminListings;

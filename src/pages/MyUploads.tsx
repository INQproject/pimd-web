
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import AdvancedCalendar from '@/components/AdvancedCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MapPin, DollarSign, Edit, Trash2, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Slot {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  status: 'available' | 'booked' | 'disabled';
}

interface DaySlots {
  [key: string]: Slot[];
}

const MyUploads = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [listings] = useState([
    {
      id: 1,
      spotName: 'Downtown Driveway - Prime Location',
      address: '123 Main St, Downtown LA',
      rate: '$15/hour',
      status: 'approved'
    },
    {
      id: 2,
      spotName: 'Secure Garage Space',
      address: '456 Business Ave, LA',
      rate: '$20/hour',
      status: 'pending'
    },
    {
      id: 3,
      spotName: 'Residential Driveway',
      address: '789 Oak Street, LA',
      rate: '$12/hour',
      status: 'approved'
    }
  ]);

  // Mock calendar data
  const [calendarSlots] = useState<DaySlots>({
    '2024-01-15': [
      { id: '1', title: 'Front Yard', startTime: '09:00', endTime: '17:00', capacity: 3, booked: 1, status: 'available' },
      { id: '2', title: 'Main Driveway', startTime: '08:00', endTime: '18:00', capacity: 2, booked: 2, status: 'booked' }
    ],
    '2024-01-16': [
      { id: '3', title: 'Front Yard', startTime: '09:00', endTime: '17:00', capacity: 3, booked: 0, status: 'available' }
    ],
    '2024-01-17': [
      { id: '4', title: 'Main Driveway', startTime: '08:00', endTime: '18:00', capacity: 2, booked: 0, status: 'disabled' }
    ],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleEdit = (listingId: number) => {
    console.log('Editing listing:', listingId);
  };

  const handleDelete = (listingId: number) => {
    console.log('Deleting listing:', listingId);
  };

  const handleAddNew = () => {
    navigate('/list-driveway');
  };

  const handleSlotsChange = (slots: DaySlots) => {
    console.log('Calendar slots updated:', slots);
  };

  const handleCalendarSave = () => {
    console.log('Calendar saved');
  };

  return (
    <Layout title="My Uploads">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Your Parking Listings</h2>
            <p className="text-gray-600 mt-1">Manage your driveway listings and track their status</p>
          </div>
          <Button 
            onClick={handleAddNew}
            className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Listing
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4">
            {/* Listings Grid */}
            {listings.map((listing) => (
              <Card key={listing.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-lg">{listing.spotName}</h3>
                        <Badge className={`${getStatusColor(listing.status)} flex items-center`}>
                          {getStatusIcon(listing.status)}
                          <span className="ml-1">
                            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {listing.address}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {listing.rate}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(listing.id)}
                        className="flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/calendar/${listing.id}`)}
                        className="flex items-center"
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Calendar
                      </Button>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(listing.id)}
                        className="flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty State */}
            {listings.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start earning by listing your driveway or parking space.
                  </p>
                  <Button 
                    onClick={handleAddNew}
                    className="bg-[#FF6B00] hover:bg-[#FF6B00]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Listing
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Status Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                    <span className="text-gray-600">Your listing is live and accepting bookings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                    <span className="text-gray-600">Under review, will be live once approved</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <AdvancedCalendar
              initialSlots={calendarSlots}
              onSlotsChange={handleSlotsChange}
              onSave={handleCalendarSave}
              showHeader={true}
              compactMode={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyUploads;

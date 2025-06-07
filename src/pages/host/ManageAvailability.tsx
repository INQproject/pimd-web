
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, DollarSign, Plus, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data for the parking listing
const mockListing = {
  id: 1,
  name: 'Downtown Austin Driveway',
  address: '123 Congress Ave, Austin, TX',
  price: 15,
  image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400',
  description: 'Secure private driveway in the heart of downtown Austin.',
  amenities: ['CCTV', 'Well-lit', '24/7 Access']
};

// Time slot types
type SlotStatus = 'available' | 'booked';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  status: SlotStatus;
  capacity: number;
  bookedCount: number;
}

const ManageAvailability = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      startTime: '8:00 AM',
      endTime: '12:00 PM',
      date: new Date().toISOString().split('T')[0],
      status: 'available',
      capacity: 2,
      bookedCount: 0
    },
    {
      id: '2',
      startTime: '1:00 PM',
      endTime: '6:00 PM',
      date: new Date().toISOString().split('T')[0],
      status: 'booked',
      capacity: 2,
      bookedCount: 2
    }
  ]);

  if (!user) {
    navigate('/login');
    return null;
  }

  // Generate next 30 days for date selection
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return dates;
  };

  const dateOptions = generateDateOptions();

  // Filter slots for selected date
  const filteredSlots = timeSlots.filter(slot => slot.date === selectedDate);

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      date: selectedDate,
      status: 'available',
      capacity: 1,
      bookedCount: 0
    };
    
    setTimeSlots([...timeSlots, newSlot]);
    toast({
      title: "Time slot added",
      description: "New time slot has been added to your availability."
    });
  };

  const removeTimeSlot = (slotId: string) => {
    const slotToRemove = timeSlots.find(slot => slot.id === slotId);
    if (slotToRemove?.status === 'booked') {
      toast({
        title: "Cannot remove booked slot",
        description: "This time slot has existing bookings and cannot be removed.",
        variant: "destructive"
      });
      return;
    }
    
    setTimeSlots(timeSlots.filter(slot => slot.id !== slotId));
    toast({
      title: "Time slot removed",
      description: "Time slot has been removed from your availability."
    });
  };

  const updateSlotStatus = (slotId: string, newStatus: SlotStatus) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === slotId 
        ? { ...slot, status: newStatus }
        : slot
    ));
  };

  const getStatusColor = (status: SlotStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Layout title="Manage Availability" showBackButton={true}>
      <div className="space-y-6">
        {/* Listing Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <img 
                src={mockListing.image} 
                alt={mockListing.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">{mockListing.name}</h2>
                <div className="flex items-center space-x-2 text-[#606060] mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{mockListing.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-[#FF6B00]" />
                  <span className="font-semibold text-[#FF6B00]">${mockListing.price}/hour</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-[#FF6B00]" />
              <span>Select Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Time Slots Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-[#FF6B00]" />
                <span>Time Slots for {new Date(selectedDate).toLocaleDateString()}</span>
              </CardTitle>
              <Button 
                onClick={addTimeSlot}
                className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredSlots.length === 0 ? (
              <div className="text-center py-8 text-[#606060]">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No time slots configured for this date.</p>
                <p className="text-sm">Click "Add Slot" to create your first time slot.</p>
              </div>
            ) : (
              filteredSlots.map((slot) => (
                <Card key={slot.id} className="border-l-4 border-l-[#FF6B00]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="font-semibold text-[#1C1C1C]">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <Badge className={getStatusColor(slot.status)}>
                            {slot.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-[#606060]">
                          <div>
                            <span className="font-medium">Capacity:</span> {slot.capacity} vehicles
                          </div>
                          <div>
                            <span className="font-medium">Booked:</span> {slot.bookedCount} / {slot.capacity}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={slot.status} 
                          onValueChange={(value: SlotStatus) => updateSlotStatus(slot.id, value)}
                          disabled={slot.status === 'booked'}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="booked">Booked</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(slot.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={slot.status === 'booked'}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#FF6B00] mb-1">
                {timeSlots.filter(slot => slot.status === 'available').length}
              </div>
              <div className="text-sm text-[#606060]">Available Slots</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {timeSlots.filter(slot => slot.status === 'booked').length}
              </div>
              <div className="text-sm text-[#606060]">Booked Slots</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                ${timeSlots.filter(slot => slot.status === 'booked').length * mockListing.price}
              </div>
              <div className="text-sm text-[#606060]">Total Earnings</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ManageAvailability;

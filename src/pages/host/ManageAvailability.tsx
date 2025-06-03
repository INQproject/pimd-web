import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, Plus, Edit, Trash2, X, CheckCircle, AlertTriangle, HelpCircle, Phone, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mockDriveways = [
  {
    id: '1',
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    totalSpots: 5,
    availableSpots: 3,
    rates: {
      hourly: 15,
      daily: 50,
      weekly: 300,
      monthly: 1000,
    },
    images: [
      'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=200',
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=200',
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=200',
    ],
    description: 'Secure and convenient parking in downtown Austin.',
    amenities: ['CCTV', 'Well-lit', '24/7 Access'],
  },
  {
    id: '2',
    name: 'South Congress Parking Lot',
    address: '456 S Congress Ave, Austin, TX',
    totalSpots: 20,
    availableSpots: 10,
    rates: {
      hourly: 10,
      daily: 40,
      weekly: 250,
      monthly: 900,
    },
    images: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=200',
      'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=200',
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=200',
    ],
    description: 'Large parking lot on South Congress with easy access to shops and restaurants.',
    amenities: ['Covered', 'Electric Vehicle Charging'],
  },
];

const timeOptions = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
];

const generateDateRange = (startDate: Date, endDate: Date) => {
  const dateRange = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dateRange;
};

type SlotStatus = 'available' | 'booked' | 'cancelled';

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  available: number;
  status: SlotStatus;
  price: number;
}

const ManageAvailability = () => {
  const { user } = useAuth();
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotStartTime, setNewSlotStartTime] = useState('');
  const [newSlotEndTime, setNewSlotEndTime] = useState('');
  const [newSlotCapacity, setNewSlotCapacity] = useState('');
  const [newSlotPrice, setNewSlotPrice] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [slotToCancel, setSlotToCancel] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateRange, setDateRange] = useState<Date[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/manage-availability/${listingId}`, context: 'availability' } });
      return;
    }

    // Mock time slots data
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const initialTimeSlots: TimeSlot[] = [
      {
        id: '1',
        date: today.toISOString().split('T')[0],
        startTime: '9:00 AM',
        endTime: '5:00 PM',
        capacity: 3,
        available: 3,
        status: 'available',
        price: 10,
      },
      {
        id: '2',
        date: tomorrow.toISOString().split('T')[0],
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        capacity: 5,
        available: 2,
        status: 'booked',
        price: 12,
      },
    ]
    setTimeSlots(initialTimeSlots);
  }, [user, navigate, listingId]);

  const handleDateRangeChange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const range = generateDateRange(start, end);
      setDateRange(range);
    }
  };

  const handleAddSlot = () => {
    setIsAddingSlot(true);
  };

  const handleCancelAddSlot = () => {
    setIsAddingSlot(false);
    setNewSlotDate('');
    setNewSlotStartTime('');
    setNewSlotEndTime('');
    setNewSlotCapacity('');
    setNewSlotPrice('');
  };

  const handleConfirmAddSlot = () => {
    if (!newSlotDate || !newSlotStartTime || !newSlotEndTime || !newSlotCapacity || !newSlotPrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the slot details.",
        variant: "destructive",
      });
      return;
    }

    const newSlot: TimeSlot = {
      id: Math.random().toString(36).substr(2, 9),
      date: newSlotDate,
      startTime: newSlotStartTime,
      endTime: newSlotEndTime,
      capacity: parseInt(newSlotCapacity),
      available: parseInt(newSlotCapacity),
      status: 'available',
      price: parseFloat(newSlotPrice),
    };

    setTimeSlots(prev => [...prev, newSlot]);
    setIsAddingSlot(false);
    setNewSlotDate('');
    setNewSlotStartTime('');
    setNewSlotEndTime('');
    setNewSlotCapacity('');
    setNewSlotPrice('');

    toast({
      title: "New Slot Added",
      description: "The new parking slot has been added successfully.",
    });
  };

  const confirmCancelSlot = (slotId: string) => {
    setTimeSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, status: 'cancelled' as SlotStatus, available: 0 }
        : slot
    ));
    setSlotToCancel(null);
    toast({
      title: "Slot Cancelled",
      description: "The parking slot has been cancelled successfully.",
    });
  };

  const handleCancelSlot = (slotId: string) => {
    setSlotToCancel(slotId);
  };

  const handleConfirmEdit = (slotId: string) => {
    navigate(`/edit-availability/${slotId}`);
  };

  return (
    <Layout title="Manage Availability">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Support Message */}
        <Alert className="bg-blue-50 border-blue-200">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="font-medium mb-2">If you're facing any issues while listing your driveway or booking a parking spot, please contact our support team.</div>
            <div className="flex flex-col sm:flex-row gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>Phone: (123) 456-7890</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>Email: support@parkinmydriveway.com</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Manage Your Parking Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date Range Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleDateRangeChange} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90">
              Apply Date Range
            </Button>

            {/* Add New Time Slot Button */}
            <Button onClick={handleAddSlot} className="bg-green-500 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Time Slot
            </Button>

            {/* Add New Time Slot Form */}
            {isAddingSlot && (
              <Card className="bg-gray-50">
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newSlotDate">Date</Label>
                      <Input
                        type="date"
                        id="newSlotDate"
                        value={newSlotDate}
                        onChange={(e) => setNewSlotDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newSlotStartTime">Start Time</Label>
                      <Select value={newSlotStartTime} onValueChange={setNewSlotStartTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="newSlotEndTime">End Time</Label>
                      <Select value={newSlotEndTime} onValueChange={setNewSlotEndTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select end time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="newSlotCapacity">Capacity</Label>
                      <Input
                        type="number"
                        id="newSlotCapacity"
                        placeholder="e.g., 5"
                        value={newSlotCapacity}
                        onChange={(e) => setNewSlotCapacity(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newSlotPrice">Price</Label>
                      <Input
                        type="number"
                        id="newSlotPrice"
                        placeholder="e.g., 10"
                        value={newSlotPrice}
                        onChange={(e) => setNewSlotPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={handleCancelAddSlot}>
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmAddSlot} className="bg-green-500 hover:bg-green-700">
                      Add Slot
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Time Slots List */}
            {timeSlots.length === 0 ? (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">No time slots available. Please add a time slot.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {timeSlots.map((slot) => (
                  <Card key={slot.id} className="border">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{slot.date} - {slot.startTime} to {slot.endTime}</span>
                        <div>
                          {slot.status === 'available' && (
                            <Badge variant="outline">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Available
                            </Badge>
                          )}
                          {slot.status === 'booked' && (
                            <Badge variant="secondary">
                              <Clock className="h-4 w-4 mr-2" />
                              Booked
                            </Badge>
                          )}
                          {slot.status === 'cancelled' && (
                            <Badge variant="destructive">
                              <X className="h-4 w-4 mr-2" />
                              Cancelled
                            </Badge>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Capacity</Label>
                        <div>{slot.capacity}</div>
                      </div>
                      <div>
                        <Label>Available</Label>
                        <div>{slot.available}</div>
                      </div>
                      <div>
                        <Label>Price</Label>
                        <div>${slot.price}</div>
                      </div>
                    </CardContent>
                    <div className="flex justify-end p-4 space-x-2">
                      {slot.status !== 'cancelled' && (
                        <>
                          <Button size="sm" onClick={() => handleConfirmEdit(slot.id)} className="bg-blue-500 hover:bg-blue-700">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleCancelSlot(slot.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                    {slotToCancel === slot.id && (
                      <Alert variant="destructive">
                        Are you sure you want to cancel this slot?
                        <div className="flex justify-end space-x-2 mt-2">
                          <Button variant="ghost" onClick={() => setSlotToCancel(null)}>
                            Nevermind
                          </Button>
                          <Button variant="destructive" onClick={() => confirmCancelSlot(slot.id)}>
                            Confirm Cancel
                          </Button>
                        </div>
                      </Alert>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ManageAvailability;

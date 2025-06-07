import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, DollarSign, Plus, Edit, Trash2, Lock, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Availability Calendar Component
const AvailabilityCalendar = ({ 
  selectedDates, 
  onDateToggle, 
  year = new Date().getFullYear(), 
  month = new Date().getMonth() 
}: {
  selectedDates: string[];
  onDateToggle: (date: string) => void;
  year?: number;
  month?: number;
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isDateSelected = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return selectedDates.includes(dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateToggle(dateStr);
  };

  const isPastDate = (day: number) => {
    const date = new Date(year, month, day);
    return date < today;
  };

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">{monthNames[month]} {year}</h3>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2"></div>
        ))}
        
        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const selected = isDateSelected(day);
          const past = isPastDate(day);
          
          return (
            <button
              key={day}
              onClick={() => !past && handleDateClick(day)}
              disabled={past}
              className={`
                p-2 text-sm rounded-md transition-colors
                ${past 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : selected 
                    ? 'bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90' 
                    : 'hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface TimeSlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  capacity: number;
  status: 'available' | 'booked';
  booked?: number;
}

const ManageAvailability = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState({
    name: '',
    startTime: '',
    endTime: '',
    capacity: 1
  });
  const [showAddSlot, setShowAddSlot] = useState(false);

  // Mock time slots
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      name: 'Morning Slot',
      startTime: '8:00 AM',
      endTime: '12:00 PM',
      capacity: 2,
      status: 'available'
    },
    {
      id: '2',
      name: 'Afternoon Slot',
      startTime: '1:00 PM',
      endTime: '5:00 PM',
      capacity: 1,
      status: 'booked',
      booked: 1
    },
    {
      id: '3',
      name: 'Evening Slot',
      startTime: '6:00 PM',
      endTime: '10:00 PM',
      capacity: 3,
      status: 'available'
    }
  ]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleDateToggle = useCallback((date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  }, []);

  const handleSlotEdit = (slotId: string, field: string, value: string | number) => {
    setTimeSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, [field]: value }
        : slot
    ));
  };

  const handleDeleteSlot = (slotId: string) => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== slotId));
    toast({
      title: "Slot deleted",
      description: "Time slot has been removed successfully.",
    });
  };

  const handleAddSlot = () => {
    if (!newSlot.name || !newSlot.startTime || !newSlot.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all slot details.",
        variant: "destructive"
      });
      return;
    }

    const slot: TimeSlot = {
      id: Date.now().toString(),
      name: newSlot.name,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      capacity: newSlot.capacity,
      status: 'available'
    };

    setTimeSlots(prev => [...prev, slot]);
    setNewSlot({ name: '', startTime: '', endTime: '', capacity: 1 });
    setShowAddSlot(false);
    
    toast({
      title: "Slot added",
      description: "New time slot has been added successfully.",
    });
  };

  const handleSaveAvailability = () => {
    toast({
      title: "Availability updated",
      description: `Updated availability for ${selectedDates.length} date(s) and ${timeSlots.length} time slot(s).`,
    });
  };

  const timeOptions = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
    '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
  ];

  return (
    <Layout title="Manage Availability" showBackButton={true}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-[#FF6B00] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Manage Your Parking Availability</h1>
                <p className="opacity-90">Listing ID: {listingId}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${timeSlots.length * 50}</div>
                <div className="text-sm opacity-90">Potential Monthly Earnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#FF6B00]" />
                <span>Select Available Dates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AvailabilityCalendar 
                selectedDates={selectedDates}
                onDateToggle={handleDateToggle}
              />
              <div className="mt-4 text-sm text-gray-600">
                <p>Selected dates: {selectedDates.length}</p>
                <p className="text-xs mt-1">Click on dates to toggle availability</p>
              </div>
            </CardContent>
          </Card>

          {/* Time Slots Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-[#FF6B00]" />
                  <span>Time Slots</span>
                </div>
                <Button
                  onClick={() => setShowAddSlot(!showAddSlot)}
                  size="sm"
                  className="bg-[#FF6B00] hover:bg-[#FF6B00]/90"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slot
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Slot Form */}
              {showAddSlot && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Slot Name</Label>
                        <Input
                          value={newSlot.name}
                          onChange={(e) => setNewSlot(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Morning Slot"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Capacity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={newSlot.capacity}
                          onChange={(e) => setNewSlot(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Start Time</Label>
                        <Select value={newSlot.startTime} onValueChange={(value) => setNewSlot(prev => ({ ...prev, startTime: value }))}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Start" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">End Time</Label>
                        <Select value={newSlot.endTime} onValueChange={(value) => setNewSlot(prev => ({ ...prev, endTime: value }))}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="End" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddSlot} size="sm" className="bg-[#FF6B00] hover:bg-[#FF6B00]/90">
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button onClick={() => setShowAddSlot(false)} size="sm" variant="outline">
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Existing Time Slots */}
              {timeSlots.map((slot) => (
                <Card key={slot.id} className={`border ${slot.status === 'booked' ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {editingSlot === slot.id ? (
                          <div className="space-y-2">
                            <Input
                              value={slot.name}
                              onChange={(e) => handleSlotEdit(slot.id, 'name', e.target.value)}
                              className="h-8 text-sm font-medium"
                            />
                            <div className="grid grid-cols-3 gap-2">
                              <Select value={slot.startTime} onValueChange={(value) => handleSlotEdit(slot.id, 'startTime', value)}>
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map(time => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select value={slot.endTime} onValueChange={(value) => handleSlotEdit(slot.id, 'endTime', value)}>
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map(time => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                min="1"
                                value={slot.capacity}
                                onChange={(e) => handleSlotEdit(slot.id, 'capacity', parseInt(e.target.value) || 1)}
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium">{slot.name}</h4>
                              <Badge variant={slot.status === 'available' ? 'default' : 'secondary'}>
                                {slot.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {slot.startTime} - {slot.endTime} • {slot.capacity} spot{slot.capacity > 1 ? 's' : ''}
                              {slot.booked && ` • ${slot.booked} booked`}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {slot.status === 'booked' ? (
                          <Lock className="h-4 w-4 text-gray-400" />
                        ) : editingSlot === slot.id ? (
                          <>
                            <Button
                              onClick={() => setEditingSlot(null)}
                              size="sm"
                              className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 h-8 px-2"
                            >
                              <Save className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => setEditingSlot(null)}
                              size="sm"
                              variant="outline"
                              className="h-8 px-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => setEditingSlot(slot.id)}
                              size="sm"
                              variant="outline"
                              className="h-8 px-2"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteSlot(slot.id)}
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSaveAvailability}
            className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-8 py-3 text-lg"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Availability Changes
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ManageAvailability;

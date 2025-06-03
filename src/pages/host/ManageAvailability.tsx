
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Edit, Trash2, Lock, ChevronLeft, ChevronRight, Calendar, Clock, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalSpots: number;
  availableSpots: number;
  notes?: string;
  isBooked: boolean;
}

const ManageAvailability = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0)); // January 2024
  const [showSlotForm, setShowSlotForm] = useState(false);
  
  const [slots, setSlots] = useState<Slot[]>([
    {
      id: '1',
      date: '2024-01-15',
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      totalSpots: 3,
      availableSpots: 3,
      notes: 'Main driveway',
      isBooked: false
    },
    {
      id: '2',
      date: '2024-01-15',
      startTime: '6:00 PM',
      endTime: '10:00 PM',
      totalSpots: 2,
      availableSpots: 0,
      isBooked: true
    },
    {
      id: '3',
      date: '2024-01-16',
      startTime: '8:00 AM',
      endTime: '6:00 PM',
      totalSpots: 5,
      availableSpots: 4,
      isBooked: false
    }
  ]);

  const [newSlot, setNewSlot] = useState({
    startTime: '',
    endTime: '',
    totalSpots: '1',
    notes: ''
  });

  // Time options for dropdowns
  const timeOptions = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
  ];

  // Generate compact calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const hasSlots = slots.some(slot => slot.date === dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      days.push({ day, dateStr, hasSlots, isToday });
    }
    
    return days;
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setShowSlotForm(true);
    setNewSlot({ startTime: '', endTime: '', totalSpots: '1', notes: '' });
  };

  const validateSlot = () => {
    if (!selectedDate || !newSlot.startTime || !newSlot.endTime) {
      toast({
        title: "Error",
        description: "Please fill in start time and end time.",
        variant: "destructive"
      });
      return false;
    }

    // Check if end time is after start time
    const startIndex = timeOptions.indexOf(newSlot.startTime);
    const endIndex = timeOptions.indexOf(newSlot.endTime);
    
    if (endIndex <= startIndex) {
      toast({
        title: "Error",
        description: "End time must be after start time.",
        variant: "destructive"
      });
      return false;
    }

    // Check for overlapping slots
    const existingSlots = slots.filter(slot => slot.date === selectedDate);
    const hasOverlap = existingSlots.some(slot => {
      const existingStart = timeOptions.indexOf(slot.startTime);
      const existingEnd = timeOptions.indexOf(slot.endTime);
      return (startIndex < existingEnd && endIndex > existingStart);
    });

    if (hasOverlap) {
      toast({
        title: "Error",
        description: "This time slot overlaps with an existing slot.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const addNewSlot = () => {
    if (!validateSlot()) return;

    const totalSpots = parseInt(newSlot.totalSpots) || 1;
    
    const newSlotData: Slot = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      totalSpots,
      availableSpots: totalSpots,
      notes: newSlot.notes || undefined,
      isBooked: false
    };

    setSlots(prev => [...prev, newSlotData]);
    setNewSlot({ startTime: '', endTime: '', totalSpots: '1', notes: '' });
    setShowSlotForm(false);
    
    toast({
      title: "Slot Added",
      description: "New time slot has been added successfully.",
    });
  };

  const deleteSlot = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (slot?.isBooked) {
      toast({
        title: "Cannot Delete",
        description: "This slot has bookings and cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    setSlots(prev => prev.filter(slot => slot.id !== slotId));
    toast({
      title: "Slot Deleted",
      description: "Time slot has been removed.",
    });
  };

  const markWholeDay = () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date first.",
        variant: "destructive"
      });
      return;
    }

    const defaultSlot: Slot = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      startTime: '8:00 AM',
      endTime: '8:00 PM',
      totalSpots: 2,
      availableSpots: 2,
      notes: 'All day availability',
      isBooked: false
    };

    setSlots(prev => [...prev, defaultSlot]);
    toast({
      title: "Whole Day Added",
      description: "8:00 AM - 8:00 PM slot added for the selected date.",
    });
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSlotsByDate = () => {
    const groupedSlots: { [key: string]: Slot[] } = {};
    slots.forEach(slot => {
      if (!groupedSlots[slot.date]) {
        groupedSlots[slot.date] = [];
      }
      groupedSlots[slot.date].push(slot);
    });
    return groupedSlots;
  };

  const calendarDays = generateCalendarDays();
  const selectedDateSlots = slots.filter(slot => slot.date === selectedDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const slotsByDate = getSlotsByDate();

  return (
    <Layout title="Manage Availability">
      <div className="max-w-5xl mx-auto space-y-6 p-4">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Profile</span>
        </Button>

        {/* Header */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Manage Availability - Listing #{listingId}
            </CardTitle>
            <p className="text-sm text-gray-600">Click any date to add availability slots</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compact Calendar */}
          <div className="lg:col-span-2">
            <Card className="shadow-md rounded-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" onClick={prevMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-1 text-xs font-medium text-gray-500">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((dayData, index) => (
                    <div key={index} className="aspect-square">
                      {dayData ? (
                        <button
                          onClick={() => handleDateClick(dayData.dateStr)}
                          className={`w-full h-full text-sm rounded-md hover:bg-gray-100 relative border transition-colors flex flex-col items-center justify-center ${
                            selectedDate === dayData.dateStr 
                              ? 'bg-orange-500 text-white border-orange-500' 
                              : dayData.isToday 
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-xs font-medium">{dayData.day}</span>
                          {dayData.hasSlots && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          )}
                        </button>
                      ) : (
                        <div className="w-full h-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Quick Add Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={markWholeDay}
                variant="outline" 
                className="w-full text-sm"
                disabled={!selectedDate}
              >
                <Clock className="mr-2 h-4 w-4" />
                Mark Whole Day
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-sm"
                disabled={!selectedDate}
              >
                <Copy className="mr-2 h-4 w-4" />
                Repeat for Week
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-sm"
                disabled={!selectedDate}
              >
                <Copy className="mr-2 h-4 w-4" />
                Repeat for Month
              </Button>
              {selectedDate && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border">
                  <p className="text-sm font-medium text-orange-800">
                    Selected: {formatDate(selectedDate)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Inline Slot Form */}
        {showSlotForm && selectedDate && (
          <Collapsible open={showSlotForm} onOpenChange={setShowSlotForm}>
            <CollapsibleContent>
              <Card className="shadow-md rounded-lg border-orange-200 border-2">
                <CardHeader className="pb-3 bg-orange-50">
                  <CardTitle className="text-lg flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Slot for {formatDate(selectedDate)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <select
                        id="startTime"
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select start time</option>
                        {timeOptions.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <select
                        id="endTime"
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select end time</option>
                        {timeOptions.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="totalSpots">Number of Spots</Label>
                      <Input
                        id="totalSpots"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={newSlot.totalSpots}
                        onChange={(e) => setNewSlot(prev => ({ ...prev, totalSpots: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        placeholder="Special instructions"
                        value={newSlot.notes}
                        onChange={(e) => setNewSlot(prev => ({ ...prev, notes: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={addNewSlot} 
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Slot
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSlotForm(false)}
                      className="px-6"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Slots List by Date */}
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>All Time Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.keys(slotsByDate).length === 0 ? (
                <p className="text-gray-500 text-center py-8">No slots added yet. Click on a date above to add your first slot.</p>
              ) : (
                Object.entries(slotsByDate)
                  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                  .map(([date, dateSlots]) => (
                    <div key={date} className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-semibold text-lg mb-3 text-gray-800">
                        {formatDate(date)}
                      </h3>
                      <div className="space-y-3">
                        {dateSlots.map(slot => (
                          <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <p className="font-medium">{slot.startTime} - {slot.endTime}</p>
                                  <p className="text-sm text-gray-600">
                                    {slot.availableSpots}/{slot.totalSpots} spots available
                                  </p>
                                  {slot.notes && (
                                    <p className="text-xs text-gray-500 mt-1">{slot.notes}</p>
                                  )}
                                </div>
                                <div>
                                  {slot.isBooked ? (
                                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                                      🔒 Has Bookings
                                    </Badge>
                                  ) : (
                                    <Badge variant="default" className="bg-green-100 text-green-700">
                                      ✅ Available
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                disabled={slot.isBooked}
                                className={slot.isBooked ? 'opacity-50' : ''}
                              >
                                {slot.isBooked ? <Lock className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => deleteSlot(slot.id)}
                                disabled={slot.isBooked}
                                className={slot.isBooked ? 'opacity-50' : ''}
                              >
                                {slot.isBooked ? <Lock className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ManageAvailability;

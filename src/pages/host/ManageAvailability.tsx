
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Edit, Trash2, Lock, ChevronLeft, ChevronRight, Calendar, Clock, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

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
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0)); // January 2024
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
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
      const isSelected = selectedDates.includes(dateStr);
      const daySlots = slots.filter(slot => slot.date === dateStr);
      days.push({ day, dateStr, hasSlots, isToday, isSelected, daySlots });
    }
    
    return days;
  };

  const handleDateClick = (dateStr: string) => {
    if (multiSelectMode) {
      setSelectedDates(prev => 
        prev.includes(dateStr) 
          ? prev.filter(d => d !== dateStr)
          : [...prev, dateStr]
      );
    } else {
      // Single date selection for immediate slot creation
      setSelectedDates([dateStr]);
      setShowSlotForm(true);
      setNewSlot({ startTime: '', endTime: '', totalSpots: '1', notes: '' });
    }
  };

  const clearAllSelectedDates = () => {
    setSelectedDates([]);
  };

  const validateSlot = (targetDates: string[]) => {
    if (!newSlot.startTime || !newSlot.endTime) {
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

    // Check for overlapping slots and remove conflicting dates
    const validDates = targetDates.filter(date => {
      const existingSlots = slots.filter(slot => slot.date === date);
      const hasOverlap = existingSlots.some(slot => {
        const existingStart = timeOptions.indexOf(slot.startTime);
        const existingEnd = timeOptions.indexOf(slot.endTime);
        return (startIndex < existingEnd && endIndex > existingStart);
      });

      if (hasOverlap) {
        // Remove this date from selectedDates
        setSelectedDates(prev => prev.filter(d => d !== date));
        return false;
      }
      return true;
    });

    if (validDates.length !== targetDates.length) {
      const conflictCount = targetDates.length - validDates.length;
      toast({
        title: "Conflicts Removed",
        description: `${conflictCount} date(s) removed due to overlapping slots.`,
        variant: "destructive"
      });
    }

    return validDates.length > 0;
  };

  const addNewSlot = () => {
    if (selectedDates.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one date.",
        variant: "destructive"
      });
      return;
    }

    const validDates = selectedDates.filter(date => {
      const existingSlots = slots.filter(slot => slot.date === date);
      const startIndex = timeOptions.indexOf(newSlot.startTime);
      const endIndex = timeOptions.indexOf(newSlot.endTime);
      
      return !existingSlots.some(slot => {
        const existingStart = timeOptions.indexOf(slot.startTime);
        const existingEnd = timeOptions.indexOf(slot.endTime);
        return (startIndex < existingEnd && endIndex > existingStart);
      });
    });

    if (!validateSlot(validDates)) return;

    const totalSpots = parseInt(newSlot.totalSpots) || 1;
    const newSlots: Slot[] = [];
    
    validDates.forEach(date => {
      const newSlotData: Slot = {
        id: Math.random().toString(36).substr(2, 9),
        date,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        totalSpots,
        availableSpots: totalSpots,
        notes: newSlot.notes || undefined,
        isBooked: false
      };
      newSlots.push(newSlotData);
    });

    setSlots(prev => [...prev, ...newSlots]);
    setNewSlot({ startTime: '', endTime: '', totalSpots: '1', notes: '' });
    setShowSlotForm(false);
    setSelectedDates([]);
    
    toast({
      title: "Slots Added",
      description: `Slot added to ${validDates.length} date${validDates.length !== 1 ? 's' : ''} successfully.`,
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

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDates([]);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDates([]);
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
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const slotsByDate = getSlotsByDate();

  return (
    <Layout title="Manage Availability">
      <div className="max-w-6xl mx-auto space-y-6 p-4">
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
            <p className="text-sm text-gray-600">
              {multiSelectMode 
                ? 'Multi-select mode: Click dates to select multiple, then add slots'
                : 'Single-select mode: Click any date to add a slot immediately'
              }
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="multi-select" className="text-sm">Multi-Select</Label>
                      <Switch
                        id="multi-select"
                        checked={multiSelectMode}
                        onCheckedChange={(checked) => {
                          setMultiSelectMode(checked);
                          setSelectedDates([]);
                          setShowSlotForm(false);
                        }}
                      />
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
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
                          className={`w-full h-full text-sm rounded-md hover:bg-gray-100 relative border transition-colors flex flex-col items-center justify-center group ${
                            dayData.isSelected
                              ? 'bg-orange-500 text-white border-orange-500' 
                              : dayData.isToday 
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          title={dayData.hasSlots ? `${dayData.daySlots.length} slot(s): ${dayData.daySlots.map(s => `${s.startTime}-${s.endTime} (${s.availableSpots}/${s.totalSpots})`).join(', ')}` : ''}
                        >
                          <span className="text-xs font-medium">{dayData.day}</span>
                          {dayData.hasSlots && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          )}
                          {dayData.isSelected && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            </div>
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

          {/* Selected Dates & Slot Form */}
          <div className="space-y-4">
            {/* Selected Dates Preview */}
            {(selectedDates.length > 0 || multiSelectMode) && (
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      📅 Selected Dates
                    </CardTitle>
                    {selectedDates.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllSelectedDates}
                        className="text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {selectedDates.length === 0 ? (
                    <p className="text-sm text-gray-500">No dates selected</p>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedDates.map(date => (
                        <div key={date} className="flex items-center justify-between p-2 bg-orange-50 rounded-md">
                          <span className="text-sm">{formatDate(date).split(',')[0]}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDates(prev => prev.filter(d => d !== date))}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedDates.length > 0 && (
                    <Button
                      onClick={() => setShowSlotForm(true)}
                      className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Slot for {selectedDates.length} Date{selectedDates.length !== 1 ? 's' : ''}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Mode: <Badge variant="outline">{multiSelectMode ? 'Multi-Select' : 'Single-Select'}</Badge>
                </p>
                <div className="text-sm text-gray-600">
                  {multiSelectMode 
                    ? "Click multiple dates, then create slots for all selected dates at once."
                    : "Click any date to immediately create a slot for that day."
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Slot Creation Form */}
        {showSlotForm && selectedDates.length > 0 && (
          <Card className="shadow-md border-orange-200 border-2">
            <CardHeader className="pb-3 bg-orange-50">
              <CardTitle className="text-lg flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Slot to {selectedDates.length} Date{selectedDates.length !== 1 ? 's' : ''}
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
                  Add Slot{selectedDates.length !== 1 ? 's' : ''}
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
        )}

        {/* Slots List by Date */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>All Time Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.keys(slotsByDate).length === 0 ? (
                <p className="text-gray-500 text-center py-8">No slots added yet. Use the calendar above to add your first slots.</p>
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

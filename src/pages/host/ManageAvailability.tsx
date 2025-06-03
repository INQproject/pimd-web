
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Edit, Trash2, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: 'available' | 'booked';
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
      notes: 'Main driveway',
      status: 'available',
      isBooked: false
    },
    {
      id: '2',
      date: '2024-01-15',
      startTime: '6:00 PM',
      endTime: '10:00 PM',
      status: 'booked',
      isBooked: true
    },
    {
      id: '3',
      date: '2024-01-16',
      startTime: '8:00 AM',
      endTime: '6:00 PM',
      status: 'available',
      isBooked: false
    }
  ]);

  const [newSlot, setNewSlot] = useState({
    startTime: '',
    endTime: '',
    notes: ''
  });

  // Generate calendar days for current month
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
    setNewSlot({ startTime: '', endTime: '', notes: '' });
  };

  const addNewSlot = () => {
    if (!selectedDate || !newSlot.startTime || !newSlot.endTime) {
      toast({
        title: "Error",
        description: "Please fill in start time and end time.",
        variant: "destructive"
      });
      return;
    }

    const newSlotData: Slot = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      notes: newSlot.notes || undefined,
      status: 'available',
      isBooked: false
    };

    setSlots(prev => [...prev, newSlotData]);
    setNewSlot({ startTime: '', endTime: '', notes: '' });
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
        description: "This slot is already booked and cannot be deleted.",
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

  const toggleSlotAvailability = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (slot?.isBooked) return;
    
    setSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, status: slot.status === 'available' ? 'available' : 'available' }
        : slot
    ));
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

  const calendarDays = generateCalendarDays();
  const selectedDateSlots = slots.filter(slot => slot.date === selectedDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <Layout title="Manage Availability">
      <div className="max-w-4xl mx-auto space-y-6 p-4">
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
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Manage Availability - Listing #{listingId}</CardTitle>
            <p className="text-sm text-gray-600">Click any date to add availability</p>
          </CardHeader>
        </Card>

        {/* Compact Calendar */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
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
                <div key={day} className="p-2 text-xs font-medium text-gray-500">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayData, index) => (
                <div key={index} className="aspect-square">
                  {dayData ? (
                    <button
                      onClick={() => handleDateClick(dayData.dateStr)}
                      className={`w-full h-full text-sm rounded hover:bg-gray-100 relative border transition-colors flex items-center justify-center ${
                        selectedDate === dayData.dateStr 
                          ? 'bg-orange-500 text-white' 
                          : dayData.isToday 
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'border-gray-200'
                      }`}
                    >
                      {dayData.day}
                      {dayData.hasSlots && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
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

        {/* Inline Slot Form */}
        {showSlotForm && selectedDate && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Add Slot for {formatDate(selectedDate)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
                      const ampm = i < 12 ? 'AM' : 'PM';
                      return (
                        <option key={i} value={`${hour}:00 ${ampm}`}>
                          {hour}:00 {ampm}
                        </option>
                      );
                    })}
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
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
                      const ampm = i < 12 ? 'AM' : 'PM';
                      return (
                        <option key={i} value={`${hour}:00 ${ampm}`}>
                          {hour}:00 {ampm}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special notes or instructions"
                  value={newSlot.notes}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-1"
                  rows={2}
                />
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
        )}

        {/* Slots for Selected Date */}
        {selectedDate && selectedDateSlots.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Slots for {formatDate(selectedDate)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedDateSlots.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{slot.startTime} - {slot.endTime}</p>
                      {slot.notes && (
                        <p className="text-sm text-gray-600 mt-1">{slot.notes}</p>
                      )}
                      <div className="mt-2">
                        {slot.isBooked ? (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            🔒 Booked
                          </Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-100 text-green-700">
                            ✅ Available
                          </Badge>
                        )}
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
            </CardContent>
          </Card>
        )}

        {/* All Slots Overview */}
        <Card>
          <CardHeader>
            <CardTitle>All Time Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {slots.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No slots added yet. Click on a date above to add your first slot.</p>
              ) : (
                slots.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{slot.date}</p>
                          <p className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</p>
                          {slot.notes && (
                            <p className="text-xs text-gray-500 mt-1">{slot.notes}</p>
                          )}
                        </div>
                        <div>
                          {slot.isBooked ? (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                              🔒 Booked
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

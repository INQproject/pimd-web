
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Plus, Edit, Trash2, Lock, ArrowLeft, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Calendar = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<'individual' | 'week' | 'month'>('individual');
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [newSlot, setNewSlot] = useState({
    startTime: '',
    endTime: ''
  });

  // Mock data for verified parking spots
  const parkingSpots = [
    { id: '1', name: 'Downtown Driveway - Main Entrance' },
    { id: '2', name: 'Main Street Parking - Side Lot' },
    { id: '3', name: 'Suburban Home - Front Driveway' }
  ];

  const [slots, setSlots] = useState([
    { id: 1, spotId: listingId, date: '2024-01-15', startTime: '9:00 AM', endTime: '5:00 PM', available: true, booked: false },
    { id: 2, spotId: listingId, date: '2024-01-15', startTime: '6:00 PM', endTime: '10:00 PM', available: true, booked: true },
    { id: 3, spotId: listingId, date: '2024-01-16', startTime: '8:00 AM', endTime: '6:00 PM', available: true, booked: false },
    { id: 4, spotId: listingId, date: '2024-01-17', startTime: '9:00 AM', endTime: '3:00 PM', available: true, booked: true },
  ]);

  const selectedSpotName = parkingSpots.find(spot => spot.id === listingId)?.name || 'Unknown Parking Spot';

  const months = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Generate days for current month (simplified for demo)
    for (let day = 1; day <= 31; day++) {
      const dateStr = `2024-01-${day.toString().padStart(2, '0')}`;
      days.push({
        date: dateStr,
        day: day,
        hasSlots: slots.some(slot => slot.date === dateStr),
        isSelected: selectedDates.includes(dateStr)
      });
    }
    return days;
  };

  const generateMonthDates = (month: number, year: number) => {
    const dates = [];
    const daysInMonth = getDaysInMonth(month, year);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      dates.push(dateStr);
    }
    return dates;
  };

  const handleDateClick = (dateStr: string) => {
    if (selectionMode === 'individual') {
      setSelectedDates(prev => 
        prev.includes(dateStr) 
          ? prev.filter(d => d !== dateStr)
          : [...prev, dateStr]
      );
    }
  };

  const handleWeekSelection = (weekNumber: number) => {
    if (selectionMode === 'week') {
      const startDay = (weekNumber - 1) * 7 + 1;
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const day = startDay + i;
        if (day <= 31) {
          weekDates.push(`2024-01-${day.toString().padStart(2, '0')}`);
        }
      }
      setSelectedDates(weekDates);
    }
  };

  const handleMonthSelection = () => {
    if (selectionMode === 'month') {
      const monthDates = generateMonthDates(selectedMonth, selectedYear);
      setSelectedDates(monthDates);
      
      toast({
        title: "Month Selected",
        description: `Selected all dates for ${months[selectedMonth].label} ${selectedYear} (${monthDates.length} days)`,
      });
    }
  };

  const addBulkSlots = () => {
    if (!newSlot.startTime || !newSlot.endTime || selectedDates.length === 0) {
      toast({
        title: "Error",
        description: "Please select dates and time slots",
        variant: "destructive"
      });
      return;
    }

    const newSlots = selectedDates.map(date => ({
      id: Math.max(...slots.map(s => s.id)) + Math.random(),
      spotId: listingId!,
      date: date,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      available: true,
      booked: false
    }));

    setSlots(prev => [...prev, ...newSlots]);
    setNewSlot({ startTime: '', endTime: '' });
    setSelectedDates([]);
    setIsAddSlotOpen(false);
    
    toast({
      title: "Success",
      description: `Added slots for ${selectedDates.length} dates`,
    });
  };

  const toggleSlotAvailability = (slotId: number) => {
    const slot = slots.find(s => s.id === slotId);
    if (slot?.booked) return;
    
    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, available: !slot.available } : slot
    ));
  };

  const deleteSlot = (slotId: number) => {
    const slot = slots.find(s => s.id === slotId);
    if (slot?.booked) return;
    
    setSlots(prev => prev.filter(slot => slot.id !== slotId));
  };

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Availability updated successfully",
    });
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const getSlotStatusBadge = (slot: any) => {
    if (slot.booked) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-700">🔒 Booked</Badge>;
    } else if (slot.available) {
      return <Badge variant="default" className="bg-green-100 text-green-700">🟩 Available</Badge>;
    } else {
      return <Badge variant="destructive" className="bg-red-100 text-red-700">🟥 Unavailable</Badge>;
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <Layout title={`Manage Calendar - ${selectedSpotName}`}>
      <div className="space-y-6">
        {/* Header with Save/Cancel */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Profile</span>
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Selection Mode Tabs */}
        <Tabs value={selectionMode} onValueChange={(value) => {
          setSelectionMode(value as 'individual' | 'week' | 'month');
          setSelectedDates([]);
        }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="individual">Individual Dates</TabsTrigger>
            <TabsTrigger value="week">Weekly Selection</TabsTrigger>
            <TabsTrigger value="month">Monthly Selection</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Select Individual Dates
                  </div>
                  {selectedDates.length > 0 && (
                    <Badge variant="secondary">{selectedDates.length} dates selected</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 font-medium text-sm">{day}</div>
                  ))}
                  {calendarDays.map(({ date, day, hasSlots, isSelected }) => (
                    <button
                      key={date}
                      onClick={() => handleDateClick(date)}
                      className={`p-2 text-sm rounded hover:bg-gray-100 relative border ${
                        isSelected 
                          ? 'bg-[#FF6B00] text-white border-[#FF6B00]' 
                          : hasSlots
                          ? 'bg-blue-50 border-blue-200'
                          : 'border-gray-200'
                      }`}
                    >
                      {day}
                      {hasSlots && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Entire Weeks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(weekNum => (
                    <Button
                      key={weekNum}
                      variant="outline"
                      onClick={() => handleWeekSelection(weekNum)}
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <span className="font-semibold">Week {weekNum}</span>
                      <span className="text-xs text-gray-500">
                        {weekNum === 1 && "Jan 1-7"}
                        {weekNum === 2 && "Jan 8-14"}
                        {weekNum === 3 && "Jan 15-21"}
                        {weekNum === 4 && "Jan 22-28"}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Entire Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Month and Year Selectors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Month</label>
                      <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value.toString()}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Year</label>
                      <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Selection Button */}
                  <Button
                    onClick={handleMonthSelection}
                    className="w-full h-20 bg-[#FF6B00] hover:bg-[#FF6B00]/90"
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-lg">
                        {months[selectedMonth].label} {selectedYear}
                      </span>
                      <span className="text-sm">
                        Select entire month ({getDaysInMonth(selectedMonth, selectedYear)} days)
                      </span>
                    </div>
                  </Button>

                  {/* Selected dates preview */}
                  {selectedDates.length > 0 && selectionMode === 'month' && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm font-medium text-orange-800 mb-2">
                        Selected: {months[selectedMonth].label} {selectedYear}
                      </p>
                      <p className="text-xs text-orange-600">
                        {selectedDates.length} dates selected ({selectedDates[0]} to {selectedDates[selectedDates.length - 1]})
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Dates and Time Slot Addition */}
        {selectedDates.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add Time Slots to Selected Dates</CardTitle>
              <Badge variant="secondary">{selectedDates.length} dates selected</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <Input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <Input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addBulkSlots} className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add to All Selected
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Selected dates:</strong> {selectedDates.slice(0, 5).join(', ')}
                {selectedDates.length > 5 && ` and ${selectedDates.length - 5} more...`}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Slots */}
        <Card>
          <CardHeader>
            <CardTitle>Current Time Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {slots.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No slots created yet</p>
              ) : (
                slots.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{slot.date}</p>
                      <p className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</p>
                      <div className="mt-1">
                        {getSlotStatusBadge(slot)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={slot.booked}
                        className={slot.booked ? 'opacity-50' : ''}
                      >
                        {slot.booked ? <Lock className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant={slot.available ? "destructive" : "default"}
                        onClick={() => toggleSlotAvailability(slot.id)}
                        disabled={slot.booked}
                        className={slot.booked ? 'opacity-50' : ''}
                      >
                        {slot.booked ? 'Booked' : (slot.available ? 'Disable' : 'Enable')}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteSlot(slot.id)}
                        disabled={slot.booked}
                        className={slot.booked ? 'opacity-50' : ''}
                      >
                        {slot.booked ? <Lock className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
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

export default Calendar;

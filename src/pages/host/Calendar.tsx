import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, X, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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

const Calendar = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [editingSlot, setEditingSlot] = useState<{dateStr: string, slotId: string} | null>(null);
  const [newSlot, setNewSlot] = useState({
    title: '',
    startTime: '',
    endTime: '',
    capacity: 1
  });

  // Mock data for slots per date
  const [daySlots, setDaySlots] = useState<DaySlots>({
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

  // Mock data for parking capacity per date
  const [dailyCapacity, setDailyCapacity] = useState<Record<string, { available: number; total: number }>>({
    '2024-01-15': { available: 2, total: 3 },
    '2024-01-16': { available: 3, total: 3 },
    '2024-01-17': { available: 0, total: 3 },
    '2024-01-18': { available: 1, total: 3 },
  });

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

  const currentYear2024 = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear2024 + i);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const weeks = [];
    let currentWeek = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const slots = daySlots[dateStr] || [];
      currentWeek.push({
        day,
        dateStr,
        slots,
        isSelected: selectedDates.includes(dateStr)
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill remaining cells in the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDates(prev => 
      prev.includes(dateStr) 
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const handleWeekSelection = (weekIndex: number) => {
    const weeks = generateCalendarGrid();
    const weekDates = weeks[weekIndex]
      ?.filter(day => day !== null)
      .map(day => day!.dateStr) || [];
    
    const allSelected = weekDates.every(date => selectedDates.includes(date));
    
    if (allSelected) {
      setSelectedDates(prev => prev.filter(date => !weekDates.includes(date)));
    } else {
      setSelectedDates(prev => [...new Set([...prev, ...weekDates])]);
    }
  };

  const handleColumnSelection = (dayOfWeek: number) => {
    const weeks = generateCalendarGrid();
    const columnDates = weeks
      .map(week => week[dayOfWeek])
      .filter(day => day !== null)
      .map(day => day!.dateStr);
    
    const allSelected = columnDates.every(date => selectedDates.includes(date));
    
    if (allSelected) {
      setSelectedDates(prev => prev.filter(date => !columnDates.includes(date)));
    } else {
      setSelectedDates(prev => [...new Set([...prev, ...columnDates])]);
    }
  };

  const handleSlotEdit = (dateStr: string, slotId: string, field: string, value: string | number) => {
    setDaySlots(prev => ({
      ...prev,
      [dateStr]: prev[dateStr]?.map(slot => 
        slot.id === slotId 
          ? { ...slot, [field]: value }
          : slot
      ) || []
    }));
  };

  const handleSlotDelete = (dateStr: string, slotId: string) => {
    setDaySlots(prev => ({
      ...prev,
      [dateStr]: prev[dateStr]?.filter(slot => slot.id !== slotId) || []
    }));
    toast({
      title: "Success",
      description: "Slot deleted successfully",
    });
  };

  const handleSlotDisable = (dateStr: string, slotId: string) => {
    setDaySlots(prev => ({
      ...prev,
      [dateStr]: prev[dateStr]?.map(slot => 
        slot.id === slotId 
          ? { ...slot, status: slot.status === 'disabled' ? 'available' : 'disabled' }
          : slot
      ) || []
    }));
  };

  const applySlotToSelected = () => {
    if (!newSlot.title || !newSlot.startTime || !newSlot.endTime || selectedDates.length === 0) {
      toast({
        title: "Error",
        description: "Please fill all fields and select dates",
        variant: "destructive"
      });
      return;
    }

    const updatedSlots = { ...daySlots };
    selectedDates.forEach(date => {
      const newSlotId = Date.now().toString() + Math.random().toString();
      if (!updatedSlots[date]) {
        updatedSlots[date] = [];
      }
      updatedSlots[date].push({
        id: newSlotId,
        title: newSlot.title,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        capacity: newSlot.capacity,
        booked: 0,
        status: 'available'
      });
    });
    
    setDaySlots(updatedSlots);
    setSelectedDates([]);
    setNewSlot({ title: '', startTime: '', endTime: '', capacity: 1 });
    
    toast({
      title: "Success",
      description: `Added slot to ${selectedDates.length} dates`,
    });
  };

  const applyAvailabilityToSelected = () => {
    if (!newSlot.startTime || !newSlot.endTime || selectedDates.length === 0) {
      toast({
        title: "Error",
        description: "Please select dates and set time slots and capacity",
        variant: "destructive"
      });
      return;
    }

    // Update capacity for selected dates
    const updatedCapacity = { ...dailyCapacity };
    selectedDates.forEach(date => {
      updatedCapacity[date] = {
        available: newSlot.capacity,
        total: newSlot.capacity
      };
    });
    
    setDailyCapacity(updatedCapacity);
    setSelectedDates([]);
    setNewSlot({ startTime: '', endTime: '', capacity: 1 });
    
    toast({
      title: "Success",
      description: `Applied availability to ${selectedDates.length} dates`,
    });
  };

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Calendar availability updated successfully",
    });
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const getSlotStatusColor = (slot: Slot) => {
    if (slot.status === 'disabled') return 'bg-gray-100 text-gray-500';
    if (slot.booked >= slot.capacity) return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-green-50 text-green-700 border-green-200';
  };

  const weeks = generateCalendarGrid();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Layout title="Advanced Calendar Management">
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

        {/* Month/Year Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-2">Month</label>
                <Select value={currentMonth.toString()} onValueChange={(value) => setCurrentMonth(parseInt(value))}>
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
                <Select value={currentYear.toString()} onValueChange={(value) => setCurrentYear(parseInt(value))}>
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
          </CardContent>
        </Card>

        {/* Advanced Calendar Grid with Slot Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{months[currentMonth].label} {currentYear}</span>
              {selectedDates.length > 0 && (
                <Badge variant="secondary">{selectedDates.length} dates selected</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-1 text-center">
              {/* Header row with day names and week selector */}
              <div className="p-2 font-medium text-sm border border-gray-200 bg-gray-50">Week</div>
              {dayNames.map((dayName, index) => (
                <button
                  key={dayName}
                  onClick={() => handleColumnSelection(index)}
                  className="p-2 font-medium text-sm border border-gray-200 bg-gray-50 hover:bg-gray-100"
                >
                  {dayName}
                </button>
              ))}

              {/* Calendar grid with week selectors and slot details */}
              {weeks.map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {/* Week selector button */}
                  <button
                    onClick={() => handleWeekSelection(weekIndex)}
                    className="p-2 text-sm border border-gray-200 bg-gray-50 hover:bg-gray-100 font-medium"
                  >
                    W{weekIndex + 1}
                  </button>
                  
                  {/* Days in the week */}
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`border border-gray-200 min-h-[120px] ${
                        day === null ? 'bg-gray-50' : ''
                      }`}
                    >
                      {day && (
                        <div
                          className={`w-full h-full p-1 ${
                            day.isSelected 
                              ? 'bg-[#FF6B00]/10 border-[#FF6B00]' 
                              : 'bg-white'
                          }`}
                        >
                          <button
                            onClick={() => handleDateClick(day.dateStr)}
                            className={`w-full text-xs font-medium mb-2 p-1 rounded ${
                              day.isSelected ? 'bg-[#FF6B00] text-white' : 'hover:bg-gray-100'
                            }`}
                          >
                            {day.day}
                          </button>
                          
                          {/* Slot details */}
                          <div className="space-y-1">
                            {day.slots.map((slot) => (
                              <div
                                key={slot.id}
                                className={`text-xs p-1 rounded border ${getSlotStatusColor(slot)}`}
                              >
                                <div className="font-medium truncate">{slot.title}</div>
                                <div className="flex items-center justify-between">
                                  <span>{slot.startTime}-{slot.endTime}</span>
                                  <div className="flex items-center space-x-1">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="10"
                                      value={slot.capacity}
                                      onChange={(e) => handleSlotEdit(day.dateStr, slot.id, 'capacity', parseInt(e.target.value) || 0)}
                                      className="w-8 h-4 text-xs p-0 text-center border-0 bg-transparent"
                                    />
                                    <span>/</span>
                                    <span>{slot.booked}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <Badge 
                                    variant={slot.status === 'available' ? 'default' : slot.status === 'booked' ? 'destructive' : 'secondary'}
                                    className="text-xs px-1"
                                  >
                                    {slot.status}
                                  </Badge>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => handleSlotDisable(day.dateStr, slot.id)}
                                      className="text-gray-400 hover:text-gray-600"
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <button className="text-red-400 hover:text-red-600">
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Slot</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete "{slot.title}"? This action cannot be undone.
                                            {slot.booked > 0 && (
                                              <span className="text-red-600 block mt-2">
                                                Warning: This slot has {slot.booked} active booking(s).
                                              </span>
                                            )}
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={() => handleSlotDelete(day.dateStr, slot.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Click individual dates to select them</li>
                <li>Click "W1", "W2", etc. to select entire weeks</li>
                <li>Click day names (Mon, Tue, etc.) to select all dates in that column</li>
                <li>Edit capacity directly in each slot</li>
                <li>Use edit/delete buttons to manage individual slots</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Time Slot and Capacity Assignment */}
        {selectedDates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Apply Availability to Selected Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                <div>
                  <label className="block text-sm font-medium mb-2">Parking Spots</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newSlot.capacity}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={applyAvailabilityToSelected} className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Apply to Selected
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Selected dates:</strong> {selectedDates.slice(0, 10).join(', ')}
                {selectedDates.length > 10 && ` and ${selectedDates.length - 10} more...`}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Slot to Selected Dates */}
        {selectedDates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Add Slot to Selected Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Slot Title</label>
                  <Input
                    type="text"
                    placeholder="e.g., Front Yard"
                    value={newSlot.title}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
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
                <div>
                  <label className="block text-sm font-medium mb-2">Capacity</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newSlot.capacity}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={applySlotToSelected} className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Slot
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Selected dates:</strong> {selectedDates.slice(0, 10).join(', ')}
                {selectedDates.length > 10 && ` and ${selectedDates.length - 10} more...`}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Calendar;

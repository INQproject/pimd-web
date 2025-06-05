
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Calendar = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [newSlot, setNewSlot] = useState({
    startTime: '',
    endTime: '',
    capacity: 1
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
      currentWeek.push({
        day,
        dateStr,
        capacity: dailyCapacity[dateStr] || { available: 3, total: 3 },
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
      // Deselect all dates in this week
      setSelectedDates(prev => prev.filter(date => !weekDates.includes(date)));
    } else {
      // Select all dates in this week
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
      // Deselect all dates in this column
      setSelectedDates(prev => prev.filter(date => !columnDates.includes(date)));
    } else {
      // Select all dates in this column
      setSelectedDates(prev => [...new Set([...prev, ...columnDates])]);
    }
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

        {/* Advanced Calendar Grid */}
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

              {/* Calendar grid with week selectors */}
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
                      className={`border border-gray-200 min-h-[60px] ${
                        day === null ? 'bg-gray-50' : ''
                      }`}
                    >
                      {day && (
                        <button
                          onClick={() => handleDateClick(day.dateStr)}
                          className={`w-full h-full p-1 text-sm hover:bg-gray-100 flex flex-col items-center justify-center ${
                            day.isSelected 
                              ? 'bg-[#FF6B00] text-white' 
                              : day.capacity.available === 0
                              ? 'bg-red-50 text-red-700'
                              : 'bg-white'
                          }`}
                        >
                          <span className="font-medium">{day.day}</span>
                          <span className="text-xs mt-1">
                            {day.capacity.available}/{day.capacity.total}
                          </span>
                        </button>
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
                <li>Numbers show available/total parking spots per day</li>
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
      </div>
    </Layout>
  );
};

export default Calendar;

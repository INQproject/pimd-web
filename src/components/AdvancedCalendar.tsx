
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Lock } from 'lucide-react';
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

interface AdvancedCalendarProps {
  initialSlots?: DaySlots;
  onSlotsChange?: (slots: DaySlots) => void;
  onSave?: () => void;
  showHeader?: boolean;
  compactMode?: boolean;
}

const AdvancedCalendar: React.FC<AdvancedCalendarProps> = ({
  initialSlots = {},
  onSlotsChange,
  onSave,
  showHeader = true,
  compactMode = false
}) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [multiSelectMode, setMultiSelectMode] = useState<boolean>(false);
  const [daySlots, setDaySlots] = useState<DaySlots>(initialSlots);
  const [newSlot, setNewSlot] = useState({
    title: '',
    startTime: '',
    endTime: '',
    capacity: 1
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

    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null);
    }

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

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const handleDateClick = (dateStr: string) => {
    if (!multiSelectMode) {
      setSelectedDates([dateStr]);
    } else {
      setSelectedDates(prev => 
        prev.includes(dateStr) 
          ? prev.filter(d => d !== dateStr)
          : [...prev, dateStr]
      );
    }
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
    const updatedSlots = {
      ...daySlots,
      [dateStr]: daySlots[dateStr]?.map(slot => 
        slot.id === slotId 
          ? { ...slot, [field]: value }
          : slot
      ) || []
    };
    setDaySlots(updatedSlots);
    onSlotsChange?.(updatedSlots);
  };

  const handleSlotDelete = (dateStr: string, slotId: string) => {
    const updatedSlots = {
      ...daySlots,
      [dateStr]: daySlots[dateStr]?.filter(slot => slot.id !== slotId) || []
    };
    setDaySlots(updatedSlots);
    onSlotsChange?.(updatedSlots);
    toast({
      title: "Success",
      description: "Slot deleted successfully",
    });
  };

  const handleSlotDisable = (dateStr: string, slotId: string) => {
    const updatedSlots = {
      ...daySlots,
      [dateStr]: daySlots[dateStr]?.map(slot => 
        slot.id === slotId 
          ? { ...slot, status: slot.status === 'disabled' ? 'available' : 'disabled' }
          : slot
      ) || []
    };
    setDaySlots(updatedSlots);
    onSlotsChange?.(updatedSlots);
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
    onSlotsChange?.(updatedSlots);
    setSelectedDates([]);
    setNewSlot({ title: '', startTime: '', endTime: '', capacity: 1 });
    
    toast({
      title: "Success",
      description: `Added slot to ${selectedDates.length} dates`,
    });
  };

  const getSlotStatusColor = (slot: Slot) => {
    if (slot.status === 'disabled') return 'bg-gray-100 text-gray-500';
    if (slot.booked >= slot.capacity) return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-green-50 text-green-700 border-green-200';
  };

  const weeks = generateCalendarGrid();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Month/Year Picker and Multi-Select Toggle */}
      {showHeader && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Calendar Navigation</span>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Multi-Select:</label>
                <Button
                  variant={multiSelectMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMultiSelectMode(!multiSelectMode)}
                >
                  {multiSelectMode ? 'ON' : 'OFF'}
                </Button>
              </div>
            </CardTitle>
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
      )}

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
            {/* Header row */}
            <div className="p-2 font-medium text-sm border border-gray-200 bg-gray-50">
              {multiSelectMode ? 'Week' : ''}
            </div>
            {dayNames.map((dayName, index) => (
              <button
                key={dayName}
                onClick={() => multiSelectMode && handleColumnSelection(index)}
                className={`p-2 font-medium text-sm border border-gray-200 bg-gray-50 ${
                  multiSelectMode ? 'hover:bg-gray-100 cursor-pointer' : ''
                }`}
                disabled={!multiSelectMode}
              >
                {multiSelectMode && (
                  <div className="w-3 h-3 rounded-full border-2 border-gray-400 mx-auto mb-1"></div>
                )}
                {dayName}
              </button>
            ))}

            {/* Calendar grid */}
            {weeks.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {/* Week selector */}
                <button
                  onClick={() => multiSelectMode && handleWeekSelection(weekIndex)}
                  className={`p-2 text-sm border border-gray-200 bg-gray-50 font-medium ${
                    multiSelectMode ? 'hover:bg-gray-100 cursor-pointer' : ''
                  }`}
                  disabled={!multiSelectMode}
                >
                  {multiSelectMode && (
                    <div className="w-3 h-3 rounded-full border-2 border-gray-400 mx-auto mb-1"></div>
                  )}
                  W{weekIndex + 1}
                </button>
                
                {/* Days */}
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`border border-gray-200 ${
                      compactMode ? 'min-h-[80px]' : 'min-h-[120px]'
                    } ${day === null ? 'bg-gray-50' : ''}`}
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
                                  {slot.status === 'booked' ? (
                                    <Lock className="h-3 w-3" />
                                  ) : (
                                    <Input
                                      type="number"
                                      min="0"
                                      max="10"
                                      value={slot.capacity}
                                      onChange={(e) => handleSlotEdit(day.dateStr, slot.id, 'capacity', parseInt(e.target.value) || 0)}
                                      className="w-8 h-4 text-xs p-0 text-center border-0 bg-transparent"
                                    />
                                  )}
                                  <span>/</span>
                                  <span>{slot.booked}</span>
                                </div>
                              </div>
                              {!compactMode && (
                                <div className="flex items-center justify-between mt-1">
                                  <Badge 
                                    variant={slot.status === 'available' ? 'default' : slot.status === 'booked' ? 'destructive' : 'secondary'}
                                    className="text-xs px-1"
                                  >
                                    {slot.status}
                                  </Badge>
                                  <div className="flex space-x-1">
                                    {slot.status !== 'booked' && (
                                      <>
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
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
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

          {!compactMode && (
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Turn on Multi-Select to enable bulk operations</li>
                <li>Click circles on week rows/day columns for bulk selection</li>
                <li>Edit capacity directly in available slots</li>
                <li>Booked slots are locked from editing</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Slot Section */}
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

      {onSave && (
        <div className="flex justify-end">
          <Button onClick={onSave} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90">
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedCalendar;

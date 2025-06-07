import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Edit, Trash2, Lock, ChevronLeft, ChevronRight, Calendar, Clock, X, Eye, Filter, CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import CancelSlotModal from '@/components/CancelSlotModal';

interface HostSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalSpots: number;
  availableSpots: number;
  notes?: string;
  isBooked: boolean;
  status: 'available' | 'booked' | 'cancelled';
  cancellationReason?: string;
}

const ManageAvailability = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0)); // January 2024
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [slotToCancel, setSlotToCancel] = useState<HostSlot | null>(null);
  
  const slotFormRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<HTMLSelectElement>(null);
  
  const [slots, setSlots] = useState<HostSlot[]>([
    {
      id: '1',
      date: '2024-01-15',
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      totalSpots: 3,
      availableSpots: 3,
      notes: 'Main driveway',
      isBooked: false,
      status: 'available'
    },
    {
      id: '2',
      date: '2024-01-15',
      startTime: '6:00 PM',
      endTime: '10:00 PM',
      totalSpots: 2,
      availableSpots: 0,
      isBooked: true,
      status: 'booked'
    },
    {
      id: '3',
      date: '2024-01-16',
      startTime: '8:00 AM',
      endTime: '6:00 PM',
      totalSpots: 5,
      availableSpots: 4,
      isBooked: false,
      status: 'available'
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
      const isBooked = daySlots.some(slot => slot.isBooked);
      days.push({ day, dateStr, hasSlots, isToday, isSelected, daySlots, isBooked });
    }
    
    return days;
  };

  // Group calendar days into weeks for row selection
  const generateCalendarRows = () => {
    const calendarDays = generateCalendarDays();
    const rows = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      rows.push(calendarDays.slice(i, i + 7));
    }
    return rows;
  };

  // Handle row selection (select entire week)
  const handleRowSelection = (rowIndex: number) => {
    const calendarRows = generateCalendarRows();
    const row = calendarRows[rowIndex];
    const validDatesInRow = row
      .filter(dayData => dayData && !dayData.isBooked)
      .map(dayData => dayData!.dateStr);
    
    const allRowDatesSelected = validDatesInRow.every(date => selectedDates.includes(date));
    
    if (allRowDatesSelected) {
      // Deselect all dates in this row
      setSelectedDates(prev => prev.filter(date => !validDatesInRow.includes(date)));
      toast({
        title: "Week Deselected",
        description: `Removed ${validDatesInRow.length} dates from selection.`,
      });
    } else {
      // Select all valid dates in this row
      setSelectedDates(prev => {
        const newDates = validDatesInRow.filter(date => !prev.includes(date));
        return [...prev, ...newDates];
      });
      toast({
        title: "Week Selected",
        description: `Added ${validDatesInRow.length} dates to selection.`,
      });
    }
  };

  // Handle column selection (select all dates for a specific weekday)
  const handleColumnSelection = (dayOfWeek: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const datesInColumn: string[] = [];
    
    // Find all dates in the month that match this day of week
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === dayOfWeek) {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const daySlots = slots.filter(slot => slot.date === dateStr);
        const isBooked = daySlots.some(slot => slot.isBooked);
        if (!isBooked) {
          datesInColumn.push(dateStr);
        }
      }
    }
    
    const allColumnDatesSelected = datesInColumn.every(date => selectedDates.includes(date));
    const weekdayNames = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
    
    if (allColumnDatesSelected) {
      // Deselect all dates in this column
      setSelectedDates(prev => prev.filter(date => !datesInColumn.includes(date)));
      toast({
        title: `${weekdayNames[dayOfWeek]} Deselected`,
        description: `Removed ${datesInColumn.length} dates from selection.`,
      });
    } else {
      // Select all valid dates in this column
      setSelectedDates(prev => {
        const newDates = datesInColumn.filter(date => !prev.includes(date));
        return [...prev, ...newDates];
      });
      toast({
        title: `${weekdayNames[dayOfWeek]} Selected`,
        description: `Added ${datesInColumn.length} dates to selection.`,
      });
    }
  };

  // Check if a row is fully selected
  const isRowSelected = (rowIndex: number) => {
    const calendarRows = generateCalendarRows();
    const row = calendarRows[rowIndex];
    const validDatesInRow = row
      .filter(dayData => dayData && !dayData.isBooked)
      .map(dayData => dayData!.dateStr);
    return validDatesInRow.length > 0 && validDatesInRow.every(date => selectedDates.includes(date));
  };

  // Check if a column is fully selected
  const isColumnSelected = (dayOfWeek: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const datesInColumn: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === dayOfWeek) {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const daySlots = slots.filter(slot => slot.date === dateStr);
        const isBooked = daySlots.some(slot => slot.isBooked);
        if (!isBooked) {
          datesInColumn.push(dateStr);
        }
      }
    }
    
    return datesInColumn.length > 0 && datesInColumn.every(date => selectedDates.includes(date));
  };

  const handleDateClick = (dateStr: string) => {
    if (multiSelectMode) {
      // Check if this date is booked
      const daySlots = slots.filter(slot => slot.date === dateStr);
      const isBooked = daySlots.some(slot => slot.isBooked);
      
      if (isBooked) {
        toast({
          title: "Cannot Select",
          description: "This date has existing bookings and cannot be selected.",
          variant: "destructive"
        });
        return;
      }
      
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

  const scrollToSlotForm = () => {
    setShowSlotForm(true);
    setTimeout(() => {
      slotFormRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setTimeout(() => {
        startTimeRef.current?.focus();
      }, 500);
    }, 100);
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
    const newSlots: HostSlot[] = [];
    
    validDates.forEach(date => {
      const newSlotData: HostSlot = {
        id: Math.random().toString(36).substr(2, 9),
        date,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        totalSpots,
        availableSpots: totalSpots,
        notes: newSlot.notes || undefined,
        isBooked: false,
        status: 'available'
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

  const handleCancelSlot = (slot: HostSlot) => {
    setSlotToCancel(slot);
    setCancelModalOpen(true);
  };

  const confirmCancelSlot = (reason: string) => {
    if (slotToCancel) {
      setSlots(prev => prev.map(slot => 
        slot.id === slotToCancel.id 
          ? { ...slot, status: 'cancelled', cancellationReason: reason, availableSpots: 0 }
          : slot
      ));
      
      toast({
        title: "Slot Cancelled",
        description: "The slot has been cancelled and bookings have been notified.",
      });
    }
  };

  const deleteSlot = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    // Check if slot has bookings - only allow deletion of available or cancelled slots
    if (slot.status === 'booked') {
      toast({
        title: "Cannot delete slot",
        description: "Cannot delete a slot that has been booked. Cancel the booking first.",
        variant: "destructive"
      });
      return;
    }

    setSlots(prevSlots => prevSlots.filter(s => s.id !== slotId));
    toast({
      title: "Slot deleted",
      description: "The time slot has been successfully deleted.",
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

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const applyDateFilter = () => {
    if (fromDate && toDate && fromDate > toDate) {
      toast({
        title: "Invalid Date Range",
        description: "To Date must be equal or after From Date.",
        variant: "destructive"
      });
      return;
    }
  };

  const resetDateFilter = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  const getSlotsByDate = () => {
    const groupedSlots: { [key: string]: HostSlot[] } = {};
    let filteredSlots = slots;

    if (statusFilter !== 'all') {
      filteredSlots = filteredSlots.filter(slot => slot.status === statusFilter);
    }

    if (fromDate || toDate) {
      filteredSlots = filteredSlots.filter(slot => {
        const slotDate = new Date(slot.date + 'T00:00:00');
        
        if (fromDate && toDate) {
          return slotDate >= fromDate && slotDate <= toDate;
        } else if (fromDate) {
          return slotDate >= fromDate;
        } else if (toDate) {
          return slotDate <= toDate;
        }
        
        return true;
      });
    }

    filteredSlots.forEach(slot => {
      if (!groupedSlots[slot.date]) {
        groupedSlots[slot.date] = [];
      }
      groupedSlots[slot.date].push(slot);
    });
    return groupedSlots;
  };

  const getStatusBadge = (slot: HostSlot) => {
    switch (slot.status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Available</Badge>;
      case 'booked':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Booked</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getDateRangeBadge = () => {
    if (fromDate && toDate) {
      return `Showing slots from ${format(fromDate, 'MMM d, yyyy')} to ${format(toDate, 'MMM d, yyyy')}`;
    } else if (fromDate) {
      return `Showing slots from ${format(fromDate, 'MMM d, yyyy')} onwards`;
    } else if (toDate) {
      return `Showing slots up to ${format(toDate, 'MMM d, yyyy')}`;
    }
    return null;
  };

  const calendarRows = generateCalendarRows();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const slotsByDate = getSlotsByDate();

  // Sort selected dates chronologically
  const sortedSelectedDates = [...selectedDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <TooltipProvider>
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
                  <div className="grid grid-cols-8 gap-1 text-center mb-2">
                    <div className="p-1"></div> {/* Empty cell for row selector column */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <div key={day} className="p-1 text-xs font-medium text-gray-500 relative">
                        {multiSelectMode && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleColumnSelection(index)}
                                className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 hover:bg-gray-100 transition-colors ${
                                  isColumnSelected(index) 
                                    ? 'bg-orange-500 border-orange-500' 
                                    : 'bg-white border-gray-300'
                                }`}
                              >
                                {isColumnSelected(index) && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Select all {day}s</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <span className="mt-2 block">{day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {calendarRows.map((row, rowIndex) => (
                      <div key={rowIndex} className="grid grid-cols-8 gap-1">
                        <div className="aspect-square flex items-center justify-center">
                          {multiSelectMode && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleRowSelection(rowIndex)}
                                  className={`w-4 h-4 rounded-full border-2 hover:bg-gray-100 transition-colors ${
                                    isRowSelected(rowIndex) 
                                      ? 'bg-orange-500 border-orange-500' 
                                      : 'bg-white border-gray-300'
                                  }`}
                                >
                                  {isRowSelected(rowIndex) && (
                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Select this week</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        {row.map((dayData, dayIndex) => (
                          <div key={dayIndex} className="aspect-square">
                            {dayData ? (
                              <button
                                onClick={() => handleDateClick(dayData.dateStr)}
                                disabled={dayData.isBooked}
                                className={`w-full h-full text-sm rounded-md hover:bg-gray-100 relative border transition-colors flex flex-col items-center justify-center group ${
                                  dayData.isSelected
                                    ? 'bg-orange-500 text-white border-orange-500' 
                                    : dayData.isToday 
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : dayData.isBooked
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
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
                                {dayData.isBooked && (
                                  <Lock className="absolute top-1 right-1 h-3 w-3 text-gray-400" />
                                )}
                              </button>
                            ) : (
                              <div className="w-full h-full"></div>
                            )}
                          </div>
                        ))}
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
                        {sortedSelectedDates.map(date => (
                          <div key={date} className="flex items-center justify-between p-2 bg-orange-50 rounded-md">
                            <span className="text-sm">{formatDateShort(date)}</span>
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
                        onClick={scrollToSlotForm}
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
                      ? "Click multiple dates, rows, or columns to select. Then create slots for all selected dates at once."
                      : "Click any date to immediately create a slot for that day."
                    }
                  </div>
                  {multiSelectMode && (
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Click the circles on the left to select entire weeks</p>
                      <p>• Click the circles above weekdays to select all dates for that day</p>
                      <p>• Booked dates (🔒) cannot be selected</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Slot Creation Form */}
          {showSlotForm && selectedDates.length > 0 && (
            <Card ref={slotFormRef} className="shadow-md border-orange-200 border-2">
              <CardHeader className="pb-3 bg-orange-50">
                <CardTitle className="text-lg flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slot to {selectedDates.length} Date{selectedDates.length !== 1 ? 's' : ''}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Creating slots for: {sortedSelectedDates.slice(0, 3).map(formatDateShort).join(', ')}
                  {selectedDates.length > 3 && ` and ${selectedDates.length - 3} more...`}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <select
                      ref={startTimeRef}
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

          {/* All Time Slots Section - Redesigned */}
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex flex-col space-y-4">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  All Time Slots
                </CardTitle>
                
                {/* Date Range Filter */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Filter by Date Range</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                    <div>
                      <Label className="text-xs text-gray-600">From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !fromDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fromDate ? format(fromDate, "MMM d, yyyy") : "Start Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={fromDate}
                            onSelect={setFromDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-600">To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !toDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {toDate ? format(toDate, "MMM d, yyyy") : "End Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={toDate}
                            onSelect={setToDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Status</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="booked">Booked</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={applyDateFilter} className="flex-1">
                        Apply
                      </Button>
                      <Button variant="outline" onClick={resetDateFilter} className="flex-1">
                        Reset
                      </Button>
                    </div>
                  </div>
                  
                  {getDateRangeBadge() && (
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        {getDateRangeBadge()}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.keys(slotsByDate).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {(fromDate || toDate) 
                        ? 'No slots available in this range' 
                        : statusFilter !== 'all'
                        ? 'No slots match the current filters.'
                        : 'No slots added yet. Use the calendar above to add your first slots.'}
                    </p>
                  </div>
                ) : (
                  Object.entries(slotsByDate)
                    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                    .map(([date, dateSlots]) => (
                      <div key={date} className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="font-semibold text-lg mb-4 text-gray-800 flex items-center">
                          <Calendar className="mr-2 h-5 w-5" />
                          {formatDate(date)}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {dateSlots.map(slot => (
                            <div key={slot.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    {slot.startTime} - {slot.endTime}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-1">
                                    {slot.status === 'cancelled' 
                                      ? 'Cancelled' 
                                      : `${slot.availableSpots}/${slot.totalSpots} spots available`}
                                  </p>
                                  {slot.notes && (
                                    <p className="text-xs text-gray-500 mb-2">{slot.notes}</p>
                                  )}
                                  {slot.cancellationReason && (
                                    <p className="text-xs text-red-600 mb-2">
                                      Reason: {slot.cancellationReason}
                                    </p>
                                  )}
                                </div>
                                <div className="ml-2">
                                  {getStatusBadge(slot)}
                                </div>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t">
                                <div className="flex space-x-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>View Details</TooltipContent>
                                  </Tooltip>
                                  
                                  {slot.status !== 'cancelled' && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          className="h-8 w-8 p-0"
                                          disabled={slot.status === 'cancelled'}
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit Slot</TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                                
                                <div className="flex space-x-1">
                                  {slot.status === 'booked' && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm" 
                                          variant="destructive"
                                          onClick={() => handleCancelSlot(slot)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Cancel Slot</TooltipContent>
                                    </Tooltip>
                                  )}
                                  
                                  {(slot.status === 'available' || slot.status === 'cancelled') && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm" 
                                          variant="destructive"
                                          onClick={() => deleteSlot(slot.id)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Delete Slot</TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
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

          {/* Cancel Slot Modal */}
          {slotToCancel && (
            <CancelSlotModal
              isOpen={cancelModalOpen}
              onClose={() => {
                setCancelModalOpen(false);
                setSlotToCancel(null);
              }}
              onConfirm={confirmCancelSlot}
              slotDetails={{
                date: slotToCancel.date,
                startTime: slotToCancel.startTime,
                endTime: slotToCancel.endTime
              }}
            />
          )}
        </div>
      </Layout>
    </TooltipProvider>
  );
};

export default ManageAvailability;

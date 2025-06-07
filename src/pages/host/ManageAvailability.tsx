
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Trash2, Clock, DollarSign, Car, Users, Settings, Eye, MapPin, AlertCircle, Calendar as CalendarIcon, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const localizer = momentLocalizer(moment);

interface AvailabilitySlot {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: 'available' | 'booked';
  price: number;
  capacity: number;
  description?: string;
  bookedBy?: string;
  vehicleCount?: number;
}

const mockSlots: AvailabilitySlot[] = [
  {
    id: '1',
    title: 'Morning Slot',
    start: new Date(2025, 5, 15, 8, 0),
    end: new Date(2025, 5, 15, 12, 0),
    status: 'available',
    price: 15,
    capacity: 2,
    description: 'Great for morning commuters'
  },
  {
    id: '2',
    title: 'Afternoon Slot',
    start: new Date(2025, 5, 15, 13, 0),
    end: new Date(2025, 5, 15, 17, 0),
    status: 'booked',
    price: 20,
    capacity: 1,
    bookedBy: 'John Doe',
    vehicleCount: 1,
    description: 'Premium afternoon parking'
  },
  {
    id: '3',
    title: 'Evening Slot',
    start: new Date(2025, 5, 16, 18, 0),
    end: new Date(2025, 5, 16, 22, 0),
    status: 'available',
    price: 18,
    capacity: 3,
    description: 'Perfect for evening events'
  }
];

const ManageAvailability = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(mockSlots);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentView, setCurrentView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Form state for add/edit slot
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    price: '',
    capacity: '',
    description: '',
    recurringEnabled: false,
    recurringType: 'weekly',
    recurringEnd: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      price: '',
      capacity: '',
      description: '',
      recurringEnabled: false,
      recurringType: 'weekly',
      recurringEnd: ''
    });
  };

  const handleSelectSlot = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    setShowDetailsModal(true);
  };

  const handleEditSlot = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    setFormData({
      title: slot.title,
      startDate: moment(slot.start).format('YYYY-MM-DD'),
      startTime: moment(slot.start).format('HH:mm'),
      endDate: moment(slot.end).format('YYYY-MM-DD'),
      endTime: moment(slot.end).format('HH:mm'),
      price: slot.price.toString(),
      capacity: slot.capacity.toString(),
      description: slot.description || '',
      recurringEnabled: false,
      recurringType: 'weekly',
      recurringEnd: ''
    });
    setShowEditModal(true);
  };

  const handleDeleteSlot = (slotId: string) => {
    if (slots.find(s => s.id === slotId)?.status === 'booked') {
      toast({
        title: "Cannot delete booked slot",
        description: "You cannot delete a slot that has been booked by a customer.",
        variant: "destructive"
      });
      return;
    }

    setSlots(prev => prev.filter(slot => slot.id !== slotId));
    toast({
      title: "Slot deleted",
      description: "The availability slot has been successfully deleted.",
    });
  };

  const handleSaveSlot = () => {
    if (!formData.title || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime || !formData.price || !formData.capacity) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (endDateTime <= startDateTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time.",
        variant: "destructive"
      });
      return;
    }

    if (selectedSlot) {
      // Edit existing slot
      setSlots(prev => prev.map(slot => 
        slot.id === selectedSlot.id 
          ? {
              ...slot,
              title: formData.title,
              start: startDateTime,
              end: endDateTime,
              price: parseFloat(formData.price),
              capacity: parseInt(formData.capacity),
              description: formData.description
            }
          : slot
      ));
      setShowEditModal(false);
      toast({
        title: "Slot updated",
        description: "The availability slot has been successfully updated.",
      });
    } else {
      // Add new slot
      const newSlot: AvailabilitySlot = {
        id: Date.now().toString(),
        title: formData.title,
        start: startDateTime,
        end: endDateTime,
        status: 'available',
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        description: formData.description
      };

      if (formData.recurringEnabled) {
        // Handle recurring slots
        const recurringSlots = generateRecurringSlots(newSlot, formData.recurringType, formData.recurringEnd);
        setSlots(prev => [...prev, ...recurringSlots]);
        toast({
          title: "Recurring slots created",
          description: `${recurringSlots.length} slots have been created.`,
        });
      } else {
        setSlots(prev => [...prev, newSlot]);
        toast({
          title: "Slot created",
          description: "The availability slot has been successfully created.",
        });
      }
      setShowAddModal(false);
    }

    resetForm();
    setSelectedSlot(null);
  };

  const generateRecurringSlots = (baseSlot: AvailabilitySlot, type: string, endDate: string): AvailabilitySlot[] => {
    const slots: AvailabilitySlot[] = [baseSlot];
    const recurringEndDate = new Date(endDate);
    let currentStart = moment(baseSlot.start);
    let currentEnd = moment(baseSlot.end);
    let counter = 1;

    while (currentStart.clone().add(type === 'weekly' ? 7 : 1, 'days').toDate() <= recurringEndDate) {
      const increment = type === 'weekly' ? 7 : 1;
      currentStart = currentStart.add(increment, 'days');
      currentEnd = currentEnd.add(increment, 'days');
      
      slots.push({
        ...baseSlot,
        id: `${baseSlot.id}_${counter}`,
        start: currentStart.toDate(),
        end: currentEnd.toDate()
      });
      counter++;
    }

    return slots;
  };

  const eventStyleGetter = (event: AvailabilitySlot) => {
    const style = {
      backgroundColor: event.status === 'available' ? '#22c55e' : '#ef4444',
      borderRadius: '6px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      fontSize: '12px',
      padding: '2px 5px'
    };
    return { style };
  };

  const getUpcomingSlots = () => {
    const now = new Date();
    return slots
      .filter(slot => slot.start >= now)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5);
  };

  const getRecentBookings = () => {
    return slots
      .filter(slot => slot.status === 'booked')
      .sort((a, b) => b.start.getTime() - a.start.getTime())
      .slice(0, 3);
  };

  const getTotalEarnings = () => {
    return slots
      .filter(slot => slot.status === 'booked')
      .reduce((total, slot) => {
        const hours = moment(slot.end).diff(moment(slot.start), 'hours');
        return total + (slot.price * hours);
      }, 0);
  };

  const getAvailabilityStats = () => {
    const totalSlots = slots.length;
    const bookedSlots = slots.filter(slot => slot.status === 'booked').length;
    const availableSlots = totalSlots - bookedSlots;
    
    return {
      total: totalSlots,
      booked: bookedSlots,
      available: availableSlots,
      occupancyRate: totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0
    };
  };

  const stats = getAvailabilityStats();

  return (
    <Layout title="Manage Availability" showBackButton={true}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Slots</p>
                  <p className="text-2xl font-bold text-[#1C1C1C]">{stats.total}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-[#FF6B00]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Booked</p>
                  <p className="text-2xl font-bold text-red-600">{stats.booked}</p>
                </div>
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Earnings</p>
                  <p className="text-2xl font-bold text-[#FF6B00]">${getTotalEarnings()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-[#FF6B00]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Availability Calendar</CardTitle>
                  <CardDescription>Manage your parking slots and view bookings</CardDescription>
                </div>
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Slot
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Availability Slot</DialogTitle>
                      <DialogDescription>Create a new time slot for your parking space</DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="title">Slot Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="e.g., Morning Slot"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="endDate">End Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price per Hour ($)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            placeholder="15.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="capacity">Vehicle Capacity</Label>
                          <Input
                            id="capacity"
                            type="number"
                            min="1"
                            value={formData.capacity}
                            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                            placeholder="2"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Add any additional details about this slot..."
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="recurring"
                          checked={formData.recurringEnabled}
                          onCheckedChange={(checked) => setFormData({...formData, recurringEnabled: checked})}
                        />
                        <Label htmlFor="recurring">Create recurring slots</Label>
                      </div>
                      
                      {formData.recurringEnabled && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Repeat</Label>
                            <Select value={formData.recurringType} onValueChange={(value) => setFormData({...formData, recurringType: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="recurringEnd">Repeat Until</Label>
                            <Input
                              id="recurringEnd"
                              type="date"
                              value={formData.recurringEnd}
                              onChange={(e) => setFormData({...formData, recurringEnd: e.target.value})}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {setShowAddModal(false); resetForm();}}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveSlot} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
                        Create Slot
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              
              <CardContent>
                <div style={{ height: '500px' }}>
                  <Calendar
                    localizer={localizer}
                    events={slots}
                    startAccessor="start"
                    endAccessor="end"
                    view={currentView}
                    onView={setCurrentView}
                    date={currentDate}
                    onNavigate={setCurrentDate}
                    onSelectEvent={handleSelectSlot}
                    eventPropGetter={eventStyleGetter}
                    popup
                    style={{ height: '100%' }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setShowAddModal(true)}
                  className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Slot
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Bulk Operations
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Slots */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Available Slots</CardTitle>
                <CardDescription>Your next 5 available slots</CardDescription>
              </CardHeader>
              <CardContent>
                {getUpcomingSlots().length === 0 ? (
                  <p className="text-gray-500 text-sm">No upcoming slots</p>
                ) : (
                  <div className="space-y-3">
                    {getUpcomingSlots().map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{slot.title}</p>
                          <p className="text-xs text-gray-600">
                            {moment(slot.start).format('MMM DD, HH:mm')} - {moment(slot.end).format('HH:mm')}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={slot.status === 'available' ? 'default' : 'destructive'} className="text-xs">
                              {slot.status}
                            </Badge>
                            <span className="text-xs text-gray-600">${slot.price}/hr</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSelectSlot(slot)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditSlot(slot)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSlot(slot.id)}
                            disabled={slot.status === 'booked'}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest customer bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {getRecentBookings().length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent bookings</p>
                ) : (
                  <div className="space-y-3">
                    {getRecentBookings().map((slot) => (
                      <div key={slot.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{slot.title}</p>
                            <p className="text-xs text-gray-600 mb-1">
                              {moment(slot.start).format('MMM DD, HH:mm')} - {moment(slot.end).format('HH:mm')}
                            </p>
                            <p className="text-xs text-blue-700">Booked by: {slot.bookedBy}</p>
                            <p className="text-xs text-gray-600">Vehicles: {slot.vehicleCount}</p>
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            ${slot.price * moment(slot.end).diff(moment(slot.start), 'hours')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Slot Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Slot Details</DialogTitle>
              <DialogDescription>View and manage this parking slot</DialogDescription>
            </DialogHeader>
            
            {selectedSlot && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Title</Label>
                    <p className="text-sm">{selectedSlot.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge variant={selectedSlot.status === 'available' ? 'default' : 'destructive'}>
                      {selectedSlot.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Start Time</Label>
                    <p className="text-sm">{moment(selectedSlot.start).format('MMM DD, YYYY HH:mm')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">End Time</Label>
                    <p className="text-sm">{moment(selectedSlot.end).format('MMM DD, YYYY HH:mm')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Price per Hour</Label>
                    <p className="text-sm">${selectedSlot.price}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Capacity</Label>
                    <p className="text-sm">{selectedSlot.capacity} vehicle{selectedSlot.capacity !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                {selectedSlot.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <p className="text-sm">{selectedSlot.description}</p>
                  </div>
                )}
                
                {selectedSlot.status === 'booked' && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Booking Details</h4>
                    <p className="text-sm text-blue-700">Customer: {selectedSlot.bookedBy}</p>
                    <p className="text-sm text-blue-700">Vehicles: {selectedSlot.vehicleCount}</p>
                    <p className="text-sm text-blue-700">
                      Total: ${selectedSlot.price * moment(selectedSlot.end).diff(moment(selectedSlot.start), 'hours')}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
              {selectedSlot && selectedSlot.status === 'available' && (
                <>
                  <Button variant="outline" onClick={() => handleEditSlot(selectedSlot)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      handleDeleteSlot(selectedSlot.id);
                      setShowDetailsModal(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Slot Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Availability Slot</DialogTitle>
              <DialogDescription>Update the details of this parking slot</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-title">Slot Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Morning Slot"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-startTime">Start Time</Label>
                  <Input
                    id="edit-startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endTime">End Time</Label>
                  <Input
                    id="edit-endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price per Hour ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="15.00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-capacity">Vehicle Capacity</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="2"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Add any additional details about this slot..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {setShowEditModal(false); resetForm(); setSelectedSlot(null);}}>
                Cancel
              </Button>
              <Button onClick={handleSaveSlot} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
                Update Slot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ManageAvailability;

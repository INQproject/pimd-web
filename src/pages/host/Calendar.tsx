
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Plus, Edit, Trash2 } from 'lucide-react';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2024-01-15');
  const [selectedSpot, setSelectedSpot] = useState<string>('');
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
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
    { id: 1, spotId: '1', date: '2024-01-15', startTime: '9:00 AM', endTime: '5:00 PM', available: true },
    { id: 2, spotId: '1', date: '2024-01-15', startTime: '6:00 PM', endTime: '10:00 PM', available: false },
    { id: 3, spotId: '1', date: '2024-01-16', startTime: '8:00 AM', endTime: '6:00 PM', available: true },
    { id: 4, spotId: '2', date: '2024-01-15', startTime: '10:00 AM', endTime: '4:00 PM', available: true },
    { id: 5, spotId: '2', date: '2024-01-17', startTime: '9:00 AM', endTime: '3:00 PM', available: true },
  ]);

  const toggleAvailability = (slotId: number) => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, available: !slot.available } : slot
    ));
  };

  const deleteSlot = (slotId: number) => {
    setSlots(prev => prev.filter(slot => slot.id !== slotId));
  };

  const addNewSlot = () => {
    if (!selectedSpot || !newSlot.startTime || !newSlot.endTime) return;

    const newSlotData = {
      id: Math.max(...slots.map(s => s.id)) + 1,
      spotId: selectedSpot,
      date: selectedDate,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      available: true
    };

    setSlots(prev => [...prev, newSlotData]);
    setNewSlot({ startTime: '', endTime: '' });
    setIsAddSlotOpen(false);
  };

  const selectedDateSlots = slots.filter(slot => 
    slot.date === selectedDate && slot.spotId === selectedSpot
  );

  const allSlotsForSpot = slots.filter(slot => slot.spotId === selectedSpot);

  const selectedSpotName = parkingSpots.find(spot => spot.id === selectedSpot)?.name;

  return (
    <Layout title="Manage Availability">
      <div className="space-y-6">
        {/* Parking Spot Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select a Parking Spot</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedSpot} onValueChange={setSelectedSpot}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a verified parking spot..." />
              </SelectTrigger>
              <SelectContent>
                {parkingSpots.map(spot => (
                  <SelectItem key={spot.id} value={spot.id}>
                    {spot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedSpot && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  January 2024
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 font-medium text-sm">{day}</div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                    const dateStr = `2024-01-${day.toString().padStart(2, '0')}`;
                    const hasSlots = slots.some(slot => slot.date === dateStr && slot.spotId === selectedSpot);
                    
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-2 text-sm rounded hover:bg-gray-100 relative ${
                          selectedDate === dateStr 
                            ? 'bg-primary text-white' 
                            : ''
                        }`}
                      >
                        {day}
                        {hasSlots && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Slots for Selected Date */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Slots for {selectedDate}</CardTitle>
                <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="btn-primary">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Slot
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Slot</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
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
                      <Button onClick={addNewSlot} className="w-full btn-primary">
                        Add Slot
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDateSlots.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No slots scheduled for this date</p>
                  ) : (
                    selectedDateSlots.map(slot => (
                      <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{slot.startTime} - {slot.endTime}</p>
                          <p className={`text-sm ${slot.available ? 'text-green-600' : 'text-red-600'}`}>
                            {slot.available ? 'Available' : 'Unavailable'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant={slot.available ? "destructive" : "default"}
                            onClick={() => toggleAvailability(slot.id)}
                          >
                            {slot.available ? 'Disable' : 'Enable'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteSlot(slot.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* All Slots for Selected Spot */}
        {selectedSpot && allSlotsForSpot.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>All Slots for {selectedSpotName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allSlotsForSpot.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{slot.date}</p>
                      <p className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</p>
                      <p className={`text-sm ${slot.available ? 'text-green-600' : 'text-red-600'}`}>
                        {slot.available ? 'Available' : 'Unavailable'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={slot.available ? "destructive" : "default"}
                        onClick={() => toggleAvailability(slot.id)}
                      >
                        {slot.available ? 'Disable' : 'Enable'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteSlot(slot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Calendar;

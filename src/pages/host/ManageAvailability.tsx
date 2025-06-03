
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, ArrowLeft, Plus, Edit, Trash2, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  spotCount?: number;
  remarks?: string;
  status: 'available' | 'booked';
  isBooked: boolean;
}

const ManageAvailability = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([
    {
      id: '1',
      date: '2024-01-15',
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      spotCount: 2,
      remarks: 'Main driveway',
      status: 'available',
      isBooked: false
    },
    {
      id: '2',
      date: '2024-01-15',
      startTime: '6:00 PM',
      endTime: '10:00 PM',
      spotCount: 1,
      status: 'booked',
      isBooked: true
    },
    {
      id: '3',
      date: '2024-01-16',
      startTime: '8:00 AM',
      endTime: '6:00 PM',
      spotCount: 2,
      status: 'available',
      isBooked: false
    }
  ]);

  const [newSlot, setNewSlot] = useState({
    startTime: '',
    endTime: '',
    spotCount: '',
    remarks: ''
  });

  // Generate calendar days for current month (January 2024)
  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const dateStr = `2024-01-${i.toString().padStart(2, '0')}`;
      const hasSlots = slots.some(slot => slot.date === dateStr);
      days.push({ day: i, dateStr, hasSlots });
    }
    return days;
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsAddSlotOpen(true);
  };

  const addNewSlot = () => {
    if (!selectedDate || !newSlot.startTime || !newSlot.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newSlotData: Slot = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      spotCount: newSlot.spotCount ? parseInt(newSlot.spotCount) : undefined,
      remarks: newSlot.remarks || undefined,
      status: 'available',
      isBooked: false
    };

    setSlots(prev => [...prev, newSlotData]);
    setNewSlot({ startTime: '', endTime: '', spotCount: '', remarks: '' });
    setIsAddSlotOpen(false);
    
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

  const calendarDays = generateCalendarDays();

  return (
    <Layout title="Manage Availability">
      <div className="space-y-6">
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

        {/* Listing Info */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Availability - Listing #{listingId}</CardTitle>
          </CardHeader>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              January 2024 - Click a date to add slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 font-medium text-sm border-b">{day}</div>
              ))}
              {calendarDays.map(({ day, dateStr, hasSlots }) => (
                <button
                  key={day}
                  onClick={() => handleDateClick(dateStr)}
                  className="p-3 text-sm rounded hover:bg-gray-100 relative border transition-colors"
                >
                  {day}
                  {hasSlots && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Slot Modal */}
        <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add Slot for {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString()}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="spotCount">Spot Count (Optional)</Label>
                <Input
                  id="spotCount"
                  type="number"
                  placeholder="Number of spots available"
                  value={newSlot.spotCount}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, spotCount: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Textarea
                  id="remarks"
                  placeholder="Any special notes or instructions"
                  value={newSlot.remarks}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, remarks: e.target.value }))}
                />
              </div>
              <Button onClick={addNewSlot} className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Slot
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* All Slots List */}
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
                          {slot.spotCount && (
                            <p className="text-xs text-gray-500">Spots: {slot.spotCount}</p>
                          )}
                          {slot.remarks && (
                            <p className="text-xs text-gray-500">{slot.remarks}</p>
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

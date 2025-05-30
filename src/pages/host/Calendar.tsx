
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus, Edit, Trash2 } from 'lucide-react';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2024-01-15');
  const [slots, setSlots] = useState([
    { id: 1, date: '2024-01-15', startTime: '9:00 AM', endTime: '5:00 PM', available: true },
    { id: 2, date: '2024-01-15', startTime: '6:00 PM', endTime: '10:00 PM', available: false },
    { id: 3, date: '2024-01-16', startTime: '8:00 AM', endTime: '6:00 PM', available: true },
  ]);

  const toggleAvailability = (slotId: number) => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, available: !slot.available } : slot
    ));
  };

  const deleteSlot = (slotId: number) => {
    setSlots(prev => prev.filter(slot => slot.id !== slotId));
  };

  const selectedDateSlots = slots.filter(slot => slot.date === selectedDate);

  return (
    <Layout title="Availability Calendar">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Mock */}
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
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDate(`2024-01-${day.toString().padStart(2, '0')}`)}
                  className={`p-2 text-sm rounded hover:bg-gray-100 ${
                    selectedDate === `2024-01-${day.toString().padStart(2, '0')}` 
                      ? 'bg-primary text-white' 
                      : ''
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Slots for Selected Date */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Slots for {selectedDate}</CardTitle>
            <Button size="sm" className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Slot
            </Button>
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
    </Layout>
  );
};

export default Calendar;

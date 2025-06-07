import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Slot {
  id: string;
  time: string;
  status: 'available' | 'booked';
}

const ManageAvailability = () => {
  const [slots, setSlots] = useState<Slot[]>([
    { id: '1', time: '9:00 AM - 11:00 AM', status: 'available' },
    { id: '2', time: '11:00 AM - 1:00 PM', status: 'booked' },
    { id: '3', time: '1:00 PM - 3:00 PM', status: 'available' },
    { id: '4', time: '3:00 PM - 5:00 PM', status: 'available' },
  ]);

  const handleSlotStatusChange = (slotId: string, newStatus: 'available' | 'booked') => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, status: newStatus } : slot
    ));
    
    toast({
      title: "Slot Updated",
      description: `Slot ${slotId} marked as ${newStatus}`,
    });
  };

  const handleCancelSlot = (slotId: string) => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, status: 'available' as const } : slot
    ));
    
    toast({
      title: "Booking Cancelled",
      description: `Booking for slot ${slotId} has been cancelled`,
    });
  };

  return (
    <Layout title="Manage Availability">
      <div className="space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Manage Your Parking Slots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {slots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="text-lg font-semibold">Slot {slot.id}</h3>
                  <p className="text-sm text-gray-500">{slot.time}</p>
                </div>
                <div>
                  {slot.status === 'available' ? (
                    <Button onClick={() => handleSlotStatusChange(slot.id, 'booked')} className="bg-green-500 hover:bg-green-700 text-white">
                      Mark as Booked
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-red-500 text-white">Booked</Badge>
                      <Button variant="outline" onClick={() => handleCancelSlot(slot.id)}>
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ManageAvailability;

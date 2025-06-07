import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from "react-day-picker";
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from '@/hooks/use-toast';

interface HostSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  capacity: number;
  bookedCount: number;
  status: 'available' | 'booked' | 'cancelled';
  bookings?: {
    id: string;
    seekerName: string;
    vehicleCount: number;
    totalPrice: number;
    bookingTime: string;
  }[];
}

const ManageAvailability = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [slots, setSlots] = useState<HostSlot[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const addSlot = () => {
    if (!date?.from || !date?.to || !startTime || !endTime || !price || !capacity) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    const fromDate = date.from;
    const toDate = date.to;

    let currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const newSlot: HostSlot = {
        id: Math.random().toString(36).substring(7),
        date: dateStr,
        startTime: startTime,
        endTime: endTime,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        bookedCount: 0,
        status: 'available',
      };
      setSlots(prev => [...prev, newSlot]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDate({ from: new Date(), to: new Date() });
    setStartTime('');
    setEndTime('');
    setPrice('');
    setCapacity('');

    toast({
      title: "Slots added",
      description: "Parking slots have been added.",
    });
  };

  const deleteSlot = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (slot && slot.status === 'available') {
      setSlots(prev => prev.filter(s => s.id !== slotId));
      toast({
        title: "Slot deleted",
        description: "Parking slot has been removed.",
      });
    } else {
      toast({
        title: "Cannot delete slot",
        description: "Cannot delete a booked or cancelled slot.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout title="Manage Availability">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={format(date?.from!, 'yyyy-MM-dd') === format(date?.to!, 'yyyy-MM-dd') ?
                        "w-[300px] justify-start text-left font-normal" :
                        "w-[300px] justify-start text-left font-normal [&>span]:text-muted-foreground"}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        format(date.from, "yyyy-MM-dd") === format(date.to!, 'yyyy-MM-dd') ? format(date.from, "yyyy-MM-dd") : (
                          <span>
                            {format(date.from, "yyyy-MM-dd")} - {format(date.to!, "yyyy-MM-dd")}
                          </span>
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarUI
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Hour</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={addSlot}>Add Slot</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {slots.map((slot) => (
                <div key={slot.id} className="border rounded-md p-4">
                  <p>Date: {slot.date}</p>
                  <p>Time: {slot.startTime} - {slot.endTime}</p>
                  <p>Price: ${slot.price}/hour</p>
                  <p>Capacity: {slot.capacity}</p>
                  <Button onClick={() => deleteSlot(slot.id)} variant="destructive">
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ManageAvailability;

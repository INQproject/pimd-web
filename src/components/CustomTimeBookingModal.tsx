
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeSlot {
  id: number;
  time: string;
  price: number;
  available: boolean;
}

interface CustomTimeBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: TimeSlot;
  onConfirm: (customBooking: {
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
  }) => void;
}

const CustomTimeBookingModal: React.FC<CustomTimeBookingModalProps> = ({
  open,
  onOpenChange,
  slot,
  onConfirm
}) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState(0);
  const [customPrice, setCustomPrice] = useState(0);

  // Parse slot time range (e.g., "9:00 AM - 11:00 AM")
  const parseSlotTime = (timeString: string) => {
    const [start, end] = timeString.split(' - ');
    return { start: start.trim(), end: end.trim() };
  };

  // Generate time options within slot range
  const generateTimeOptions = () => {
    const { start, end } = parseSlotTime(slot.time);
    const options = [];
    
    // Convert to 24-hour format for easier calculation
    const startHour = convertTo24Hour(start);
    const endHour = convertTo24Hour(end);
    
    for (let hour = startHour; hour <= endHour; hour++) {
      const time12 = convertTo12Hour(hour);
      options.push(time12);
    }
    
    return options;
  };

  const convertTo24Hour = (time12: string) => {
    const [time, period] = time12.split(' ');
    let [hours] = time.split(':');
    let hour = parseInt(hours);
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    return hour;
  };

  const convertTo12Hour = (hour24: number) => {
    if (hour24 === 0) return '12:00 AM';
    if (hour24 < 12) return `${hour24}:00 AM`;
    if (hour24 === 12) return '12:00 PM';
    return `${hour24 - 12}:00 PM`;
  };

  const calculateDurationAndPrice = () => {
    if (!startTime || !endTime) return;
    
    const startHour = convertTo24Hour(startTime);
    const endHour = convertTo24Hour(endTime);
    const durationHours = endHour - startHour;
    
    if (durationHours > 0) {
      setDuration(durationHours);
      // Calculate proportional price (slot price per hour * duration)
      const slotDurationHours = 2; // Most slots are 2 hours based on the mockTimeSlots
      const pricePerHour = slot.price / slotDurationHours;
      setCustomPrice(Math.round(pricePerHour * durationHours));
    }
  };

  useEffect(() => {
    calculateDurationAndPrice();
  }, [startTime, endTime]);

  const handleConfirm = () => {
    if (startTime && endTime && duration > 0) {
      onConfirm({
        startTime,
        endTime,
        duration,
        price: customPrice
      });
      onOpenChange(false);
    }
  };

  const timeOptions = generateTimeOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Custom Time</DialogTitle>
          <DialogDescription>
            Select your preferred time within the available slot: {slot.time}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.slice(0, -1).map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions
                  .filter((time) => !startTime || convertTo24Hour(time) > convertTo24Hour(startTime))
                  .map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {duration > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-semibold">{duration} hour{duration > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span>Custom Time:</span>
                <span className="font-semibold">{startTime} - {endTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-semibold text-primary">${customPrice}</span>
              </div>
            </div>
          )}

          <Button 
            onClick={handleConfirm} 
            className="w-full btn-primary"
            disabled={!startTime || !endTime || duration <= 0}
          >
            Confirm Custom Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomTimeBookingModal;

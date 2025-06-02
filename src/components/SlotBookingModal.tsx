
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Clock, AlertCircle } from 'lucide-react';

interface TimeSlot {
  id: number;
  time: string;
  price: number;
  available: boolean;
  maxVehicles: number;
}

interface Vehicle {
  id: number;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
}

interface SlotBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: TimeSlot;
  onConfirm: (vehicles: Vehicle[]) => void;
}

const SlotBookingModal: React.FC<SlotBookingModalProps> = ({
  open,
  onOpenChange,
  slot,
  onConfirm
}) => {
  const [numVehicles, setNumVehicles] = useState(1);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 1, startTime: '', endTime: '', duration: 0, price: 0 }
  ]);

  // Parse slot time range (e.g., "9:00 AM - 11:00 AM")
  const parseSlotTime = (timeString: string) => {
    const [start, end] = timeString.split(' - ');
    return { start: start.trim(), end: end.trim() };
  };

  // Generate time options within slot range
  const generateTimeOptions = () => {
    const { start, end } = parseSlotTime(slot.time);
    const options = [];
    
    const startHour = convertTo24Hour(start);
    const endHour = convertTo24Hour(end);
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === endHour && minute > 0) break;
        const time12 = convertTo12Hour(hour, minute);
        options.push(time12);
      }
    }
    
    return options;
  };

  const convertTo24Hour = (time12: string) => {
    const [time, period] = time12.split(' ');
    let [hours, minutes = '0'] = time.split(':');
    let hour = parseInt(hours);
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    return hour + parseInt(minutes) / 60;
  };

  const convertTo12Hour = (hour24: number, minute: number = 0) => {
    const hour = Math.floor(hour24);
    const min = minute || (hour24 % 1) * 60;
    
    if (hour === 0) return `12:${min.toString().padStart(2, '0')} AM`;
    if (hour < 12) return `${hour}:${min.toString().padStart(2, '0')} AM`;
    if (hour === 12) return `12:${min.toString().padStart(2, '0')} PM`;
    return `${hour - 12}:${min.toString().padStart(2, '0')} PM`;
  };

  const updateVehicleCount = (count: number) => {
    setNumVehicles(count);
    const newVehicles = Array.from({ length: count }, (_, i) => 
      vehicles[i] || { id: i + 1, startTime: '', endTime: '', duration: 0, price: 0 }
    );
    setVehicles(newVehicles);
  };

  const updateVehicle = (vehicleId: number, field: 'startTime' | 'endTime', value: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const updated = { ...v, [field]: value };
        
        // Calculate duration and price
        if (updated.startTime && updated.endTime) {
          const startHour = convertTo24Hour(updated.startTime);
          const endHour = convertTo24Hour(updated.endTime);
          const duration = endHour - startHour;
          
          if (duration > 0) {
            updated.duration = duration;
            // Calculate proportional price based on slot duration
            const slotDuration = 2; // Default 2-hour slots
            const pricePerHour = slot.price / slotDuration;
            updated.price = Math.round(pricePerHour * duration);
          }
        }
        
        return updated;
      }
      return v;
    }));
  };

  const calculateTotalPrice = () => {
    return vehicles.reduce((total, vehicle) => total + vehicle.price, 0);
  };

  const isValidBooking = () => {
    return vehicles.every(v => v.startTime && v.endTime && v.duration > 0) && 
           numVehicles <= slot.maxVehicles;
  };

  const handleConfirm = () => {
    if (isValidBooking()) {
      onConfirm(vehicles);
      onOpenChange(false);
    }
  };

  const timeOptions = generateTimeOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-[#FF6B00]" />
            <span>Book Slot: {slot.time}</span>
          </DialogTitle>
          <DialogDescription>
            Customize booking times for multiple vehicles within this slot
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Vehicle Count Selection */}
          <div className="space-y-2">
            <Label htmlFor="num-vehicles">How many vehicles are you booking for?</Label>
            <Select value={numVehicles.toString()} onValueChange={(value) => updateVehicleCount(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: Math.min(5, slot.maxVehicles) }, (_, i) => i + 1).map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {numVehicles > slot.maxVehicles && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>This slot supports maximum {slot.maxVehicles} vehicles</span>
              </div>
            )}
          </div>

          {/* Vehicle Forms */}
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4 text-[#FF6B00]" />
                  <span className="font-medium">Car {vehicle.id}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Select 
                      value={vehicle.startTime} 
                      onValueChange={(value) => updateVehicle(vehicle.id, 'startTime', value)}
                    >
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
                    <Label>End Time</Label>
                    <Select 
                      value={vehicle.endTime} 
                      onValueChange={(value) => updateVehicle(vehicle.id, 'endTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions
                          .filter((time) => !vehicle.startTime || convertTo24Hour(time) > convertTo24Hour(vehicle.startTime))
                          .map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {vehicle.duration > 0 && (
                  <div className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-center text-sm">
                      <span>Duration: {vehicle.duration} hour{vehicle.duration !== 1 ? 's' : ''}</span>
                      <span className="font-semibold text-[#FF6B00]">${vehicle.price}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Booking Summary */}
          {vehicles.some(v => v.duration > 0) && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-lg mb-3">Booking Summary</h3>
              <div className="space-y-2">
                {vehicles.map((vehicle) => (
                  vehicle.duration > 0 && (
                    <div key={vehicle.id} className="flex justify-between items-center">
                      <span>Car {vehicle.id}: {vehicle.startTime} - {vehicle.endTime}</span>
                      <span className="font-semibold">${vehicle.price}</span>
                    </div>
                  )
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-[#FF6B00]">${calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleConfirm} 
            className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
            disabled={!isValidBooking()}
          >
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SlotBookingModal;

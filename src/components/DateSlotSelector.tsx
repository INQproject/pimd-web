
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, Clock, Users, Check, X } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

interface Slot {
  id: number;
  name: string;
  timeRange: string;
  capacity: number;
  available: number;
  date: Date;
}

interface DateSlotSelectorProps {
  spotName: string;
  spotPrice: number;
  availableSlots: Slot[];
  onConfirmBooking: (selectedSlots: Slot[]) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const DateSlotSelector: React.FC<DateSlotSelectorProps> = ({
  spotName,
  spotPrice,
  availableSlots,
  onConfirmBooking,
  onCancel,
  isOpen
}) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
  const [step, setStep] = useState<'dates' | 'slots'>('dates');

  if (!isOpen) return null;

  // Get unique available dates
  const availableDates = Array.from(
    new Set(availableSlots.map(slot => slot.date.toDateString()))
  ).map(dateString => new Date(dateString));

  const handleDateSelect = (dates: Date[]) => {
    setSelectedDates(dates);
    setSelectedSlots([]);
  };

  const handleSlotToggle = (slot: Slot) => {
    setSelectedSlots(prev => {
      const exists = prev.find(s => s.id === slot.id);
      if (exists) {
        return prev.filter(s => s.id !== slot.id);
      } else {
        return [...prev, slot];
      }
    });
  };

  const getSlotsForDate = (date: Date) => {
    return availableSlots.filter(slot => isSameDay(slot.date, date));
  };

  const totalPrice = selectedSlots.reduce((sum, slot) => {
    const [startTime, endTime] = slot.timeRange.split(' - ');
    const duration = 1; // Simplified - assuming 1 hour slots
    return sum + (spotPrice * duration);
  }, 0);

  const proceedToSlots = () => {
    if (selectedDates.length > 0) {
      setStep('slots');
    }
  };

  const backToDates = () => {
    setStep('dates');
    setSelectedSlots([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{spotName}</CardTitle>
              <p className="text-sm text-gray-600">${spotPrice}/hr</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Step indicator */}
          <div className="flex items-center space-x-2 mt-4">
            <Badge variant={step === 'dates' ? 'default' : 'secondary'}>
              1. Select Dates
            </Badge>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <Badge variant={step === 'slots' ? 'default' : 'secondary'}>
              2. Choose Slots
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {step === 'dates' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-[#FF6B00]" />
                  Select Available Dates
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Calendar
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={(dates) => handleDateSelect(dates || [])}
                      disabled={(date) => !availableDates.some(availableDate => 
                        isSameDay(date, availableDate)
                      )}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Available Dates:</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableDates.map((date, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <p className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</p>
                          <p className="text-sm text-gray-600">
                            {getSlotsForDate(date).length} slot(s) available
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {selectedDates.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Selected Dates:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedDates.map((date, index) => (
                      <Badge key={index} variant="secondary">
                        {format(date, 'MMM d, yyyy')}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={proceedToSlots}
                    className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90"
                  >
                    Continue to Select Slots
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 'slots' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-[#FF6B00]" />
                  Choose Time Slots
                </h3>
                <Button variant="outline" size="sm" onClick={backToDates}>
                  ← Back to Dates
                </Button>
              </div>

              <div className="grid gap-6">
                {selectedDates.map((date, dateIndex) => (
                  <div key={dateIndex}>
                    <h4 className="font-medium mb-3 text-[#FF6B00]">
                      {format(date, 'EEEE, MMMM d, yyyy')}
                    </h4>
                    
                    <div className="grid gap-3">
                      {getSlotsForDate(date).map((slot) => {
                        const isSelected = selectedSlots.some(s => s.id === slot.id);
                        
                        return (
                          <div
                            key={slot.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-[#FF6B00] bg-[#FF6B00]/5' 
                                : 'border-gray-200 hover:border-[#FF6B00]/50'
                            }`}
                            onClick={() => handleSlotToggle(slot)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">{slot.timeRange}</span>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Users className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    {slot.available}/{slot.capacity} available
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-[#FF6B00]">
                                  ${spotPrice}/hr
                                </span>
                                {isSelected && (
                                  <Check className="w-5 h-5 text-[#FF6B00]" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {dateIndex < selectedDates.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
              </div>

              {selectedSlots.length > 0 && (
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-3">Booking Summary</h4>
                  <div className="space-y-2 mb-4">
                    {selectedSlots.map((slot) => (
                      <div key={slot.id} className="flex justify-between text-sm">
                        <span>
                          {format(slot.date, 'MMM d')} • {slot.timeRange}
                        </span>
                        <span>${spotPrice}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-[#FF6B00]">${totalPrice}</span>
                  </div>
                  
                  <Button 
                    onClick={() => onConfirmBooking(selectedSlots)}
                    className="w-full mt-4 bg-[#FF6B00] hover:bg-[#FF6B00]/90"
                    size="lg"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DateSlotSelector;

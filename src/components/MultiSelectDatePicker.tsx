
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface MultiSelectDatePickerProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  availableDates?: Date[];
}

const MultiSelectDatePicker: React.FC<MultiSelectDatePickerProps> = ({
  selectedDates,
  onDatesChange,
  availableDates
}) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const isSelected = selectedDates.some(
      selectedDate => selectedDate.toDateString() === date.toDateString()
    );
    
    if (isSelected) {
      // Remove date if already selected
      onDatesChange(selectedDates.filter(
        selectedDate => selectedDate.toDateString() !== date.toDateString()
      ));
    } else {
      // Add date if not selected
      onDatesChange([...selectedDates, date]);
    }
  };

  const clearAllDates = () => {
    onDatesChange([]);
  };

  const isDateAvailable = (date: Date) => {
    if (!availableDates) return true;
    return availableDates.some(
      availableDate => availableDate.toDateString() === date.toDateString()
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Select Multiple Dates</span>
          {selectedDates.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllDates}>
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          onSelect={handleDateSelect}
          className="rounded-md border"
          disabled={(date) => 
            date < new Date() || 
            (availableDates && !isDateAvailable(date))
          }
          modifiers={{
            selected: (date) => selectedDates.some(
              selectedDate => selectedDate.toDateString() === date.toDateString()
            )
          }}
          modifiersStyles={{
            selected: { backgroundColor: '#FF6B00', color: 'white' }
          }}
        />
        
        {selectedDates.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Dates:</p>
            <div className="flex flex-wrap gap-2">
              {selectedDates.map((date, index) => (
                <Badge key={index} variant="secondary" className="bg-[#FF6B00] text-white">
                  {format(date, 'MMM dd, yyyy')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiSelectDatePicker;

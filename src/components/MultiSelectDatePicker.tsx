
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { format } from 'date-fns';

interface MultiSelectDatePickerProps {
  availableDates: string[];
  selectedDates: string[];
  onDatesChange: (dates: string[]) => void;
}

const MultiSelectDatePicker = ({ availableDates, selectedDates, onDatesChange }: MultiSelectDatePickerProps) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const availableDateObjects = availableDates.map(dateStr => new Date(dateStr));
  const selectedDateObjects = selectedDates.map(dateStr => new Date(dateStr));

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (!availableDates.includes(dateStr)) return;
    
    if (selectedDates.includes(dateStr)) {
      onDatesChange(selectedDates.filter(d => d !== dateStr));
    } else {
      onDatesChange([...selectedDates, dateStr]);
    }
  };

  const removeDate = (dateToRemove: string) => {
    onDatesChange(selectedDates.filter(d => d !== dateToRemove));
  };

  const clearAllDates = () => {
    onDatesChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Multi-Select Dates (Optional)</label>
        {selectedDates.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllDates}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>
      
      {selectedDates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedDates.map(dateStr => (
            <Badge key={dateStr} variant="secondary" className="flex items-center gap-1">
              {format(new Date(dateStr), 'MMM d')}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => removeDate(dateStr)}
              />
            </Badge>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        onClick={() => setShowCalendar(!showCalendar)}
        className="w-full justify-start"
      >
        {showCalendar ? 'Hide Calendar' : 'Select Multiple Dates'}
      </Button>

      {showCalendar && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Select Available Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="multiple"
              selected={selectedDateObjects}
              onSelect={(dates) => {
                if (dates) {
                  const dateStrings = dates.map(date => format(date, 'yyyy-MM-dd'));
                  onDatesChange(dateStrings.filter(dateStr => availableDates.includes(dateStr)));
                }
              }}
              disabled={(date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                return !availableDates.includes(dateStr) || date < new Date();
              }}
              className="rounded-md border pointer-events-auto"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiSelectDatePicker;

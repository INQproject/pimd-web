
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface MultiDateSelectorProps {
  availableDates: string[];
  selectedDates: string[];
  onDatesChange: (dates: string[]) => void;
}

const MultiDateSelector: React.FC<MultiDateSelectorProps> = ({
  availableDates,
  selectedDates,
  onDatesChange
}) => {
  const handleDateToggle = (date: string) => {
    if (selectedDates.includes(date)) {
      onDatesChange(selectedDates.filter(d => d !== date));
    } else {
      onDatesChange([...selectedDates, date]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-[#FF6B00]" />
          Select Multiple Dates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableDates.map((date) => (
            <div key={date} className="flex items-center space-x-2">
              <Checkbox
                id={`date-${date}`}
                checked={selectedDates.includes(date)}
                onCheckedChange={() => handleDateToggle(date)}
              />
              <Label 
                htmlFor={`date-${date}`} 
                className="text-sm cursor-pointer hover:text-[#FF6B00] transition-colors"
              >
                {formatDate(date)}
              </Label>
            </div>
          ))}
        </div>
        {selectedDates.length > 0 && (
          <div className="mt-4 p-3 bg-[#FF6B00]/10 rounded-lg">
            <p className="text-sm font-medium text-[#FF6B00]">
              Selected {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiDateSelector;

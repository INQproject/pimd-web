
import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface DateSelectorProps {
  availableDates: string[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  availableDates,
  selectedDate,
  onDateSelect
}) => {
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d');
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-[#1C1C1C]">Select Date</h3>
      <div className="flex flex-wrap gap-2">
        {availableDates.map((date) => (
          <Button
            key={date}
            variant={selectedDate === date ? "default" : "outline"}
            onClick={() => onDateSelect(date)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedDate === date
                ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white'
                : 'border-gray-300 hover:border-[#FF6B00] hover:text-[#FF6B00]'
            }`}
          >
            {formatDateForDisplay(date)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;

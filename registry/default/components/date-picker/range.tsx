'use client';

import { useState } from 'react';
import { Button } from '@/registry/default/ui/button';
import { Calendar } from '@/registry/default/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

export default function DatePickerDemo() {
  const today = new Date();
  const defaultDate: DateRange = {
    from: today,
    to: addDays(today, 5),
  };

  const [date, setDate] = useState<DateRange | undefined>(defaultDate);

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const handleApply = () => {
    if (date) {
      setDate(date);
    }
    setIsPopoverOpen(false);
  };

  const handleReset = () => {
    setDate(defaultDate);
    setIsPopoverOpen(false);
  };

  const handleSelect = (selected: DateRange | undefined) => {
    setDate({
      from: selected?.from || undefined,
      to: selected?.to || undefined,
    });
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          mode="input"
          placeholder={!date?.from && !date?.to}
          className="w-[250px]"
        >
          <CalendarIcon />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
              </>
            ) : (
              format(date.from, 'LLL dd, y')
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          autoFocus
          mode="range"
          defaultMonth={date?.from}
          showOutsideDays={false}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
        <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

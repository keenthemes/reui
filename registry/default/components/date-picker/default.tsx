'use client';

import * as React from 'react';
import { Button } from '@/registry/default/ui/button';
import { Calendar } from '@/registry/default/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();

  const handleReset = (e: React.MouseEvent<HTMLElement>) => {
    setDate(undefined);
    e.preventDefault();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative w-[250px]">
          <Button
            type="button"
            variant="outline"
            mode="input"
            placeholder={!date}
            className="w-full"
          >
            <CalendarIcon />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
          {date && (
            <Button
              type="button"
              variant="dim"
              size="sm"
              className="absolute top-1/2 -end-0 -translate-y-1/2"
              onClick={handleReset}
            >
              <X />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} autoFocus />
      </PopoverContent>
    </Popover>
  );
}

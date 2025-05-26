'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Button, ButtonArrow } from '@/registry/default/ui/button';
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/default/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/ui/popover';

const topCities = [
  {
    value: 'amsterdam',
    label: 'Amsterdam, Netherlands',
  },
  {
    value: 'london',
    label: 'London, UK',
  },
  {
    value: 'paris',
    label: 'Paris, France',
  },
  {
    value: 'tokyo',
    label: 'Tokyo, Japan',
  },
  {
    value: 'new_york',
    label: 'New York, USA',
  },
  {
    value: 'dubai',
    label: 'Dubai, UAE',
  },
];

export default function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('new_york');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          mode="input"
          placeholder={!value}
          aria-expanded={open}
          className="w-[200px]"
        >
          <span className={cn('truncate')}>
            {value
              ? topCities.find((city) => city.value === value)?.label
              : 'Select city...'}
          </span>
          <ButtonArrow />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {topCities.map((city) => (
                <CommandItem
                  key={city.value}
                  value={city.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <CommandCheck
                    className={cn(
                      'ms-0',
                      value === city.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="truncate">{city.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

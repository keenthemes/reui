'use client';

import * as React from 'react';
import { Badge } from '@/registry/default/ui/badge';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover';

const topCities = [
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'new_york', label: 'New York' },
  { value: 'london', label: 'London' },
  { value: 'paris', label: 'Paris' },
  { value: 'dubai', label: 'Dubai' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'hong_kong', label: 'Hong Kong' },
  { value: 'los_angeles', label: 'Los Angeles' },
  { value: 'seoul', label: 'Seoul' },
  { value: 'amsterdam', label: 'Amsterdam' },
];

export default function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([
    'new_york',
    'london',
    'tokyo',
    'paris',
    'dubai',
    'singapore',
  ]);

  const toggleSelection = (value: string) => {
    setSelectedValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  return (
    <div className="w-[200px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            mode="input"
            placeholder={selectedValues.length === 0}
            className="w-full"
          >
            {selectedValues.length > 3 ? (
              <span>
                <Badge variant="outline" size="sm">
                  {selectedValues.length}
                </Badge>{' '}
                cities selected
              </span>
            ) : (
              <span>Select cities</span>
            )}
            <ButtonArrow />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
          <Command>
            <CommandInput placeholder="Search city..." />
            <CommandList>
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup>
                {topCities.map((city) => (
                  <CommandItem key={city.value} value={city.value} onSelect={() => toggleSelection(city.value)}>
                    <span className="truncate">{city.label}</span>
                    {selectedValues.includes(city.value) && <CommandCheck />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

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
  CommandSeparator,
} from '@/registry/default/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover';
import { ScrollArea } from '@/registry/default/ui/scroll-area';
import { Plus } from 'lucide-react';

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
    value: 'san_francisco',
    label: 'San Francisco, USA',
  },
];

export default function ComboboxDemo() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          mode="input"
          placeholder={!value}
          className="w-[200px]"
        >
          <span className={cn('truncate')}>
            {value ? topCities.find((city) => city.value === value)?.label : 'Select city...'}
          </span>
          <ButtonArrow />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandList>
            <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
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
                    <span className="truncate">{city.label}</span>
                    {value === city.value && <CommandCheck />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
          <CommandSeparator />
          <CommandGroup>
            <Button variant="ghost" size="sm" className="w-full justify-start font-normal px-1.5">
              <Plus className="size-4" aria-hidden="true" />
              Add new city
            </Button>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

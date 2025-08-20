'use client';

import { useMemo, useState } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover';
import { ScrollArea } from '@/registry/default/ui/scroll-area';

export default function TimezoneSelector() {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('Europe/London');

  // Fetch supported timezones
  const timezones = Intl.supportedValuesOf('timeZone');

  const formattedTimezones = useMemo(() => {
    return timezones
      .map((timezone) => {
        const formatter = new Intl.DateTimeFormat('en', {
          timeZone: timezone,
          timeZoneName: 'shortOffset',
        });
        const parts = formatter.formatToParts(new Date());
        const offset = parts.find((part) => part.type === 'timeZoneName')?.value || '';
        const formattedOffset = offset === 'GMT' ? 'GMT+0' : offset;

        return {
          value: timezone,
          label: `(${formattedOffset}) ${timezone.replace(/_/g, ' ')}`,
          numericOffset: parseInt(formattedOffset.replace('GMT', '').replace('+', '') || '0'),
        };
      })
      .sort((a, b) => a.numericOffset - b.numericOffset); // Sort by numeric offset
  }, [timezones]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          mode="input"
          placeholder={!value}
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          <span className={cn('truncate')}>
            {value ? formattedTimezones.find((timezone) => timezone.value === value)?.label : 'Select a timezone'}
          </span>
          <ButtonArrow />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
        <Command>
          <CommandInput placeholder="Search timezone..." />
          <CommandList>
            <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
              <CommandEmpty>No timezone found.</CommandEmpty>
              <CommandGroup>
                {formattedTimezones.map(({ value: itemValue, label }) => (
                  <CommandItem
                    key={itemValue}
                    value={itemValue}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    <span className="truncate">{label}</span>
                    {value === itemValue && <CommandCheck />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

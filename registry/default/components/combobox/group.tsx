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
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover';
import { ScrollArea, ScrollBar } from '@/registry/default/ui/scroll-area';

const groupedCountries = [
  {
    group: 'Europe',
    countries: [
      { value: 'netherlands', label: 'Netherlands', flag: '🇳🇱' },
      { value: 'united_kingdom', label: 'United Kingdom', flag: '🇬🇧' },
      { value: 'france', label: 'France', flag: '🇫🇷' },
      { value: 'germany', label: 'Germany', flag: '🇩🇪' },
      { value: 'italy', label: 'Italy', flag: '🇮🇹' },
    ],
  },
  {
    group: 'Asia',
    countries: [
      { value: 'japan', label: 'Japan', flag: '🇯🇵' },
      { value: 'china', label: 'China', flag: '🇨🇳' },
      { value: 'india', label: 'India', flag: '🇮🇳' },
      { value: 'uae', label: 'United Arab Emirates', flag: '🇦🇪' },
      { value: 'south_korea', label: 'South Korea', flag: '🇰🇷' },
    ],
  },
  {
    group: 'Africa',
    countries: [
      { value: 'south_africa', label: 'South Africa', flag: '🇿🇦' },
      { value: 'nigeria', label: 'Nigeria', flag: '🇳🇬' },
      { value: 'egypt', label: 'Egypt', flag: '🇪🇬' },
      { value: 'kenya', label: 'Kenya', flag: '🇰🇪' },
      { value: 'morocco', label: 'Morocco', flag: '🇲🇦' },
    ],
  },
  {
    group: 'North America',
    countries: [
      { value: 'united_states', label: 'United States', flag: '🇺🇸' },
      { value: 'canada', label: 'Canada', flag: '🇨🇦' },
      { value: 'mexico', label: 'Mexico', flag: '🇲🇽' },
      { value: 'cuba', label: 'Cuba', flag: '🇨🇺' },
      { value: 'jamaica', label: 'Jamaica', flag: '🇯🇲' },
    ],
  },
  {
    group: 'South America',
    countries: [
      { value: 'brazil', label: 'Brazil', flag: '🇧🇷' },
      { value: 'argentina', label: 'Argentina', flag: '🇦🇷' },
      { value: 'colombia', label: 'Colombia', flag: '🇨🇴' },
      { value: 'chile', label: 'Chile', flag: '🇨🇱' },
      { value: 'peru', label: 'Peru', flag: '🇵🇪' },
    ],
  },
  {
    group: 'Oceania',
    countries: [
      { value: 'australia', label: 'Australia', flag: '🇦🇺' },
      { value: 'new_zealand', label: 'New Zealand', flag: '🇳🇿' },
      { value: 'fiji', label: 'Fiji', flag: '🇫🇯' },
      { value: 'papua_new_guinea', label: 'Papua New Guinea', flag: '🇵🇬' },
      { value: 'samoa', label: 'Samoa', flag: '🇼🇸' },
    ],
  },
];

export default function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          mode="input"
          placeholder={!value}
          aria-expanded={open}
          className="w-[250px]"
        >
          <span className={cn('truncate')}>
            {value
              ? groupedCountries.flatMap((group) => group.countries).find((country) => country.value === value)?.label
              : 'Select country...'}
          </span>
          <ButtonArrow />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea viewportClassName="max-h-[300px]">
              <CommandEmpty>No country found.</CommandEmpty>
              {groupedCountries.map((group) => (
                <CommandGroup key={group.group} heading={group.group}>
                  {group.countries.map((country) => (
                    <CommandItem
                      key={country.value}
                      value={country.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{country.flag}</span>
                        {country.label}
                      </span>
                      {value === country.value && <CommandCheck />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
              <ScrollBar />
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

'use client';

import * as React from 'react';
import { Badge, BadgeButton } from '@/registry/default/ui/badge';
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
import { X } from 'lucide-react';

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
  const [expanded, setExpanded] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([
    'new_york',
    'london',
    'tokyo',
    'paris',
    'singapore',
    'amsterdam',
  ]);

  const toggleSelection = (value: string) => {
    setSelectedValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const removeSelection = (value: string) => {
    setSelectedValues((prev) => prev.filter((v) => v !== value));
  };

  // Define maxShownItems before using visibleItems
  const maxShownItems = 2;
  const visibleItems = expanded ? selectedValues : selectedValues.slice(0, maxShownItems);
  const hiddenCount = selectedValues.length - visibleItems.length;

  return (
    <div className="w-[300px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            autoHeight={true}
            mode="input"
            placeholder={selectedValues.length === 0}
            className="w-full px-1.5 py-1 relative"
          >
            <div className="flex flex-wrap items-center gap-1 pe-2.5">
              {selectedValues.length > 0 ? (
                <>
                  {visibleItems.map((val) => {
                    const city = topCities.find((c) => c.value === val);
                    return city ? (
                      <Badge key={val} appearance="stroke">
                        {city.label}
                        <BadgeButton
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSelection(val);
                          }}
                        >
                          <X />
                        </BadgeButton>
                      </Badge>
                    ) : null;
                  })}
                  {/* Always show "Less" button when expanded */}
                  {hiddenCount > 0 || expanded ? (
                    <Badge
                      className="cursor-pointer px-1.5 text-muted-foreground hover:bg-accent"
                      appearance="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded((prev) => !prev);
                      }}
                    >
                      {expanded ? 'Show Less' : `+${hiddenCount} more`}
                    </Badge>
                  ) : null}
                </>
              ) : (
                <span className="px-2.5">Select cities</span>
              )}
            </div>
            <ButtonArrow className="absolute top-2 end-3" />
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

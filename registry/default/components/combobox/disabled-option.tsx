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

const programmingLanguages = [
  {
    value: 'javascript',
    label: 'JavaScript',
    disabled: false,
  },
  {
    value: 'python',
    label: 'Python',
    disabled: false,
  },
  {
    value: 'java',
    label: 'Java',
    disabled: true, // Disabled option
  },
  {
    value: 'csharp',
    label: 'C#',
    disabled: false,
  },
  {
    value: 'ruby',
    label: 'Ruby',
    disabled: false,
  },
  {
    value: 'php',
    label: 'PHP',
    disabled: true, // Disabled option
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
          mode="input"
          placeholder={!value}
          aria-expanded={open}
          className="w-[200px]"
        >
          <span className={cn('truncate')}>
            {value ? programmingLanguages.find((lang) => lang.value === value)?.label : 'Select language...'}
          </span>
          <ButtonArrow />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {programmingLanguages.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={(currentValue) => {
                    if (!lang.disabled) {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }
                  }}
                  className={cn(lang.disabled && 'cursor-not-allowed opacity-50')}
                  disabled={lang.disabled}
                >
                  <span className="truncate">{lang.label}</span>
                  {value === lang.value && !lang.disabled && <CommandCheck />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

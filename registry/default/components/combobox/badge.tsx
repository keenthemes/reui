'use client';

import * as React from 'react';
import { Badge, BadgeProps } from '@/registry/default/ui/badge';
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

const categories = [
  { value: 'publishing', label: 'Digital Publishing', state: 'primary' },
  { value: 'finance', label: 'Finance Tools', state: 'destructive' },
  { value: 'b2b', label: 'B2B Solutions', state: 'primary' },
  { value: 'enterprise', label: 'Enterprise Apps', state: 'secondary' },
  { value: 'ecommerce', label: 'E-commerce Tools', state: 'destructive' },
  { value: 'b2c', label: 'B2C Services', state: 'destructive' },
  { value: 'automation', label: 'Automation Tools', state: 'destructive' },
  { value: 'ai_tools', label: 'AI Applications', state: 'primary' },
  { value: 'saas', label: 'SaaS Platforms', state: 'primary' },
  { value: 'paas', label: 'PaaS Solutions', state: 'secondary' },
  { value: 'healthcare', label: 'Healthcare Tech', state: 'primary' },
  { value: 'education', label: 'Education Tools', state: 'secondary' },
  { value: 'gaming', label: 'Gaming Platforms', state: 'warning' },
  { value: 'retail', label: 'Retail Systems', state: 'destructive' },
  { value: 'logistics', label: 'Logistics Tools', state: 'mono' },
  { value: 'travel', label: 'Travel Services', state: 'primary' },
  { value: 'real_estate', label: 'Real Estate Apps', state: 'primary' },
  { value: 'hospitality', label: 'Hospitality Management', state: 'secondary' },
  { value: 'legal', label: 'Legal Software', state: 'primary' },
  { value: 'media', label: 'Media Platforms', state: 'destructive' },
];

export default function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const selectedCategory = categories.find((category) => category.value === value);

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
          {selectedCategory ? (
            <Badge variant={selectedCategory.state as keyof BadgeProps['variant']} appearance="outline">
              {selectedCategory.label}
            </Badge>
          ) : (
            <span>Select category...</span>
          )}
          <ButtonArrow />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <ScrollArea viewportClassName="max-h-[250px] [&>div]:block!">
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.value}
                    value={category.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Badge variant={category.state as keyof BadgeProps['variant']} appearance="outline">
                      {category.label}
                    </Badge>
                    {value === category.value && <CommandCheck />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
          <CommandSeparator />
          <CommandGroup>
            <Button variant="ghost" size="sm" className="w-full justify-start font-normal px-1.5">
              <Plus className="size-4" aria-hidden="true" />
              Add category
            </Button>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

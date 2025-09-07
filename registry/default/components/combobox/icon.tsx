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
import {
  Activity,
  Brain,
  Cloud,
  Code,
  Cpu,
  Database,
  Globe,
  Layout,
  PenTool,
  Plus,
  Rocket,
  Server,
  ShieldCheck,
} from 'lucide-react';

const serviceCategories = [
  { value: 'database_systems', label: 'Database Systems', icon: <Database /> },
  { value: 'caching_systems', label: 'Caching Systems', icon: <Server /> },
  { value: 'ai_services', label: 'AI Services', icon: <Cpu /> },
  { value: 'machine_learning', label: 'Machine Learning', icon: <Brain /> },
  { value: 'cloud_storage', label: 'Cloud Storage', icon: <Cloud /> },
  { value: 'ui_design_tools', label: 'UI Design Tools', icon: <PenTool /> },
  { value: 'web_prototyping', label: 'Web Prototyping', icon: <Layout /> },
  { value: 'cybersecurity', label: 'Cybersecurity', icon: <ShieldCheck /> },
  { value: 'web_development', label: 'Web Development', icon: <Code /> },
  { value: 'data_analytics', label: 'Data Analytics', icon: <Activity /> },
  { value: 'devops', label: 'DevOps Tools', icon: <Rocket /> },
  { value: 'networking', label: 'Networking', icon: <Globe /> },
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
          className="w-[250px] justify-between"
        >
          <span className={cn('truncate')}>
            {value ? serviceCategories.find((item) => item.value === value)?.label : 'Select a category...'}
          </span>
          <ButtonArrow />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {serviceCategories.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="opacity-60">{item.icon}</span>
                      {item.label}
                    </span>
                    {value === item.value && <CommandCheck />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
          <CommandSeparator />
          <CommandGroup>
            <Button variant="ghost" size="sm" className="w-full justify-start font-normal px-2.5">
              <Plus className="size-4" aria-hidden="true" />
              Add category
            </Button>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

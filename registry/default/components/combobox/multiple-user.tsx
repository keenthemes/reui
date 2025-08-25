'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
  avatarStatusVariants,
} from '@/registry/default/ui/avatar';
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
import { ScrollArea } from '@/registry/default/ui/scroll-area';
import { X } from 'lucide-react';

const users = [
  {
    id: 'alice-johnson',
    name: 'Alice Johnson',
    email: 'alice.johnson@gmail.com',
    avatar: '/media/avatars/1.png',
    status: 'online',
  },
  {
    id: 'bob-smith',
    name: 'Bob Smith',
    email: 'bob.smith@yahoo.com',
    avatar: '/media/avatars/2.png',
    status: 'offline',
  },
  {
    id: 'carol-davis',
    name: 'Carol Davis',
    email: 'carol.davis@hotmail.com',
    avatar: '/media/avatars/3.png',
    status: 'away',
  },
  {
    id: 'david-wilson',
    name: 'David Wilson',
    email: 'david.wilson@outlook.com',
    avatar: '/media/avatars/4.png',
    status: 'online',
  },
  {
    id: 'eve-martinez',
    name: 'Eve Martinez',
    email: 'eve.martinez@gmail.com',
    avatar: '/media/avatars/5.png',
    status: 'busy',
  },
  {
    id: 'frank-garcia',
    name: 'Frank Garcia',
    email: 'frank.garcia@icloud.com',
    avatar: '/media/avatars/6.png',
    status: 'online',
  },
  {
    id: 'grace-lee',
    name: 'Grace Lee',
    email: 'grace.lee@protonmail.com',
    avatar: '/media/avatars/7.png',
    status: 'busy',
  },
  {
    id: 'henry-walker',
    name: 'Henry Walker',
    email: 'henry.walker@gmail.com',
    avatar: '/media/avatars/8.png',
    status: 'online',
  },
];

export default function ComboboxDemo() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>(['alice-johnson', 'david-wilson']);

  const toggleSelection = (value: string) => {
    setSelectedValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const removeSelection = (value: string) => {
    setSelectedValues((prev) => prev.filter((v) => v !== value));
  };

  return (
    <div className="w-[350px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            autoHeight={true}
            mode="input"
            placeholder={selectedValues.length === 0}
            className="w-full p-1 relative"
          >
            <div className="flex flex-wrap items-center gap-1 pe-2.5">
              {selectedValues.length > 0 ? (
                selectedValues.map((val) => {
                  const user = users.find((u) => u.id === val);
                  return user ? (
                    <Badge key={val} variant="outline" className="gap-1.5">
                      <Avatar className="size-4">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
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
                })
              ) : (
                <span className="px-2.5">Select users...</span>
              )}
            </div>
            <ButtonArrow className="absolute top-2 end-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
          <Command>
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {users.map((user) => (
                    <CommandItem key={user.id} value={user.name} onSelect={() => toggleSelection(user.id)}>
                      <span className="flex items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-muted-foreground text-sm">{user.email}</span>
                        </span>
                      </span>
                      {selectedValues.includes(user.id) && <CommandCheck />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

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
import { ScrollArea } from '@/registry/default/ui/scroll-area';

const users = [
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@gmail.com',
    avatar: '/media/avatars/1.png',
    status: 'online',
  },
  {
    name: 'Bob Smith',
    email: 'bob.smith@yahoo.com',
    avatar: '/media/avatars/2.png',
    status: 'offline',
  },
  {
    name: 'Carol Davis',
    email: 'carol.davis@hotmail.com',
    avatar: '/media/avatars/3.png',
    status: 'away',
  },
  {
    name: 'David Wilson',
    email: 'david.wilson@outlook.com',
    avatar: '/media/avatars/4.png',
    status: 'online',
  },
  {
    name: 'Eve Martinez',
    email: 'eve.martinez@gmail.com',
    avatar: '/media/avatars/5.png',
    status: 'busy',
  },
  {
    name: 'Frank Garcia',
    email: 'frank.garcia@icloud.com',
    avatar: '/media/avatars/6.png',
    status: 'online',
  },
  {
    name: 'Grace Lee',
    email: 'grace.lee@protonmail.com',
    avatar: '/media/avatars/7.png',
    status: 'busy',
  },
  {
    name: 'Henry Walker',
    email: 'henry.walker@gmail.com',
    avatar: '/media/avatars/8.png',
    status: 'online',
  },
];

export default function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const selectedUser = users.find((user) => user.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          mode="input"
          placeholder={!value}
          aria-expanded={open}
          className="w-[300px]"
        >
          {selectedUser ? (
            <span className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                />
                <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                <AvatarIndicator className="-end-2 -bottom-2">
                  <AvatarStatus
                    variant={
                      selectedUser.status as keyof typeof avatarStatusVariants
                    }
                    className="size-2.5"
                  />
                </AvatarIndicator>
              </Avatar>
              <span className="font-medium">{selectedUser.name}</span>
            </span>
          ) : (
            <span>Select a user...</span>
          )}
          <ButtonArrow />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandList>
            <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.name}
                    value={user.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                        <AvatarIndicator className="-end-2 -bottom-2">
                          <AvatarStatus
                            variant={
                              user.status as keyof typeof avatarStatusVariants
                            }
                            className="size-2.5"
                          />
                        </AvatarIndicator>
                      </Avatar>
                      <span className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-muted-foreground text-sm">
                          {user.email}
                        </span>
                      </span>
                    </span>
                    <CommandCheck
                      className={cn(
                        value === user.name ? 'opacity-100' : 'opacity-0',
                      )}
                    />
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

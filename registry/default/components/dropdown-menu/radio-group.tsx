'use client';

import * as React from 'react';
import { Button } from '@/registry/default/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';

export default function DropdownMenuDemo() {
  const [notificationMethod, setNotificationMethod] = React.useState('email'); // Default method

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Show Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Notification Method</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={notificationMethod}
          onValueChange={setNotificationMethod}
        >
          <DropdownMenuRadioItem
            value="email"
            onSelect={(event) => event.preventDefault()}
          >
            Email Notifications
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="sms"
            onSelect={(event) => event.preventDefault()}
          >
            SMS Notifications
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="push"
            onSelect={(event) => event.preventDefault()}
          >
            Push Notifications
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

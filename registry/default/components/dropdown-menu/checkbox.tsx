'use client';

import * as React from 'react';
import { Button } from '@/registry/default/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';

export default function DropdownMenuDemo() {
  type Checked = DropdownMenuCheckboxItemProps['checked'];

  const [showTaskList, setShowTaskList] = React.useState<Checked>(true);
  const [showCalendar, setShowCalendar] = React.useState<Checked>(false);
  const [showNotifications, setShowNotifications] = React.useState<Checked>(true);
  const [showAnalytics, setShowAnalytics] = React.useState<Checked>(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Show Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Dashboard Widgets</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showTaskList}
          onSelect={(event) => event.preventDefault()}
          onCheckedChange={setShowTaskList}
        >
          Task List
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showCalendar}
          onSelect={(event) => event.preventDefault()}
          onCheckedChange={setShowCalendar}
        >
          Calendar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showNotifications}
          onSelect={(event) => event.preventDefault()}
          onCheckedChange={setShowNotifications}
        >
          Notifications
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showAnalytics}
          onSelect={(event) => event.preventDefault()}
          onCheckedChange={setShowAnalytics}
        >
          Analytics Overview
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

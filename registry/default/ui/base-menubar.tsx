'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { Menu as BaseUIMenu } from '@base-ui-components/react/menu';

// Root - Groups all parts of the menubar
function Menubar({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="menubar"
      className={cn('flex h-10 items-center space-x-1 rounded-md border bg-background p-1', className)}
      {...props}
    />
  );
}

// Menu - Groups all parts of a menubar menu
function MenubarMenu({ ...props }: React.ComponentProps<typeof BaseUIMenu.Root>) {
  return <BaseUIMenu.Root data-slot="menubar-menu" {...props} />;
}

// Trigger - A button that opens the menubar menu
function MenubarTrigger({ className, ...props }: React.ComponentProps<typeof BaseUIMenu.Trigger>) {
  return (
    <BaseUIMenu.Trigger
      data-slot="menubar-trigger"
      className={cn(
        'flex cursor-pointer select-none items-center rounded-md px-3 py-1.5 text-sm font-medium outline-hidden',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        '[&>svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&>svg]:shrink-0',
        'data-[here=true]:bg-accent',
        className,
      )}
      {...props}
    />
  );
}

// Portal - A portal element that moves the popup to a different part of the DOM
function MenubarPortal({ ...props }: React.ComponentProps<typeof BaseUIMenu.Portal>) {
  return <BaseUIMenu.Portal data-slot="menubar-portal" {...props} />;
}

// Content - A container for the menubar items
function MenubarContent({
  className,
  align = 'start',
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.Popup> & {
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  sideOffset?: number;
}) {
  return (
    <BaseUIMenu.Portal>
      <BaseUIMenu.Positioner sideOffset={sideOffset} alignOffset={alignOffset}>
        <BaseUIMenu.Popup
          data-slot="menubar-content"
          className={cn(
            'space-y-0.5 z-50 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md shadow-black/5 transition-shadow data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className,
          )}
          {...props}
        />
      </BaseUIMenu.Positioner>
    </BaseUIMenu.Portal>
  );
}

// Item - An individual interactive item in the menubar
function MenubarItem({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.Item> & {
  inset?: boolean;
}) {
  return (
    <BaseUIMenu.Item
      data-slot="menubar-item"
      className={cn(
        'relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[active=true]:bg-accent data-[active=true]:text-accent-foreground',
        inset && 'ps-8',
        className,
      )}
      {...props}
    />
  );
}

// Separator - A separator element accessible to screen readers
function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof BaseUIMenu.Separator>) {
  return (
    <BaseUIMenu.Separator
      data-slot="menubar-separator"
      className={cn('-mx-2 my-1.5 h-px bg-muted', className)}
      {...props}
    />
  );
}

// Group - Groups related menubar items with the corresponding label
function MenubarGroup({ ...props }: React.ComponentProps<typeof BaseUIMenu.Group>) {
  return <BaseUIMenu.Group data-slot="menubar-group" {...props} />;
}

// Label - An accessible label that is automatically associated with its parent group
function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.GroupLabel> & {
  inset?: boolean;
}) {
  return (
    <BaseUIMenu.GroupLabel
      data-slot="menubar-label"
      className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'ps-8', className)}
      {...props}
    />
  );
}

// RadioGroup - Groups related radio items
function MenubarRadioGroup({ value, ...props }: React.ComponentProps<'div'> & { value?: string }) {
  return <div data-slot="menubar-radio-group" data-value={value} {...props} />;
}

// RadioItem - A menubar item that works like a radio button in a given group
function MenubarRadioItem({ 
  className, 
  children, 
  value,
  ...props 
}: React.ComponentProps<typeof BaseUIMenu.Item> & { value?: string }) {
  return (
    <BaseUIMenu.Item
      data-slot="menubar-radio-item"
      data-value={value}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-md py-1.5 ps-8 pe-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex h-3.5 w-3.5 items-center justify-center">
        <Circle className="h-2 w-2 fill-current" />
      </span>
      {children}
    </BaseUIMenu.Item>
  );
}

// CheckboxItem - A menubar item that toggles a setting on or off
function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.Item> & {
  checked?: boolean;
}) {
  return (
    <BaseUIMenu.Item
      data-slot="menubar-checkbox-item"
      data-checked={checked}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-md py-1.5 ps-8 pe-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4 text-primary" />}
      </span>
      {children}
    </BaseUIMenu.Item>
  );
}

// Sub - Groups all parts of a submenu
function MenubarSub({ ...props }: React.ComponentProps<typeof BaseUIMenu.SubmenuRoot>) {
  return <BaseUIMenu.SubmenuRoot data-slot="menubar-sub" {...props} />;
}

// SubTrigger - A menubar item that opens a submenu
function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.SubmenuTrigger> & {
  inset?: boolean;
}) {
  return (
    <BaseUIMenu.SubmenuTrigger
      data-slot="menubar-sub-trigger"
      className={cn(
        'flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-hidden',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        '[&>svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&>svg]:shrink-0',
        'data-[here=true]:bg-accent data-[here=true]:text-accent-foreground',
        inset && 'ps-8',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ms-auto size-3.5!" />
    </BaseUIMenu.SubmenuTrigger>
  );
}

// SubContent - A container for submenu items
function MenubarSubContent({ className, ...props }: React.ComponentProps<typeof BaseUIMenu.Popup>) {
  return (
    <BaseUIMenu.Portal>
      <BaseUIMenu.Positioner sideOffset={-4} alignOffset={-4}>
        <BaseUIMenu.Popup
          data-slot="menubar-sub-content"
          className={cn(
            'space-y-0.5 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className,
          )}
          {...props}
        />
      </BaseUIMenu.Positioner>
    </BaseUIMenu.Portal>
  );
}

// Shortcut - A shortcut display component
function MenubarShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarGroup,
  MenubarLabel,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarCheckboxItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarShortcut,
};

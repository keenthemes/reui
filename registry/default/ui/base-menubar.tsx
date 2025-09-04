'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Menu as BaseUIMenu } from '@base-ui-components/react/menu';
import { Menubar as BaseUIMenubar } from '@base-ui-components/react/menubar';
import { Check, ChevronRight } from 'lucide-react';

// Root - Groups all parts of the menubar
function Menubar({ className, ...props }: React.ComponentProps<typeof BaseUIMenubar>) {
  return (
    <BaseUIMenubar
      data-slot="menubar"
      className={cn('flex h-10 items-center gap-1 rounded-md border bg-background p-1', className)}
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
        'h-8 rounded px-3 text-sm font-medium text-foreground outline-none select-none',
        'focus-visible:bg-accent data-[disabled]:opacity-50 data-[popup-open]:bg-accent',
        '[&>svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&>svg]:shrink-0',
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

// Positioner - Positions the menubar popup against the trigger
function MenubarPositioner({ ...props }: React.ComponentProps<typeof BaseUIMenu.Positioner>) {
  return <BaseUIMenu.Positioner data-slot="menubar-positioner" {...props} />;
}

// Popup - A container for the menubar items
function MenubarPopup({ className, ...props }: React.ComponentProps<typeof BaseUIMenu.Popup>) {
  return (
    <BaseUIMenu.Popup
      data-slot="menubar-popup"
      className={cn(
        'origin-[var(--transform-origin)] rounded-md bg-popover py-1 text-popover-foreground shadow-lg shadow-black/5 outline outline-border',
        'data-[ending-style]:opacity-0 data-[ending-style]:transition-opacity data-[instant]:transition-none',
        'dark:shadow-none dark:outline dark:-outline-offset-1 dark:outline-border',
        className,
      )}
      {...props}
    />
  );
}

// Item - An individual interactive item in the menubar
function MenubarItem({
  className,
  inset,
  variant,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.Item> & {
  inset?: boolean;
  variant?: 'destructive';
}) {
  return (
    <BaseUIMenu.Item
      data-slot="menubar-item"
      className={cn(
        'flex cursor-default items-center justify-between gap-4 px-4 py-2 text-sm leading-4 outline-none select-none',
        'data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-foreground',
        'data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-accent',
        '[&_svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
        inset && 'ps-8',
        variant === 'destructive' &&
          'text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/5 focus:bg-destructive/5 data-[active=true]:bg-destructive/5',
        className,
      )}
      {...props}
    />
  );
}

// Separator - A separator element accessible to screen readers
function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof BaseUIMenu.Separator>) {
  return (
    <BaseUIMenu.Separator data-slot="menubar-separator" className={cn('my-1.5 h-px bg-border', className)} {...props} />
  );
}

// Group - Groups related menubar items with the corresponding label
function MenubarGroup({ ...props }: React.ComponentProps<typeof BaseUIMenu.Group>) {
  return <BaseUIMenu.Group data-slot="menubar-group" {...props} />;
}

// GroupLabel - An accessible label that is automatically associated with its parent group
function MenubarGroupLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.GroupLabel> & {
  inset?: boolean;
}) {
  return (
    <BaseUIMenu.GroupLabel
      data-slot="menubar-group-label"
      className={cn('px-2 py-1.5 text-xs text-muted-foreground font-medium', inset && 'ps-8', className)}
      {...props}
    />
  );
}

// RadioGroup - Groups related radio items
function MenubarRadioGroup({ ...props }: React.ComponentProps<typeof BaseUIMenu.RadioGroup>) {
  return <BaseUIMenu.RadioGroup data-slot="menubar-radio-group" {...props} />;
}

// RadioItem - A menubar item that works like a radio button in a given group
function MenubarRadioItem({ className, children, ...props }: React.ComponentProps<typeof BaseUIMenu.RadioItem>) {
  return (
    <BaseUIMenu.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        'flex cursor-default items-center justify-between gap-4 ps-8 pe-4 py-2 text-sm leading-4 outline-none select-none',
        'data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-foreground',
        'data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-accent',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    >
      {children}
      <span className="absolute start-2.5 flex h-3.5 w-3.5 items-center justify-center">
        <BaseUIMenu.RadioItemIndicator className="size-1.5 rounded-full bg-primary" />
      </span>
    </BaseUIMenu.RadioItem>
  );
}

// RadioItemIndicator - Indicates whether the radio item is selected
function MenubarRadioItemIndicator({ ...props }: React.ComponentProps<typeof BaseUIMenu.RadioItemIndicator>) {
  return <BaseUIMenu.RadioItemIndicator data-slot="menubar-radio-item-indicator" {...props} />;
}

// CheckboxItem - A menubar item that toggles a setting on or off
function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.CheckboxItem>) {
  return (
    <BaseUIMenu.CheckboxItem
      data-slot="menubar-checkbox-item"
      checked={checked}
      className={cn(
        'relative flex cursor-default items-center gap-4 ps-8 pe-4 py-2 text-sm leading-4 outline-none select-none',
        'data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-foreground',
        'data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-accent',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    >
      <span className="absolute start-2.5 flex h-3.5 w-3.5 items-center justify-center">
        <BaseUIMenu.CheckboxItemIndicator>
          <Check className="h-4 w-4 text-primary" />
        </BaseUIMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseUIMenu.CheckboxItem>
  );
}

// CheckboxItemIndicator - Indicates whether the checkbox item is ticked
function MenubarCheckboxItemIndicator({ ...props }: React.ComponentProps<typeof BaseUIMenu.CheckboxItemIndicator>) {
  return <BaseUIMenu.CheckboxItemIndicator data-slot="menubar-checkbox-item-indicator" {...props} />;
}

// SubmenuRoot - Groups all parts of a submenu
function MenubarSubmenuRoot({ ...props }: React.ComponentProps<typeof BaseUIMenu.SubmenuRoot>) {
  return <BaseUIMenu.SubmenuRoot data-slot="menubar-submenu-root" {...props} />;
}

// SubmenuTrigger - A menubar item that opens a submenu
function MenubarSubmenuTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.SubmenuTrigger> & {
  inset?: boolean;
}) {
  return (
    <BaseUIMenu.SubmenuTrigger
      data-slot="menubar-submenu-trigger"
      className={cn(
        'flex w-full cursor-default items-center justify-between gap-4 px-4 py-2 text-sm leading-4 outline-none select-none',
        'data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-foreground',
        'data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-accent',
        'data-[popup-open]:relative data-[popup-open]:z-0 data-[popup-open]:before:absolute data-[popup-open]:before:inset-x-1 data-[popup-open]:before:inset-y-0 data-[popup-open]:before:z-[-1] data-[popup-open]:before:rounded-sm data-[popup-open]:before:bg-accent/50',
        'data-[highlighted]:data-[popup-open]:before:bg-accent',
        '[&>svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&>svg]:shrink-0',
        inset && 'ps-8',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight data-slot="menubar-submenu-trigger-indicator" className="size-3.5 rtl:rotate-180" />
    </BaseUIMenu.SubmenuTrigger>
  );
}

// Shortcut - A shortcut display component
function MenubarShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn('ms-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarPositioner,
  MenubarPopup,
  MenubarItem,
  MenubarSeparator,
  MenubarGroup,
  MenubarGroupLabel,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarRadioItemIndicator,
  MenubarCheckboxItem,
  MenubarCheckboxItemIndicator,
  MenubarSubmenuRoot,
  MenubarSubmenuTrigger,
  MenubarShortcut,
};

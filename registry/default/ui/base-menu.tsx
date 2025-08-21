'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { Menu as BaseUIMenu } from '@base-ui-components/react/menu';

// Root - Groups all parts of the menu
function Menu({ ...props }: React.ComponentProps<typeof BaseUIMenu.Root>) {
  return <BaseUIMenu.Root data-slot="menu" {...props} />;
}

// Trigger - A button that opens the menu
function MenuTrigger({ ...props }: React.ComponentProps<typeof BaseUIMenu.Trigger>) {
  return <BaseUIMenu.Trigger data-slot="menu-trigger" {...props} />;
}

// Portal - A portal element that moves the popup to a different part of the DOM
function MenuPortal({ ...props }: React.ComponentProps<typeof BaseUIMenu.Portal>) {
  return <BaseUIMenu.Portal data-slot="menu-portal" {...props} />;
}

// Backdrop - An overlay displayed beneath the menu popup
function MenuBackdrop({ ...props }: React.ComponentProps<typeof BaseUIMenu.Backdrop>) {
  return <BaseUIMenu.Backdrop data-slot="menu-backdrop" {...props} />;
}

// Positioner - Positions the menu popup against the trigger
function MenuPositioner({ ...props }: React.ComponentProps<typeof BaseUIMenu.Positioner>) {
  return <BaseUIMenu.Positioner data-slot="menu-positioner" {...props} />;
}

// Popup - A container for the menu items
function MenuPopup({ ...props }: React.ComponentProps<typeof BaseUIMenu.Popup>) {
  return <BaseUIMenu.Popup 
		data-slot="menu-popup" 
		{...props} 
		className={cn(
			'space-y-0.5 z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md shadow-black/5',
			'origin-[var(--transform-origin)] transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
			props.className
		)
	} 
	/>;
}

// Arrow - Displays an element positioned against the menu anchor
function MenuArrow({ ...props }: React.ComponentProps<typeof BaseUIMenu.Arrow>) {
  return <BaseUIMenu.Arrow data-slot="menu-arrow" {...props} />;
}

// Item - An individual interactive item in the menu
function MenuItem({
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
      data-slot="menu-item"
      {...props}
      className={cn(
        'text-foreground relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden transition-colors data-disabled:pointer-events-none data-disabled:opacity-50',
				'[&_svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
        'focus:bg-accent focus:text-foreground',
        'data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-foreground',
        inset && 'ps-8',
        variant === 'destructive' &&
          'text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/5 focus:bg-destructive/5 data-[active=true]:bg-destructive/5',
        className,
      )}
    />
  );
}

// Separator - A separator element accessible to screen readers
function MenuSeparator({ className, ...props }: React.ComponentProps<typeof BaseUIMenu.Separator>) {
  return (
    <BaseUIMenu.Separator
      data-slot="menu-separator"
			{...props}
      className={cn('-mx-2 my-1.5 h-px bg-muted', className)}      
    />
  );
}

// Group - Groups related menu items with the corresponding label
function MenuGroup({ ...props }: React.ComponentProps<typeof BaseUIMenu.Group>) {
  return <BaseUIMenu.Group data-slot="menu-group" {...props} />;
}

// GroupLabel - An accessible label that is automatically associated with its parent group
function MenuGroupLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.GroupLabel> & {
  inset?: boolean;
}) {
  return (
    <BaseUIMenu.GroupLabel
      data-slot="menu-group-label"
			{...props}
      className={cn('px-2 py-1.5 text-xs text-muted-foreground font-medium', inset && 'ps-8', className)}      
    />
  );
}

// RadioGroup - Groups related radio items
function MenuRadioGroup({ ...props }: React.ComponentProps<typeof BaseUIMenu.RadioGroup>) {
  return <BaseUIMenu.RadioGroup data-slot="menu-radio-group" {...props} />;
}

// RadioItem - A menu item that works like a radio button in a given group
function MenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.RadioItem>) {
  return (
    <BaseUIMenu.RadioItem
      data-slot="menu-radio-item"
			{...props}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-md py-1.5 ps-6 pe-2 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
				className,
      )}      
    >
      <span className="absolute start-1.5 flex h-3.5 w-3.5 items-center justify-center">
        <BaseUIMenu.RadioItemIndicator>
          <Circle className="h-1.5 w-1.5 fill-primary stroke-primary" />
        </BaseUIMenu.RadioItemIndicator>
      </span>
      {children}
    </BaseUIMenu.RadioItem>
  );
}

// RadioItemIndicator - Indicates whether the radio item is selected
function MenuRadioItemIndicator({ ...props }: React.ComponentProps<typeof BaseUIMenu.RadioItemIndicator>) {
  return <BaseUIMenu.RadioItemIndicator data-slot="menu-radio-item-indicator" {...props} />;
}

// CheckboxItem - A menu item that toggles a setting on or off
function MenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.CheckboxItem>) {
  return (
    <BaseUIMenu.CheckboxItem
      data-slot="menu-checkbox-item"
			checked={checked}
      {...props}
      className={cn(
        'relative flex gap-2 cursor-default select-none items-center rounded-md py-1.5 ps-8 pe-2 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
				className,
      )}      
    >
      <span className="absolute start-2 flex h-3.5 w-3.5 items-center text-muted-foreground justify-center">
        <BaseUIMenu.CheckboxItemIndicator>
          <Check className="h-4 w-4 text-primary" />
        </BaseUIMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseUIMenu.CheckboxItem>
  );
}

// CheckboxItemIndicator - Indicates whether the checkbox item is ticked
function MenuCheckboxItemIndicator({ ...props }: React.ComponentProps<typeof BaseUIMenu.CheckboxItemIndicator>) {
  return <BaseUIMenu.CheckboxItemIndicator data-slot="menu-checkbox-item-indicator" {...props} />;
}

// SubmenuRoot - Groups all parts of a submenu
function MenuSubmenuRoot({ ...props }: React.ComponentProps<typeof BaseUIMenu.SubmenuRoot>) {
  return <BaseUIMenu.SubmenuRoot data-slot="menu-submenu-root" {...props} />;
}

// SubmenuTrigger - A menu item that opens a submenu
function MenuSubmenuTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof BaseUIMenu.SubmenuTrigger> & {
  inset?: boolean;
}) {
  return (
    <BaseUIMenu.SubmenuTrigger
      data-slot="menu-submenu-trigger"
			{...props}
      className={cn(
        'flex cursor-default gap-2 select-none items-center rounded-md px-2 py-1.5 text-sm outline-hidden',
        'focus:bg-accent focus:text-foreground',
        '[&[data-popup-open]]:bg-accent [&[data-popup-open]]:text-foreground',
        '[&>svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&>svg:not([class*=size-])]:size-4 [&>svg]:shrink-0',
        inset && 'ps-8',
        className,
      )}      
    >
      {children}
      <ChevronRight data-slot="menu-submenu-trigger-indicator" className="ms-auto size-3.5! rtl:rotate-180" />
    </BaseUIMenu.SubmenuTrigger>
  );
}

// Shortcut - A shortcut display component
function MenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="menu-shortcut"
			{...props}
      className={cn('ms-auto text-xs tracking-widest opacity-60', className)}      
    />
  );
}

export {
  Menu,
  MenuTrigger,
  MenuPortal,
  MenuBackdrop,
  MenuPositioner,
  MenuPopup,
  MenuArrow,
  MenuItem,
  MenuSeparator,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRadioItemIndicator,
  MenuCheckboxItem,
  MenuCheckboxItemIndicator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuShortcut,
};

'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Combobox as ComboboxPrimitive } from '@base-ui-components/react/combobox';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronDown, X } from 'lucide-react';

// Define input size variants (without file: part)
const inputVariants = cva(
  `
    flex w-full bg-background border border-input shadow-xs shadow-black/5 transition-[color,box-shadow] text-foreground placeholder:text-muted-foreground/80 
    focus-visible:ring-ring/30 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px]     
    has-[[data-slot=combobox-input]:focus-visible]:ring-ring/30 
    has-[[data-slot=combobox-input]:focus-visible]:border-ring
    has-[[data-slot=combobox-input]:focus-visible]:outline-none
    has-[[data-slot=combobox-input]:focus-visible]:ring-[3px]
    [&_[data-slot=combobox-input]]:grow
    disabled:cursor-not-allowed disabled:opacity-60 
    [&[readonly]]:bg-muted/80 [&[readonly]]:cursor-not-allowed
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
  `,
  {
    variants: {
      variant: {
        lg: 'py-1 min-h-10 px-4 text-sm rounded-md [&~[data-slot=combobox-icon]]:end-2.5 [&~[data-slot=combobox-clear]]:end-7',
        md: 'py-1 min-h-8.5 px-3 text-[0.8125rem] leading-(--text-sm--line-height) rounded-md [&~[data-slot=combobox-icon]]:end-2 [&~[data-slot=combobox-clear]]:end-6',
        sm: 'py-0.5 min-h-7 px-2.5 text-xs rounded-md [&~[data-slot=combobox-icon]]:end-1.75 [&~[data-slot=combobox-clear]]:end-5.75',
      },
    },
    defaultVariants: {
      variant: 'md',
    },
  },
);

const chipsVariants = cva(
  [
    'flex items-center flex-wrap gap-1',
    '[&_[data-slot=combobox-input]]:py-0 [&_[data-slot=combobox-input]]:px-1.5 has-[[data-slot=combobox-chip]]:[&_[data-slot=combobox-input]]:px-0',
    '[&_[data-slot=combobox-input]]:min-h-0 [&_[data-slot=combobox-input]]:flex-1',
    '[&_[data-slot=combobox-input]]:border-0 [&_[data-slot=combobox-input]]:shadow-none [&_[data-slot=combobox-input]]:rounded-none',
    '[&_[data-slot=combobox-input]]:outline-none [&_[data-slot=combobox-input]]:ring-0',
  ],
  {
    variants: {
      variant: {
        sm: 'px-0.75',
        md: 'px-1',
        lg: 'px-1.5',
      },
    },
  },
);

// Root - Groups all parts of the combobox
function Combobox({ ...props }: React.ComponentProps<typeof ComboboxPrimitive.Root>) {
  return <ComboboxPrimitive.Root data-slot="combobox" {...props} />;
}

// Input and Clear controls
function ComboboxControl({ className, ...props }: React.ComponentProps<'div'>) {
  return <span data-slot="combobox-control" className={cn('relative', className)} {...props} />;
}

// Value - Displays the selected value
function ComboboxValue({ ...props }: React.ComponentProps<typeof ComboboxPrimitive.Value>) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

// Input - The input element for typing
function ComboboxInput({
  className,
  variant = 'md',
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input> & VariantProps<typeof inputVariants>) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      data-variant={variant}
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  );
}

// Status - Displays the status of the combobox
function ComboboxStatus({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Status>) {
  return (
    <ComboboxPrimitive.Status
      data-slot="combobox-status"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

// Portal - A portal element that moves the popup to a different part of the DOM
function ComboboxPortal({ ...props }: React.ComponentProps<typeof ComboboxPrimitive.Portal>) {
  return <ComboboxPrimitive.Portal data-slot="combobox-portal" {...props} />;
}

// Backdrop - An overlay displayed beneath the combobox popup
function ComboboxBackdrop({ ...props }: React.ComponentProps<typeof ComboboxPrimitive.Backdrop>) {
  return <ComboboxPrimitive.Backdrop data-slot="combobox-backdrop" {...props} />;
}

function ComboboxContent({
  className,
  children,
  showBackdrop = false,
  align = 'start',
  sideOffset = 4,
  alignOffset = 0,
  side = 'bottom',
  anchor,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Popup> & {
  align?: ComboboxPrimitive.Positioner.Props['align'];
  sideOffset?: ComboboxPrimitive.Positioner.Props['sideOffset'];
  alignOffset?: ComboboxPrimitive.Positioner.Props['alignOffset'];
  anchor?: ComboboxPrimitive.Positioner.Props['anchor'];
  side?: ComboboxPrimitive.Positioner.Props['side'];
  showBackdrop?: boolean;
}) {
  return (
    <ComboboxPortal>
      {showBackdrop && <ComboboxBackdrop />}
      <ComboboxPositioner align={align} sideOffset={sideOffset} alignOffset={alignOffset} side={side} anchor={anchor}>
        <ComboboxPopup className={className} {...props}>
          {children}
        </ComboboxPopup>
      </ComboboxPositioner>
    </ComboboxPortal>
  );
}

// Positioner - Positions the combobox popup against the input
function ComboboxPositioner({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Positioner>) {
  return (
    <ComboboxPrimitive.Positioner
      data-slot="combobox-positioner"
      className={cn('z-50 outline-none', className)}
      {...props}
    />
  );
}

// Popup - A container for the combobox options
function ComboboxPopup({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Popup>) {
  return (
    <ComboboxPrimitive.Popup
      data-slot="combobox-popup"
      className={cn(
        'py-1 w-[var(--anchor-width)] max-h-[min(var(--available-height),23rem)] max-w-[var(--available-width)]',
        'overflow-y-auto scroll-pt-2 scroll-pb-2 overscroll-contain bg-[canvas]',
        'rounded-md border border-border bg-popover text-popover-foreground shadow-md shadow-black/5',
        'origin-[var(--transform-origin)] transition-[transform,scale,opacity] data-[ending-style]:scale-90',
        'data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

// List - A container for the combobox options
function ComboboxList({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return <ComboboxPrimitive.List data-slot="combobox-list" className={cn('space-y-0.5', className)} {...props} />;
}

// Collection - A collection of combobox items
function ComboboxCollection({ ...props }: React.ComponentProps<typeof ComboboxPrimitive.Collection>) {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />;
}

// Row - A row container for combobox items
function ComboboxRow({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Row>) {
  return (
    <ComboboxPrimitive.Row data-slot="combobox-row" className={cn('flex items-center gap-2', className)} {...props} />
  );
}

// Item - An individual selectable option in the combobox
function ComboboxItem({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Item>) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        'relative cursor-default flex items-center',
        'text-foreground relative select-none items-center gap-2 rounded-md ps-7 pe-2 py-1.5 text-sm outline-hidden transition-colors data-disabled:pointer-events-none data-disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
        'data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-foreground data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-accent',
        className,
      )}
      {...props}
    />
  );
}

// ItemIndicator - An indicator for selected items
function ComboboxItemIndicator({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.ItemIndicator>) {
  return (
    <ComboboxPrimitive.ItemIndicator
      data-slot="combobox-item-indicator"
      className={cn('absolute flex top-1/2 -translate-y-1/2 items-center justify-center start-2.5', className)}
      {...props}
    >
      <Check className="h-4 w-4 text-primary" />
    </ComboboxPrimitive.ItemIndicator>
  );
}

// Group - Groups related combobox items with the corresponding label
function ComboboxGroup({ ...props }: React.ComponentProps<typeof ComboboxPrimitive.Group>) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" {...props} />;
}

// GroupLabel - An accessible label that is automatically associated with its parent group
function ComboboxGroupLabel({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.GroupLabel>) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-group-label"
      className={cn('px-2 py-1.5 text-xs text-muted-foreground font-medium', className)}
      {...props}
    />
  );
}

// Empty - A component to display when no options are available
function ComboboxEmpty({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn('px-2 py-1.5 text-sm text-muted-foreground empty:m-0 empty:p-0', className)}
      {...props}
    />
  );
}

// Clear - A button to clear the input value
function ComboboxClear({ className, children, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Clear>) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      className={cn(
        'absolute cursor-pointer end-6 top-1/2 -translate-y-1/2 rounded-sm opacity-70 ring-offset-background',
        'transition-opacity opacity-60 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none',
        'data-[disabled]:pointer-events-none',
        className,
      )}
      {...props}
    >
      {children ? children : <X className="size-3.5 opacity-100" />}
    </ComboboxPrimitive.Clear>
  );
}

// Icon - An icon element for the combobox
function ComboboxIcon({ className, children, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Icon>) {
  return (
    <ComboboxPrimitive.Icon
      data-slot="combobox-icon"
      className={cn(
        'absolute cursor-pointer end-2 top-1/2 -translate-y-1/2 rounded-sm opacity-70 ring-offset-background transition-opacity',
        'opacity-60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none',
        'data-[disabled]:pointer-events-none',
        className,
      )}
      {...props}
    >
      {children ? children : <ChevronDown className="size-3.5 opacity-100" />}
    </ComboboxPrimitive.Icon>
  );
}

// Arrow - Displays an element positioned against the combobox anchor
function ComboboxArrow({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Arrow>) {
  return <ComboboxPrimitive.Arrow data-slot="combobox-arrow" className={cn('', className)} {...props} />;
}

// Trigger - A button that opens the combobox
function ComboboxTrigger({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Trigger>) {
  return <ComboboxPrimitive.Trigger data-slot="combobox-trigger" className={cn('relative', className)} {...props} />;
}

// Chips - A container for selected items as chips (for multi-select)
function ComboboxChips({
  className,
  variant = 'md',
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chips> & VariantProps<typeof inputVariants>) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(inputVariants({ variant }), chipsVariants({ variant }), className)}
      {...props}
    />
  );
}

// Chip - An individual chip representing a selected item
function ComboboxChip({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Chip>) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        'inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground',
        className,
      )}
      {...props}
    />
  );
}

// ChipRemove - A button to remove a chip
function ComboboxChipRemove({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ChipRemove>) {
  return (
    <ComboboxPrimitive.ChipRemove
      data-slot="combobox-chip-remove"
      className={cn(
        'cursor-pointer ms-1 rounded-sm [&_svg]:opacity-60 hover:bg-muted-foreground/20 hover:[&_svg]:opacity-100',
        className,
      )}
      {...props}
    >
      {children ? children : <X className="size-3.5" />}
    </ComboboxPrimitive.ChipRemove>
  );
}

// Separator - A separator element accessible to screen readers
function ComboboxSeparator({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Separator>) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn('my-1.5 h-px bg-muted', className)}
      {...props}
    />
  );
}

export {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxValue,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxIcon,
  ComboboxStatus,
  ComboboxPortal,
  ComboboxBackdrop,
  ComboboxPositioner,
  ComboboxPopup,
  ComboboxList,
  ComboboxCollection,
  ComboboxRow,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxEmpty,
  ComboboxClear,
  ComboboxArrow,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxSeparator,
};

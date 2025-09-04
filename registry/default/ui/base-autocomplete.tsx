'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Autocomplete as BaseUIAutocomplete } from '@base-ui-components/react/autocomplete';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

// Define input size variants (without file: part)
const inputVariants = cva(
  `
    flex w-full bg-background border border-input shadow-xs shadow-black/5 transition-[color,box-shadow] text-foreground placeholder:text-muted-foreground/80 
    focus-visible:ring-ring/30 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px]     
    disabled:cursor-not-allowed disabled:opacity-60 
    [&[readonly]]:bg-muted/80 [&[readonly]]:cursor-not-allowed
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
  `,
  {
    variants: {
      variant: {
        lg: 'h-10 px-4 text-sm rounded-md',
        md: 'h-8.5 px-3 text-[0.8125rem] leading-(--text-sm--line-height) rounded-md',
        sm: 'h-7 px-2.5 text-xs rounded-md',
      },
    },
    defaultVariants: {
      variant: 'md',
    },
  },
);

// Root - Groups all parts of the autocomplete
function Autocomplete({ ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Root>) {
  return <BaseUIAutocomplete.Root data-slot="autocomplete" {...props} />;
}

// Value - Displays the selected value
function AutocompleteValue({ ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Value>) {
  return <BaseUIAutocomplete.Value data-slot="autocomplete-value" {...props} />;
}

// Input and Clear controls
function AutocompleteControl({ className, ...props }: React.ComponentProps<'div'>) {
  return <span data-slot="autocomplete-control" className={cn('relative', className)} {...props} />;
}

// Trigger - A button that opens the autocomplete
function AutocompleteTrigger({ ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Trigger>) {
  return <BaseUIAutocomplete.Trigger data-slot="autocomplete-trigger" {...props} />;
}

// Input - The input element for typing
function AutocompleteInput({
  className,
  variant = 'md',
  ...props
}: React.ComponentProps<typeof BaseUIAutocomplete.Input> & VariantProps<typeof inputVariants>) {
  return (
    <BaseUIAutocomplete.Input
      data-slot="autocomplete-input"
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  );
}

// Icon - An icon element for the autocomplete
function AutocompleteIcon({ className, ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Icon>) {
  return (
    <BaseUIAutocomplete.Icon data-slot="autocomplete-icon" className={cn('h-4 w-4 opacity-50', className)} {...props} />
  );
}

// Status - Displays the status of the autocomplete
function AutocompleteStatus({ className, ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Status>) {
  return (
    <BaseUIAutocomplete.Status
      data-slot="autocomplete-status"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

// Portal - A portal element that moves the popup to a different part of the DOM
function AutocompletePortal({ ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Portal>) {
  return <BaseUIAutocomplete.Portal data-slot="autocomplete-portal" {...props} />;
}

// Backdrop - An overlay displayed beneath the autocomplete popup
function AutocompleteBackdrop({ ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Backdrop>) {
  return <BaseUIAutocomplete.Backdrop data-slot="autocomplete-backdrop" {...props} />;
}

// Positioner - Positions the autocomplete popup against the input
function AutocompletePositioner({ className, ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Positioner>) {
  return (
    <BaseUIAutocomplete.Positioner
      data-slot="autocomplete-positioner"
      className={cn('outline-none', className)}
      {...props}
    />
  );
}

// Popup - A container for the autocomplete options
function AutocompletePopup({ className, ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Popup>) {
  return (
    <BaseUIAutocomplete.Popup
      data-slot="autocomplete-popup"
      className={cn(
        'w-[var(--anchor-width)] max-h-[min(var(--available-height),23rem)] max-w-[var(--available-width)]',
        'overflow-y-auto scroll-pt-2 scroll-pb-2 overscroll-contain bg-[canvas]',
        'rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md shadow-black/5',
        'origin-[var(--transform-origin)] transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

// List - A container for the autocomplete options
function AutocompleteList({ className, ...props }: React.ComponentProps<typeof BaseUIAutocomplete.List>) {
  return <BaseUIAutocomplete.List data-slot="autocomplete-list" className={cn('space-y-0.5', className)} {...props} />;
}

// Collection - A collection of autocomplete items
function AutocompleteCollection({ ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Collection>) {
  return <BaseUIAutocomplete.Collection data-slot="autocomplete-collection" {...props} />;
}

// Row - A row container for autocomplete items
function AutocompleteRow({ className, ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Row>) {
  return (
    <BaseUIAutocomplete.Row
      data-slot="autocomplete-row"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  );
}

// Item - An individual selectable option in the autocomplete
function AutocompleteItem({ className, ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Item>) {
  return (
    <BaseUIAutocomplete.Item
      data-slot="autocomplete-item"
      className={cn(
        'text-foreground relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden transition-colors data-disabled:pointer-events-none data-disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
        'data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-foreground',
        'data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-accent',
        className,
      )}
      {...props}
    />
  );
}

// Group - Groups related autocomplete items with the corresponding label
function AutocompleteGroup({ ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Group>) {
  return <BaseUIAutocomplete.Group data-slot="autocomplete-group" {...props} />;
}

// GroupLabel - An accessible label that is automatically associated with its parent group
function AutocompleteGroupLabel({ className, ...props }: React.ComponentProps<typeof BaseUIAutocomplete.GroupLabel>) {
  return (
    <BaseUIAutocomplete.GroupLabel
      data-slot="autocomplete-group-label"
      className={cn('px-2 py-1.5 text-xs text-muted-foreground font-medium', className)}
      {...props}
    />
  );
}

// Empty - A component to display when no options are available
function AutocompleteEmpty({ className, ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Empty>) {
  return (
    <BaseUIAutocomplete.Empty
      data-slot="autocomplete-empty"
      className={cn('px-2 py-1.5 text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

// Clear - A button to clear the input value
function AutocompleteClear({ className, children, ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Clear>) {
  return (
    <BaseUIAutocomplete.Clear
      data-slot="autocomplete-clear"
      className={cn(
        'absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none',
        'data-[disabled]:pointer-events-none',
        className,
      )}
      {...props}
    >
      {children ? children : <X className="size-3.5" />}
    </BaseUIAutocomplete.Clear>
  );
}

// Arrow - Displays an element positioned against the autocomplete anchor
function AutocompleteArrow({ ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Arrow>) {
  return <BaseUIAutocomplete.Arrow data-slot="autocomplete-arrow" {...props} />;
}

// Separator - A separator element accessible to screen readers
function AutocompleteSeparator({ className, ...props }: React.ComponentProps<typeof BaseUIAutocomplete.Separator>) {
  return (
    <BaseUIAutocomplete.Separator
      data-slot="autocomplete-separator"
      className={cn('-mx-2 my-1.5 h-px bg-muted', className)}
      {...props}
    />
  );
}

export {
  Autocomplete,
  AutocompleteControl,
  AutocompleteValue,
  AutocompleteTrigger,
  AutocompleteInput,
  AutocompleteIcon,
  AutocompleteStatus,
  AutocompletePortal,
  AutocompleteBackdrop,
  AutocompletePositioner,
  AutocompletePopup,
  AutocompleteList,
  AutocompleteCollection,
  AutocompleteRow,
  AutocompleteItem,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
  AutocompleteClear,
  AutocompleteArrow,
  AutocompleteSeparator,
};

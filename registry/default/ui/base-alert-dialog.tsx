'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { AlertDialog } from '@base-ui-components/react/alert-dialog';

// Base UI Alert Dialog Root
function AlertDialogRoot({ ...props }: React.ComponentProps<typeof AlertDialog.Root>) {
  return <AlertDialog.Root data-slot="alert-dialog" {...props} />;
}

// Base UI Alert Dialog Trigger with asChild support
function AlertDialogTrigger({
  asChild = false,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialog.Trigger> & { asChild?: boolean }) {
  const triggerProps = {
    'data-slot': 'alert-dialog-trigger' as const,
    ...props,
    ...(asChild && {
      render: children as React.ReactElement<Record<string, unknown>, string | React.JSXElementConstructor<unknown>>,
    }),
  };

  return asChild ? (
    <AlertDialog.Trigger {...triggerProps} />
  ) : (
    <AlertDialog.Trigger {...triggerProps}>{children}</AlertDialog.Trigger>
  );
}

// Base UI Alert Dialog Portal
function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialog.Portal>) {
  return <AlertDialog.Portal data-slot="alert-dialog-portal" {...props} />;
}

// Base UI Alert Dialog Backdrop
function AlertDialogBackdrop({ className, ...props }: React.ComponentProps<typeof AlertDialog.Backdrop>) {
  return (
    <AlertDialog.Backdrop
      data-slot="alert-dialog-backdrop"
      className={cn(
        'fixed inset-0 z-50 bg-black/30 [backdrop-filter:blur(4px)] transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

// Base UI Alert Dialog Popup
function AlertDialogPopup({ className, ...props }: React.ComponentProps<typeof AlertDialog.Popup>) {
  return (
    <AlertDialog.Popup
      data-slot="alert-dialog-popup"
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg shadow-black/5 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 sm:rounded-lg',
        className,
      )}
      {...props}
    />
  );
}

// Alert Dialog Header (helper component)
const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="alert-dialog-header"
    className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
    {...props}
  />
);

// Alert Dialog Footer (helper component)
const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="alert-dialog-footer"
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2.5', className)}
    {...props}
  />
);

// Base UI Alert Dialog Title
function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialog.Title>) {
  return (
    <AlertDialog.Title data-slot="alert-dialog-title" className={cn('text-lg font-semibold', className)} {...props} />
  );
}

// Base UI Alert Dialog Description
function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialog.Description>) {
  return (
    <AlertDialog.Description
      data-slot="alert-dialog-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

// Base UI Alert Dialog Close (generic) with asChild support
function AlertDialogClose({
  asChild = false,
  className,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialog.Close> & { asChild?: boolean }) {
  const closeProps = {
    'data-slot': 'alert-dialog-close' as const,
    className: cn(className),
    ...props,
    ...(asChild && {
      render: children as React.ReactElement<Record<string, unknown>, string | React.JSXElementConstructor<unknown>>,
    }),
  };

  return asChild ? (
    <AlertDialog.Close {...closeProps} />
  ) : (
    <AlertDialog.Close {...closeProps}>{children}</AlertDialog.Close>
  );
}

// Exports with proper naming to match Base UI pattern
export {
  AlertDialogRoot as AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
  AlertDialogHeader,
  AlertDialogFooter,
};

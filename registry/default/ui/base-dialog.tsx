import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { buttonVariants } from '@/registry/default/ui/base-button';
import { Dialog as DialogPrimitive } from '@base-ui-components/react/dialog';
import { X } from 'lucide-react';

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogAction({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-action"
      className={cn(!props.render && buttonVariants(), className)}
      {...props}
    />
  );
}

function DialogClose({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className={cn(!props.render && buttonVariants({ variant: 'outline' }), className)}
      {...props}
    />
  );
}

// Base UI Dialog Backdrop
function DialogBackdrop({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        'fixed inset-0 z-50 bg-black/30 [backdrop-filter:blur(4px)] transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

function DialogPopup({
  className,
  fullscreen = false,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & { fullscreen?: boolean }) {
  return (
    <DialogPrimitive.Popup
      data-slot="dialog-popup"
      className={cn(
        `
          fixed z-50 grid
          gap-4 border bg-background p-6 shadow-lg shadow-black/5 
          transition-all duration-150 
          data-[ending-style]:scale-90 data-[ending-style]:opacity-0 
          data-[starting-style]:scale-90 data-[starting-style]:opacity-0 
          sm:rounded-lg
        `,
        fullscreen
          ? 'inset-5'
          : 'left-[50%] top-[50%] w-full max-w-[calc(100%-2rem)] sm:max-w-lg translate-x-[-50%] translate-y-[-50%]',
        className,
      )}
      {...props}
    />
  );
}

export interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Popup> {
  showDismissButton?: boolean;
  showBackdrop?: boolean;
  fullscreen?: boolean;
}

function DialogContent({
  className,
  children,
  showBackdrop = true,
  showDismissButton = true,
  fullscreen = false,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      {showBackdrop && <DialogBackdrop />}
      <DialogPopup fullscreen={fullscreen} {...props} className={className}>
        {children}
        {showDismissButton && (
          <DialogPrimitive.Close
            data-slot="alert-dialog-dismiss"
            className={cn(buttonVariants({ variant: 'dim', size: 'sm' }), 'absolute top-2.5 end-2.5', className)}
          >
            <X />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPopup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sheet-body" className={cn('px-4 py-2.5', className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2.5', className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogAction,
  DialogContent,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogBackdrop,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

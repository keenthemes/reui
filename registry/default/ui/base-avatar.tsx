'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Avatar } from '@base-ui-components/react/avatar';
import { cva, VariantProps } from 'class-variance-authority';

const avatarStatusVariants = cva('flex items-center rounded-full size-2 border-2 border-background', {
  variants: {
    variant: {
      online: 'bg-green-600',
      offline: 'bg-zinc-600 dark:bg-zinc-300',
      busy: 'bg-yellow-600',
      away: 'bg-blue-600',
    },
  },
  defaultVariants: {
    variant: 'online',
  },
});

// Base UI Avatar Root
function AvatarRoot({ className, ...props }: React.ComponentProps<typeof Avatar.Root>) {
  return <Avatar.Root data-slot="avatar" className={cn('relative flex h-10 w-10 shrink-0', className)} {...props} />;
}

// Base UI Avatar Image
function AvatarImage({ className, ...props }: React.ComponentProps<typeof Avatar.Image>) {
  return (
    <Avatar.Image
      data-slot="avatar-image"
      className={cn('aspect-square overflow-hidden h-full w-full rounded-full', className)}
      {...props}
    />
  );
}

// Base UI Avatar Fallback
function AvatarFallback({ className, ...props }: React.ComponentProps<typeof Avatar.Fallback>) {
  return (
    <Avatar.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground overflow-hidden',
        className,
      )}
      {...props}
    />
  );
}

function AvatarIndicator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="avatar-indicator"
      className={cn('absolute flex size-6 items-center justify-center', className)}
      {...props}
    />
  );
}

function AvatarStatus({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof avatarStatusVariants>) {
  return <div data-slot="avatar-status" className={cn(avatarStatusVariants({ variant }), className)} {...props} />;
}

// Exports with proper naming to match Base UI pattern
export { AvatarRoot as Avatar, AvatarImage, AvatarFallback, AvatarIndicator, AvatarStatus, avatarStatusVariants };

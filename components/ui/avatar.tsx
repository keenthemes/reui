'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const avatarStatusVariants = cva(
  'flex items-center rounded-full size-2 border-2 border-background',
  {
    variants: {
      variant: {
        online: 'bg-green-600',
        offline: 'bg-mono/50',
        busy: 'bg-yellow-600',
        away: 'bg-blue-600',
      },
    },
    defaultVariants: {
      variant: 'online',
    },
  },
);

function Avatar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn('relative flex shrink-0 size-10', className)}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return (
    <div className={cn('relative overflow-hidden rounded-full', className)}>
      <AvatarPrimitive.Image
        data-slot="avatar-image"
        className={cn('aspect-square h-full w-full')}
        {...props}
      />
    </div>
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full border border-border bg-accent text-accent-foreground text-xs',
        className,
      )}
      {...props}
    />
  );
}

function AvatarIndicator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="avatar-indicator"
      className={cn(
        'absolute flex size-6 items-center justify-center',
        className,
      )}
      {...props}
    />
  );
}

function AvatarStatus({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof avatarStatusVariants>) {
  return (
    <div
      data-slot="avatar-status"
      className={cn(avatarStatusVariants({ variant }), className)}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
  avatarStatusVariants,
};

'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { toggleVariants } from '@/registry/default/ui/base-toggle';
import { Toggle as TogglePrimitive } from '@base-ui-components/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui-components/react/toggle-group';
import { type VariantProps } from 'class-variance-authority';

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: 'md',
  variant: 'default',
});

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive> & VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        'group/toggle-group flex items-center rounded-md gap-1 data-[variant=outline]:gap-0 data-[variant=outline]:shadow-xs',
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  value,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof toggleVariants> & { value: string }) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      value={value}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        'shrink-0 shadow-none data-[variant=outline]:rounded-none data-[variant=outline]:first:rounded-s-md data-[variant=outline]:last:rounded-e-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-s-0 data-[variant=outline]:first:border-s',
        className,
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}

export { ToggleGroup as ToggleGroup, ToggleGroupItem };
